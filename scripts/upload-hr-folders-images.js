const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local')
  console.error('   Make sure you have:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const BUCKET_NAME = 'truck-images'
const BASE_DIR = path.join(__dirname, '..')

// Folders to upload images from
const FOLDERS_TO_UPLOAD = [
  'HR 38 W 2162',
  'HR 38 W 2263',
  'HR 38 W 3426',
  'HR 55 X 0025',
  'HR 55 X 0253',
  'HR 55 X 1147',
  'HR 55 X 2071',
  'HR 55 X 4498'
]

async function uploadImageToSupabase(filePath, fileName, folderName) {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileExtension = path.extname(fileName).toLowerCase()
    const baseName = path.basename(fileName, fileExtension)
    
    // Create unique filename with timestamp and folder prefix
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const sanitizedFolderName = folderName.replace(/\s+/g, '-')
    const uniqueFileName = `${timestamp}-${sanitizedFolderName}-${baseName}${fileExtension}`

    // Determine content type
    let contentType = 'image/jpeg'
    if (fileExtension === '.png') {
      contentType = 'image/png'
    } else if (fileExtension === '.webp') {
      contentType = 'image/webp'
    } else if (fileExtension === '.gif') {
      contentType = 'image/gif'
    } else if (fileExtension === '.jpeg' || fileExtension === '.jpg') {
      contentType = 'image/jpeg'
    }

    console.log(`📤 Uploading: ${folderName}/${fileName} → ${uniqueFileName}`)

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, fileBuffer, {
        contentType: contentType,
        upsert: false
      })

    if (error) {
      console.error(`❌ Error uploading ${fileName}:`, error.message)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFileName)

    console.log(`✅ Uploaded: ${fileName}`)
    console.log(`   URL: ${urlData.publicUrl}`)

    return {
      originalName: fileName,
      folderName: folderName,
      originalPath: `${folderName}/${fileName}`,
      supabaseFileName: uniqueFileName,
      supabaseUrl: urlData.publicUrl
    }
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message)
    return null
  }
}

function getAllImageFilesFromFolder(folderName) {
  try {
    const folderPath = path.join(BASE_DIR, folderName)
    
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ Directory not found: ${folderPath}`)
      return []
    }

    const files = fs.readdirSync(folderPath)
    const imageFiles = files.filter(file => {
      // Skip .DS_Store and other non-image files
      if (file === '.DS_Store') return false
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
    })

    return imageFiles.map(file => ({
      name: file,
      path: path.join(folderPath, file),
      folderName: folderName
    }))
  } catch (error) {
    console.error(`❌ Error reading folder ${folderName}:`, error.message)
    return []
  }
}

async function main() {
  console.log('🚀 Starting image upload to Supabase Storage from HR folders...\n')

  let allImageFiles = []

  // Collect all image files from all folders
  for (const folderName of FOLDERS_TO_UPLOAD) {
    console.log(`📁 Scanning folder: ${folderName}`)
    const imageFiles = getAllImageFilesFromFolder(folderName)
    allImageFiles = allImageFiles.concat(imageFiles)
    console.log(`   Found ${imageFiles.length} image files\n`)
  }

  if (allImageFiles.length === 0) {
    console.log('⚠️  No image files found in any of the specified folders')
    return
  }

  console.log(`📊 Total images to upload: ${allImageFiles.length}\n`)
  console.log('='.repeat(60))

  const uploadResults = []
  let successCount = 0
  let errorCount = 0

  for (const imageFile of allImageFiles) {
    const result = await uploadImageToSupabase(
      imageFile.path,
      imageFile.name,
      imageFile.folderName
    )
    if (result) {
      uploadResults.push(result)
      successCount++
    } else {
      errorCount++
    }
    console.log('') // Empty line for readability
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('='.repeat(60))
  console.log('\n📊 Upload Summary:')
  console.log(`✅ Successfully uploaded: ${successCount} images`)
  console.log(`❌ Failed to upload: ${errorCount} images`)

  // Save mapping file
  const mappingFile = path.join(__dirname, '..', 'hr-folders-upload-mapping.json')
  fs.writeFileSync(mappingFile, JSON.stringify(uploadResults, null, 2))
  console.log(`\n💾 Upload mapping saved to: ${mappingFile}`)

  // Also append to existing mapping file if it exists
  const existingMappingFile = path.join(__dirname, '..', 'image-upload-mapping.json')
  if (fs.existsSync(existingMappingFile)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(existingMappingFile, 'utf8'))
      const combinedData = [...existingData, ...uploadResults]
      fs.writeFileSync(existingMappingFile, JSON.stringify(combinedData, null, 2))
      console.log(`💾 Also appended to existing mapping: ${existingMappingFile}`)
    } catch (error) {
      console.log(`⚠️  Could not append to existing mapping file: ${error.message}`)
    }
  }

  console.log('\n✅ Image upload process completed!')
}

main()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })

