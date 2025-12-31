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
    
    // Filter files that contain the folder name pattern
    const matchingFiles = files
      .filter((file: any) => {
        const fileName = file.name.toUpperCase()
        // Check multiple patterns to match folder name
        return fileName.includes(folderNameHyphen) || 
               fileName.includes(folderNameNoSpace) ||
               fileName.includes(folderNameSpace) ||
               fileName.includes(searchPattern)
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
    
    if (folderName) {
      // First, try to get images from mapping file (if available)
      const mapping = getHRFolderImages()
      if (mapping && mapping.length > 0) {
        const folderImages = mapping
          .filter((item: any) => {
            // Normalize folder names for comparison
            const itemFolder = item.folderName?.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
            const targetFolder = folderName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
            return itemFolder === targetFolder
          })
          .map((item: any) => item.supabaseUrl)
          .filter((url: string) => url) // Remove any null/undefined URLs

        if (folderImages.length > 0) {
          // Remove duplicate URLs
          const uniqueFolderImages = Array.from(new Set(folderImages))
          console.log(`Found ${uniqueFolderImages.length} unique images from mapping file for folder: ${folderName} (from ${folderImages.length} total)`)
          return NextResponse.json({ images: uniqueFolderImages })
        }
      }

      // If mapping file doesn't have images, fetch directly from Supabase Storage
      console.log(`Mapping file not available or empty, fetching from Supabase Storage for folder: ${folderName}`)
      const storageImages = await fetchImagesFromSupabaseStorage(supabase, folderName)
      
      if (storageImages.length > 0) {
        console.log(`Found ${storageImages.length} images from Supabase Storage for folder: ${folderName}`)
        return NextResponse.json({ images: storageImages })
      }
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

