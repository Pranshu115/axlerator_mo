const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Use the provided Supabase credentials
const supabaseUrl = 'https://zdxqxgnuzhgacveozqgf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeHF4Z251emhnYWN2ZW96cWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODEyNjI1MCwiZXhwIjoyMDgzNzAyMjUwfQ.bu7hWqLkBSekVYoPwuC_e7O_Jv6o1hhRzItii_E47lE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Truck data - using folder names as truck names so images can be fetched
const trucks = [
  {
    name: 'HR 38 W 2162',
    manufacturer: 'Tata Motors',
    model: 'LPT 1613',
    year: 2022,
    kilometers: 45000,
    horsepower: 140,
    price: 1850000,
    subtitle: 'Well maintained, single owner',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 38 W 2162'
  },
  {
    name: 'HR 38 W 2263',
    manufacturer: 'Tata Motors',
    model: 'LPT 1613',
    year: 2021,
    kilometers: 52000,
    horsepower: 140,
    price: 1750000,
    subtitle: 'Excellent condition, certified',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 38 W 2263'
  },
  {
    name: 'HR 38 W 3426',
    manufacturer: 'Tata Motors',
    model: 'LPT 1613',
    year: 2020,
    kilometers: 68000,
    horsepower: 140,
    price: 1650000,
    subtitle: 'Well maintained truck',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 38 W 3426'
  },
  {
    name: 'HR 55 X 0025',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059',
    year: 2022,
    kilometers: 38000,
    horsepower: 150,
    price: 1950000,
    subtitle: 'Premium quality, low mileage',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 55 X 0025'
  },
  {
    name: 'HR 55 X 0253',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059',
    year: 2021,
    kilometers: 55000,
    horsepower: 150,
    price: 1800000,
    subtitle: 'Certified quality truck',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 55 X 0253'
  },
  {
    name: 'HR 55 X 1147',
    manufacturer: 'Eicher Motors',
    model: 'Pro 3015',
    year: 2022,
    kilometers: 42000,
    horsepower: 180,
    price: 2200000,
    subtitle: 'Heavy duty, excellent condition',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 55 X 1147'
  },
  {
    name: 'HR 55 X 2071',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059',
    year: 2021,
    kilometers: 48000,
    horsepower: 150,
    price: 1780000,
    subtitle: 'Well maintained, single owner',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 55 X 2071'
  },
  {
    name: 'HR 55 X 4498',
    manufacturer: 'Eicher Motors',
    model: 'Pro 3015',
    year: 2022,
    kilometers: 35000,
    horsepower: 180,
    price: 2250000,
    subtitle: 'Premium truck, low mileage',
    certified: true,
    state: 'Haryana',
    location: 'Gurugram',
    city: 'Gurugram',
    folderName: 'HR 55 X 4498'
  }
]

// Function to get first image URL from Supabase Storage
async function getFirstImageUrl(folderName) {
  try {
    const BUCKET_NAME = 'truck-images'
    
    // Normalize folder name for search
    const folderNameUpper = folderName.toUpperCase()
    const folderNameHyphen = folderNameUpper.replace(/\s+/g, '-')
    
    // List files in bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error(`Error listing files for ${folderName}:`, error.message)
      return null
    }

    if (!files || files.length === 0) {
      return null
    }

    // Find first image file (not video) that matches folder name
    const matchingFile = files.find((file) => {
      const fileName = file.name.toUpperCase()
      return (fileName.includes(folderNameHyphen) || fileName.includes(folderNameUpper.replace(/\s+/g, ''))) &&
             !fileName.includes('.MP4')
    })

    if (matchingFile) {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(matchingFile.name)
      return urlData.publicUrl
    }

    return null
  } catch (error) {
    console.error(`Error fetching image for ${folderName}:`, error.message)
    return null
  }
}

async function insertTrucks() {
  console.log('🚀 Starting to insert 8 trucks into Supabase database...\n')
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`)

  const results = []
  let successCount = 0
  let errorCount = 0

  for (const truck of trucks) {
    try {
      // Get first image URL from Supabase Storage
      console.log(`🔍 Fetching first image for ${truck.name}...`)
      const imageUrl = await getFirstImageUrl(truck.folderName)
      
      if (!imageUrl) {
        console.error(`❌ No image URL found for ${truck.name}`)
        errorCount++
        continue
      }

      console.log(`📤 Inserting: ${truck.name}`)
      console.log(`   Image URL: ${imageUrl.substring(0, 80)}...`)

      // Check if truck already exists (by name)
      const { data: existing } = await supabase
        .from('trucks')
        .select('id, name')
        .eq('name', truck.name)
        .single()

      if (existing) {
        console.log(`⚠️  Truck "${truck.name}" already exists (ID: ${existing.id}), updating...`)
        
        const { data, error } = await supabase
          .from('trucks')
          .update({
            manufacturer: truck.manufacturer,
            model: truck.model,
            year: truck.year,
            kilometers: truck.kilometers,
            horsepower: truck.horsepower,
            price: truck.price,
            image_url: imageUrl,
            subtitle: truck.subtitle,
            certified: truck.certified,
            state: truck.state,
            location: truck.location,
            city: truck.city
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) {
          console.error(`❌ Error updating ${truck.name}:`, error.message)
          errorCount++
          continue
        }

        console.log(`✅ Updated: ${truck.name} (ID: ${data.id})`)
        results.push({ ...truck, id: data.id, imageUrl, action: 'updated' })
        successCount++
      } else {
        // Insert new truck
        const { data, error } = await supabase
          .from('trucks')
          .insert({
            name: truck.name,
            manufacturer: truck.manufacturer,
            model: truck.model,
            year: truck.year,
            kilometers: truck.kilometers,
            horsepower: truck.horsepower,
            price: truck.price,
            image_url: imageUrl,
            subtitle: truck.subtitle,
            certified: truck.certified,
            state: truck.state,
            location: truck.location,
            city: truck.city
          })
          .select()
          .single()

        if (error) {
          console.error(`❌ Error inserting ${truck.name}:`, error.message)
          errorCount++
          continue
        }

        console.log(`✅ Inserted: ${truck.name} (ID: ${data.id})`)
        results.push({ ...truck, id: data.id, imageUrl, action: 'inserted' })
        successCount++
      }
      
      console.log('') // Empty line for readability
    } catch (error) {
      console.error(`❌ Error processing ${truck.name}:`, error.message)
      errorCount++
    }
  }

  console.log('='.repeat(60))
  console.log('\n📊 Summary:')
  console.log(`✅ Successfully processed: ${successCount} trucks`)
  console.log(`❌ Failed: ${errorCount} trucks`)

  if (results.length > 0) {
    console.log('\n📋 Truck Details:')
    results.forEach((truck, index) => {
      console.log(`\n${index + 1}. ${truck.name} (ID: ${truck.id})`)
      console.log(`   ${truck.year} ${truck.manufacturer} ${truck.model}`)
      console.log(`   Price: ₹${truck.price.toLocaleString('en-IN')}`)
      console.log(`   Action: ${truck.action}`)
      console.log(`   Image: ${truck.imageUrl.substring(0, 60)}...`)
    })
  }

  console.log('\n✅ Process completed!')
  console.log('\n🎉 You can now view these trucks in the Browse Trucks section!')
}

insertTrucks()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
