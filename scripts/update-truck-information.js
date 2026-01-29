const { createClient } = require('@supabase/supabase-js')

// Use the provided Supabase credentials
const supabaseUrl = 'https://zdxqxgnuzhgacveozqgf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeHF4Z251emhnYWN2ZW96cWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODEyNjI1MCwiZXhwIjoyMDgzNzAyMjUwfQ.bu7hWqLkBSekVYoPwuC_e7O_Jv6o1hhRzItii_E47lE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Parse kilometers from "83k KM" format to number
function parseKilometers(kmStr) {
  const match = kmStr.match(/(\d+)k?\s*KM/i)
  if (match) {
    return parseInt(match[1]) * 1000
  }
  return parseInt(kmStr.replace(/[^\d]/g, '')) || 0
}

// Parse horsepower from "125 HP" format to number
function parseHorsepower(hpStr) {
  const match = hpStr.match(/(\d+)\s*HP/i)
  if (match) {
    return parseInt(match[1])
  }
  return parseInt(hpStr.replace(/[^\d]/g, '')) || 0
}

// Determine manufacturer from model
function getManufacturer(model) {
  if (model.includes('Tata') || model.includes('LPT') || model.includes('LPPT')) {
    return 'Tata Motors'
  }
  if (model.includes('Ashok') || model.includes('Ecomet')) {
    return 'Ashok Leyland'
  }
  return 'Tata Motors' // Default
}

// Truck data from user input
const truckUpdates = [
  {
    name: 'HR 38 W 2162',
    manufacturer: 'Tata Motors',
    model: 'LPT 1412',
    year: 2017,
    kilometers: parseKilometers('83k KM'),
    horsepower: parseHorsepower('125 HP'),
    emissionStandard: 'BS4',
    subtitle: '2017, BS4, 83k KM, 125 HP'
  },
  {
    name: 'HR 38 W 2263',
    manufacturer: 'Ashok Leyland',
    model: 'Ecomet 1214',
    year: 2017,
    kilometers: parseKilometers('76k KM'),
    horsepower: parseHorsepower('130 HP'),
    emissionStandard: 'Euro4',
    subtitle: '2017, Euro4, 76k KM, 130 HP'
  },
  {
    name: 'HR 38 W 3426',
    manufacturer: 'Tata Motors',
    model: 'LPPT 1412',
    year: 2014,
    kilometers: parseKilometers('68k KM'),
    horsepower: parseHorsepower('125 HP'),
    emissionStandard: 'BS Euro3',
    subtitle: '2014, BS Euro3, 68k KM, 125 HP'
  },
  {
    name: 'HR 55 X 0025',
    manufacturer: 'Tata Motors',
    model: 'LPT 2518c',
    year: 2016,
    kilometers: parseKilometers('87k KM'),
    horsepower: parseHorsepower('180 HP'),
    emissionStandard: 'BS6',
    subtitle: '2016, BS6, 87k KM, 180 HP'
  },
  {
    name: 'HR 55 X 0253',
    manufacturer: 'Tata Motors',
    model: 'LPT 2518c',
    year: 2014,
    kilometers: parseKilometers('70k KM'),
    horsepower: parseHorsepower('180 HP'),
    emissionStandard: 'BS4',
    subtitle: '2014, BS4, 70k KM, 180 HP'
  },
  {
    name: 'HR 55 X 1147',
    manufacturer: 'Tata Motors',
    model: 'LPT 2518c',
    year: 2016,
    kilometers: parseKilometers('65k KM'),
    horsepower: parseHorsepower('180 HP'),
    emissionStandard: 'BS4',
    subtitle: '2016, BS4, 65k KM, 180 HP'
  },
  {
    name: 'HR 55 X 2071',
    manufacturer: 'Tata Motors',
    model: 'LPT 2518c',
    year: 2016,
    kilometers: parseKilometers('80k KM'),
    horsepower: parseHorsepower('180 HP'),
    emissionStandard: 'BS4',
    subtitle: '2016, BS4, 80k KM, 180 HP'
  },
  {
    name: 'HR 55 X 4498',
    manufacturer: 'Tata Motors',
    model: 'LPT 2518c',
    year: 2016,
    kilometers: parseKilometers('78k KM'),
    horsepower: parseHorsepower('180 HP'),
    emissionStandard: 'BS4',
    subtitle: '2016, BS4, 78k KM, 180 HP'
  }
]

async function updateTrucks() {
  console.log('🚀 Starting to update truck information in Supabase database...\n')
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`)

  const results = []
  let successCount = 0
  let errorCount = 0
  let notFoundCount = 0

  for (const truckUpdate of truckUpdates) {
    try {
      console.log(`🔍 Looking for truck: ${truckUpdate.name}`)

      // Find truck by name
      const { data: existing, error: findError } = await supabase
        .from('trucks')
        .select('id, name, manufacturer, model, year, kilometers, horsepower, subtitle')
        .eq('name', truckUpdate.name)
        .single()

      if (findError || !existing) {
        console.error(`❌ Truck "${truckUpdate.name}" not found in database`)
        notFoundCount++
        results.push({
          name: truckUpdate.name,
          action: 'not_found',
          error: findError?.message || 'Truck not found'
        })
        continue
      }

      console.log(`📋 Current data for ${truckUpdate.name}:`)
      console.log(`   Manufacturer: ${existing.manufacturer} → ${truckUpdate.manufacturer}`)
      console.log(`   Model: ${existing.model} → ${truckUpdate.model}`)
      console.log(`   Year: ${existing.year} → ${truckUpdate.year}`)
      console.log(`   Kilometers: ${existing.kilometers.toLocaleString('en-IN')} → ${truckUpdate.kilometers.toLocaleString('en-IN')}`)
      console.log(`   Horsepower: ${existing.horsepower} → ${truckUpdate.horsepower}`)
      console.log(`   Subtitle: ${existing.subtitle || 'N/A'} → ${truckUpdate.subtitle}`)

      // Update truck
      const { data: updated, error: updateError } = await supabase
        .from('trucks')
        .update({
          manufacturer: truckUpdate.manufacturer,
          model: truckUpdate.model,
          year: truckUpdate.year,
          kilometers: truckUpdate.kilometers,
          horsepower: truckUpdate.horsepower,
          subtitle: truckUpdate.subtitle
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error(`❌ Error updating ${truckUpdate.name}:`, updateError.message)
        errorCount++
        results.push({
          name: truckUpdate.name,
          action: 'error',
          error: updateError.message
        })
        continue
      }

      console.log(`✅ Successfully updated: ${truckUpdate.name} (ID: ${updated.id})\n`)
      results.push({
        name: truckUpdate.name,
        id: updated.id,
        action: 'updated',
        data: {
          manufacturer: updated.manufacturer,
          model: updated.model,
          year: updated.year,
          kilometers: updated.kilometers,
          horsepower: updated.horsepower,
          subtitle: updated.subtitle
        }
      })
      successCount++
    } catch (error) {
      console.error(`❌ Error processing ${truckUpdate.name}:`, error.message)
      errorCount++
      results.push({
        name: truckUpdate.name,
        action: 'error',
        error: error.message
      })
    }
  }

  console.log('='.repeat(60))
  console.log('\n📊 Update Summary:')
  console.log(`✅ Successfully updated: ${successCount} trucks`)
  console.log(`❌ Errors: ${errorCount} trucks`)
  console.log(`⚠️  Not found: ${notFoundCount} trucks`)

  if (results.length > 0) {
    console.log('\n📋 Detailed Results:')
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}`)
      if (result.action === 'updated') {
        console.log(`   ✅ Updated successfully (ID: ${result.id})`)
        console.log(`   Manufacturer: ${result.data.manufacturer}`)
        console.log(`   Model: ${result.data.model}`)
        console.log(`   Year: ${result.data.year}`)
        console.log(`   Kilometers: ${result.data.kilometers.toLocaleString('en-IN')} km`)
        console.log(`   Horsepower: ${result.data.horsepower} HP`)
        console.log(`   Subtitle: ${result.data.subtitle}`)
      } else if (result.action === 'not_found') {
        console.log(`   ⚠️  Not found in database`)
      } else {
        console.log(`   ❌ Error: ${result.error}`)
      }
    })
  }

  console.log('\n✅ Process completed!')
}

updateTrucks()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
