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

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ images: [] })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: truck, error } = await supabase
      .from('trucks')
      .select('id, name, image_url')
      .eq('id', truckId)
      .single()

    if (error || !truck) {
      return NextResponse.json({ images: [] })
    }

    // Try to get images from HR folder mapping
    const folderName = extractFolderName(truck.name, truck.image_url || '')
    
    if (folderName) {
      const mapping = getHRFolderImages()
      const folderImages = mapping
        .filter((item: any) => {
          // Normalize folder names for comparison
          const itemFolder = item.folderName?.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
          const targetFolder = folderName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
          return itemFolder === targetFolder
        })
        .map((item: any) => item.supabaseUrl)
        .filter((url: string) => url) // Remove any null/undefined URLs

      if (folderImages.length > 0) {
        return NextResponse.json({ images: folderImages })
      }
    }

    // Fallback: return single image
    return NextResponse.json({ images: truck.image_url ? [truck.image_url] : [] })
  } catch (error) {
    console.error('Error fetching truck images:', error)
    return NextResponse.json({ images: [] })
  }
}

