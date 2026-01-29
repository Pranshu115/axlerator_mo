import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Read the HR folders mapping file
function getHRFolderImages() {
  try {
    const mappingPath = path.join(process.cwd(), 'hr-folders-upload-mapping.json')
    if (fs.existsSync(mappingPath)) {
      const fileContent = fs.readFileSync(mappingPath, 'utf-8')
      return JSON.parse(fileContent)
    }
  } catch (error) {
    console.error('Error reading HR folders mapping:', error)
  }
  return []
}

// Get folder name from truck name or image URL
function extractFolderName(truckName: string, imageUrl: string): string | null {
  // Normalize function to convert "HR-38-W-2162" or "HR 38 W 2162" to "HR 38 W 2162"
  const normalizeFolderName = (str: string): string => {
    return str
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .toUpperCase()
  }

  // Check image URL first (most reliable)
  if (imageUrl) {
    // Match patterns like "HR-38-W-2162" or "HR 38 W 2162" in the URL
    const urlMatch = imageUrl.match(/(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
    if (urlMatch) {
      return normalizeFolderName(urlMatch[1])
    }
  }

  // Check truck name
  if (truckName) {
    // Match patterns like "HR-38-W-2162" or "HR 38 W 2162" in the name
    const nameMatch = truckName.match(/(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
    if (nameMatch) {
      return normalizeFolderName(nameMatch[1])
    }
    
    // Also check if truck name starts with HR pattern (e.g., "HR 38 W 2162" is the full name)
    if (/^HR[- ]?\d+[- ]?[A-Z][- ]?\d+/i.test(truckName.trim())) {
      const directMatch = truckName.match(/^(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
      if (directMatch) {
        return normalizeFolderName(directMatch[1])
      }
    }
  }

  return null
}

// Fetch images directly from Supabase Storage by folder name pattern
async function fetchImagesFromSupabaseStorage(
  supabase: any,
  folderName: string
): Promise<string[]> {
  try {
    const BUCKET_NAME = 'truck-images'
    
    console.log(`[Storage] Fetching images from bucket "${BUCKET_NAME}" for folder: ${folderName}`)
    
    // Normalize folder name for search (e.g., "HR 38 W 2162" -> "HR-38-W-2162")
    const searchPattern = folderName.replace(/\s+/g, '-').toUpperCase()
    console.log(`[Storage] Search pattern: ${searchPattern}`)
    
    // List all files in the bucket
    console.log(`[Storage] Listing files in bucket "${BUCKET_NAME}"...`)
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error(`[Storage] ❌ Error listing Supabase Storage files:`, error)
      console.error(`[Storage] Error message: ${error.message}`)
      console.error(`[Storage] Error status: ${error.statusCode || 'N/A'}`)
      return []
    }

    if (!files || files.length === 0) {
      console.log(`[Storage] ⚠️ No files found in bucket "${BUCKET_NAME}"`)
      return []
    }

    console.log(`[Storage] ✅ Found ${files.length} total files in bucket`)

    // Normalize folder name for multiple pattern matching
    const folderNameUpper = folderName.toUpperCase()
    const folderNameHyphen = folderNameUpper.replace(/\s+/g, '-')
    const folderNameNoSpace = folderNameUpper.replace(/\s+/g, '')
    const folderNameSpace = folderNameUpper.replace(/-/g, ' ')
    
    console.log(`[Storage] Searching for patterns: "${folderNameHyphen}", "${folderNameNoSpace}", "${folderNameSpace}", "${searchPattern}"`)
    console.log(`[Storage] Total files in bucket: ${files.length}`)
    
    // Filter files that contain the folder name pattern
    const matchingFiles = files
      .filter((file: any) => {
        const fileName = file.name.toUpperCase()
        // Check multiple patterns to match folder name
        const matches = fileName.includes(folderNameHyphen) || 
               fileName.includes(folderNameNoSpace) ||
               fileName.includes(folderNameSpace) ||
               fileName.includes(searchPattern)
        
        if (matches) {
          console.log(`[Storage] ✅ Match found: ${file.name}`)
        }
        
        return matches
      })
      .map((file: any) => {
        // Get public URL for each file
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name)
        return urlData.publicUrl
      })
      .filter((url: string) => url) // Remove any null/undefined URLs

    // Remove duplicate URLs
    const uniqueUrls = Array.from(new Set(matchingFiles))
    
    console.log(`[Storage] ✅ Found ${uniqueUrls.length} unique images for folder: ${folderName} (from ${matchingFiles.length} total matches)`)
    if (uniqueUrls.length > 0) {
      console.log(`[Storage] Sample URLs (first 3):`, uniqueUrls.slice(0, 3))
    }
    
    return uniqueUrls
  } catch (error: any) {
    console.error(`[Storage] ❌ Error fetching images from Supabase Storage:`, error)
    console.error(`[Storage] Error message: ${error?.message || 'Unknown error'}`)
    console.error(`[Storage] Error stack:`, error?.stack)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const truckId = parseInt(id)

    if (isNaN(truckId)) {
      return NextResponse.json({ error: 'Invalid truck ID' }, { status: 400 })
    }

    // Fetch truck data from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    // Enhanced logging for debugging
    console.log(`[Images API] Fetching images for truck ID: ${truckId}`)
    console.log(`[Images API] Supabase URL configured: ${supabaseUrl ? '✅ Yes' : '❌ No'}`)
    console.log(`[Images API] Supabase Key configured: ${supabaseAnonKey ? '✅ Yes (length: ' + supabaseAnonKey.length + ')' : '❌ No'}`)

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Images API] ❌ Supabase credentials not found in environment variables')
      console.error(`[Images API] NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}`)
      console.error(`[Images API] SUPABASE_URL: ${process.env.SUPABASE_URL ? 'Set' : 'Not set'}`)
      console.error(`[Images API] NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`)
      console.error(`[Images API] SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`)
      return NextResponse.json({ 
        images: [],
        error: 'Supabase credentials not configured',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      }, { status: 500 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log(`[Images API] Supabase client created, fetching truck data...`)
    const { data: truck, error } = await supabase
      .from('trucks')
      .select('id, name, image_url')
      .eq('id', truckId)
      .single()

    if (error) {
      console.error(`[Images API] ❌ Error fetching truck ${truckId}:`, error.message)
      console.error(`[Images API] Error details:`, error)
      return NextResponse.json({ 
        images: [],
        error: error.message,
        truckId
      }, { status: 500 })
    }

    if (!truck) {
      console.error(`[Images API] ❌ Truck ${truckId} not found in database`)
      return NextResponse.json({ 
        images: [],
        error: 'Truck not found',
        truckId
      }, { status: 404 })
    }

    console.log(`[Images API] ✅ Truck found: ${truck.name} (ID: ${truck.id})`)
    console.log(`[Images API] Truck image_url: ${truck.image_url ? 'Set' : 'Not set'}`)

    // Try to get images from HR folder mapping (if file exists)
    const folderName = extractFolderName(truck.name, truck.image_url || '')
    console.log(`[Images API] Extracted folder name: "${folderName}" from truck name: "${truck.name}", image_url: "${truck.image_url || 'N/A'}"`)
    
    if (folderName) {
      // Strategy 1: Try Supabase Storage first (most reliable in production)
      console.log(`[Images API] Strategy 1: Fetching from Supabase Storage for folder: ${folderName}`)
      const storageImages = await fetchImagesFromSupabaseStorage(supabase, folderName)
      
      if (storageImages.length > 0) {
        console.log(`[Images API] ✅ Found ${storageImages.length} images from Supabase Storage for folder: ${folderName}`)
        return NextResponse.json({ images: storageImages })
      } else {
        console.log(`[Images API] ⚠️ No images found in Supabase Storage, trying mapping file...`)
      }

      // Strategy 2: Try mapping file as fallback
      console.log(`[Images API] Strategy 2: Attempting to read mapping file...`)
      const mappingPath = path.join(process.cwd(), 'hr-folders-upload-mapping.json')
      console.log(`[Images API] Mapping file path: ${mappingPath}`)
      console.log(`[Images API] Mapping file exists: ${fs.existsSync(mappingPath)}`)
      
      const mapping = getHRFolderImages()
      console.log(`[Images API] Mapping file read: ${mapping ? mapping.length + ' entries' : 'not found or empty'}`)
      
      if (mapping && mapping.length > 0) {
        // Try multiple normalization strategies
        const normalizedTarget = folderName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
        const normalizedTargetHyphen = folderName.replace(/\s+/g, '-').toUpperCase()
        const normalizedTargetNoSpace = folderName.replace(/\s+/g, '').toUpperCase()
        
        console.log(`[Images API] Searching for folder patterns: "${normalizedTarget}", "${normalizedTargetHyphen}", "${normalizedTargetNoSpace}"`)
        
        const folderImages = mapping
          .filter((item: any) => {
            if (!item.folderName) return false
            
            // Normalize folder names for comparison - try multiple formats
            const itemFolder = item.folderName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
            const itemFolderHyphen = item.folderName.replace(/\s+/g, '-').toUpperCase()
            const itemFolderNoSpace = item.folderName.replace(/\s+/g, '').toUpperCase()
            
            // Match any of the normalized formats
            return itemFolder === normalizedTarget || 
                   itemFolder === normalizedTargetHyphen ||
                   itemFolder === normalizedTargetNoSpace ||
                   itemFolderHyphen === normalizedTarget ||
                   itemFolderHyphen === normalizedTargetHyphen ||
                   itemFolderNoSpace === normalizedTarget ||
                   itemFolderNoSpace === normalizedTargetNoSpace
          })
          .map((item: any) => item.supabaseUrl)
          .filter((url: string) => url) // Remove any null/undefined URLs

        console.log(`[Images API] Found ${folderImages.length} matching images in mapping file`)

        if (folderImages.length > 0) {
          // Remove duplicate URLs
          const uniqueFolderImages = Array.from(new Set(folderImages))
          console.log(`[Images API] ✅ Returning ${uniqueFolderImages.length} unique images from mapping file for folder: ${folderName} (from ${folderImages.length} total)`)
          return NextResponse.json({ images: uniqueFolderImages })
        } else {
          console.log(`[Images API] ⚠️ No matching images found in mapping file for folder: ${folderName}`)
        }
      } else {
        console.log(`[Images API] ⚠️ Mapping file not available or empty`)
      }
    } else {
      console.log(`[Images API] ⚠️ Could not extract folder name from truck name: "${truck.name}"`)
    }

    // Fallback: return single image (ensure it's not duplicated)
    const fallbackImage = truck.image_url ? [truck.image_url] : []
    console.log(`No folder match found for truck ${truckId} (name: "${truck.name}"), returning single image: ${fallbackImage.length > 0 ? 'yes' : 'no'}`)
    return NextResponse.json({ images: fallbackImage })
  } catch (error) {
    console.error('Error fetching truck images:', error)
    return NextResponse.json({ images: [] })
  }
}

