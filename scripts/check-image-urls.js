/**
 * Script to check and verify image URLs in the database
 * This helps diagnose why images aren't showing after deployment
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials not found')
  console.error('   Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkImageUrls() {
  console.log('🔍 Checking image URLs in database...\n')

  try {
    // Fetch all trucks
    const { data: trucks, error } = await supabase
      .from('trucks')
      .select('id, name, image_url')
      .eq('certified', true)
      .limit(50)

    if (error) {
      console.error('❌ Error fetching trucks:', error)
      return
    }

    if (!trucks || trucks.length === 0) {
      console.log('⚠️  No trucks found in database')
      return
    }

    console.log(`📊 Found ${trucks.length} trucks\n`)

    // Categorize image URLs
    const categories = {
      supabaseStorage: [],
      localPath: [],
      invalid: [],
      missing: []
    }

    trucks.forEach(truck => {
      const imageUrl = truck.image_url

      if (!imageUrl || imageUrl.trim() === '') {
        categories.missing.push(truck)
      } else if (imageUrl.startsWith('https://') && imageUrl.includes('supabase.co/storage')) {
        categories.supabaseStorage.push(truck)
      } else if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || !imageUrl.startsWith('http')) {
        categories.localPath.push(truck)
      } else {
        categories.invalid.push(truck)
      }
    })

    // Print results
    console.log('📈 Image URL Analysis:\n')
    console.log(`✅ Supabase Storage URLs: ${categories.supabaseStorage.length}`)
    console.log(`❌ Local paths (won't work in production): ${categories.localPath.length}`)
    console.log(`⚠️  Invalid URLs: ${categories.invalid.length}`)
    console.log(`❌ Missing URLs: ${categories.missing.length}\n`)

    // Show examples
    if (categories.supabaseStorage.length > 0) {
      console.log('✅ Example Supabase Storage URL:')
      console.log(`   ${categories.supabaseStorage[0].name}: ${categories.supabaseStorage[0].image_url}\n`)
    }

    if (categories.localPath.length > 0) {
      console.log('❌ Trucks with local paths (need to be updated):')
      categories.localPath.slice(0, 5).forEach(truck => {
        console.log(`   - ${truck.name} (ID: ${truck.id})`)
        console.log(`     Current: ${truck.image_url}`)
        console.log(`     ❌ This won't work in production!\n`)
      })
      if (categories.localPath.length > 5) {
        console.log(`   ... and ${categories.localPath.length - 5} more\n`)
      }
    }

    if (categories.missing.length > 0) {
      console.log('❌ Trucks with missing image URLs:')
      categories.missing.slice(0, 5).forEach(truck => {
        console.log(`   - ${truck.name} (ID: ${truck.id})\n`)
      })
      if (categories.missing.length > 5) {
        console.log(`   ... and ${categories.missing.length - 5} more\n`)
      }
    }

    // Recommendations
    console.log('\n💡 Recommendations:\n')
    
    if (categories.localPath.length > 0) {
      console.log('1. ❌ You have trucks with local image paths that need to be updated:')
      console.log('   Run: node scripts/update-database-images.js')
      console.log('   This will update all local paths to Supabase Storage URLs\n')
    }

    if (categories.missing.length > 0) {
      console.log('2. ❌ You have trucks with missing image URLs:')
      console.log('   Upload images to Supabase Storage and update the database\n')
    }

    if (categories.supabaseStorage.length === trucks.length) {
      console.log('✅ All trucks have Supabase Storage URLs!')
      console.log('   If images still don\'t show, check:')
      console.log('   - Supabase Storage bucket is public')
      console.log('   - Image URLs are accessible')
      console.log('   - Next.js image domain is configured (next.config.js)\n')
    }

    // Test a Supabase Storage URL
    if (categories.supabaseStorage.length > 0) {
      const testUrl = categories.supabaseStorage[0].image_url
      console.log('🧪 Testing Supabase Storage URL accessibility...')
      try {
        const response = await fetch(testUrl, { method: 'HEAD' })
        if (response.ok) {
          console.log(`✅ URL is accessible: ${testUrl}\n`)
        } else {
          console.log(`❌ URL returned status ${response.status}: ${testUrl}\n`)
          console.log('   Check if the bucket is public and the file exists\n')
        }
      } catch (error) {
        console.log(`❌ Error testing URL: ${error.message}\n`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkImageUrls()

