const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Use the provided Supabase credentials
const supabaseUrl = 'https://zdxqxgnuzhgacveozqgf.supabase.co'
const supabaseAnonKey = 'sb_publishable_jYX0LjiSnWTRQ5bJ0pCIQQ_-EF_3pMM'

// Service role key provided by user
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeHF4Z251emhnYWN2ZW96cWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODEyNjI1MCwiZXhwIjoyMDgzNzAyMjUwfQ.bu7hWqLkBSekVYoPwuC_e7O_Jv6o1hhRzItii_E47lE'

// Use service role key if available (better for uploads), otherwise use anon key
const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const BUCKET_NAME = 'truck-images'
const BASE_DIR = path.join(__dirname, '..')
const FOLDER_NAME = 'HR 55 X 4498'

async function checkBucketExists() {
  console.log('🔍 Checking if bucket exists...\n')
  
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      // If we can't list buckets (permission issue), assume bucket exists and proceed
      console.log(`⚠️  Cannot list buckets (permission issue), assuming "${BUCKET_NAME}" exists...\n`)
      return true
    }

    const bucketExists = buckets && buckets.some(b => b.name === BUCKET_NAME)
    
    if (bucketExists) {
      console.log(`✅ Bucket "${BUCKET_NAME}" exists!\n`)
      return true
    }

    console.log(`⚠️  Bucket "${BUCKET_NAME}" not found in list.`)
    console.log(`   Assuming it exists (you mentioned you created it). Proceeding with upload...\n`)
    return true
  } catch (error) {
    console.log(`⚠️  Error checking bucket: ${error.message}`)
    console.log(`   Assuming bucket exists. Proceeding with upload...\n`)
    return true
  }
}

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
    } else if (fileExtension === '.mp4') {
      contentType = 'video/mp4'
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
      if (error.message.includes('new row violates row-level security') || error.message.includes('permission denied')) {
        console.error(`   ⚠️  This might be a permissions issue. You may need to use SUPABASE_SERVICE_ROLE_KEY instead of anon key.`)
      }
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

function getAllFilesFromFolder(folderName) {
  try {
    const folderPath = path.join(BASE_DIR, folderName)
    
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ Directory not found: ${folderPath}`)
      return []
    }

    const files = fs.readdirSync(folderPath)
    const imageAndVideoFiles = files.filter(file => {
      // Skip .DS_Store and other system files
      if (file === '.DS_Store') return false
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4'].includes(ext)
    })

    return imageAndVideoFiles.map(file => ({
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
  console.log('🚀 Starting image upload to Supabase Storage for HR 38 W 2162...\n')
  console.log(`📁 Folder: ${FOLDER_NAME}`)
  console.log(`🔗 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using: ${supabaseServiceKey ? 'Service Role Key' : 'Anon Key'}\n`)

  // Check if bucket exists (assume it does if we can't check)
  await checkBucketExists()

  const imageFiles = getAllFilesFromFolder(FOLDER_NAME)

  if (imageFiles.length === 0) {
    console.log('⚠️  No image/video files found in the folder')
    return
  }

  console.log(`📊 Total files to upload: ${imageFiles.length}\n`)
  console.log('='.repeat(60))

  const uploadResults = []
  let successCount = 0
  let errorCount = 0

  for (const imageFile of imageFiles) {
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
  console.log(`✅ Successfully uploaded: ${successCount} files`)
  console.log(`❌ Failed to upload: ${errorCount} files`)

  // Save mapping file with folder name
  const sanitizedFolderName = FOLDER_NAME.replace(/\s+/g, '-').toLowerCase()
  const mappingFile = path.join(__dirname, '..', `${sanitizedFolderName}-upload-mapping.json`)
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
