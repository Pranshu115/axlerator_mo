/**
 * Script to update truck information from verified data
 * Matches trucks by model name and updates price, year, kilometers
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verified truck data from screenshot
const verifiedTrucks = [
  { model: 'Eicher Pro 2110 LCV', price: 1680000, year: 2023, kilometers: 105453, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Motors 1059 XP', price: 654500, year: 2018, kilometers: 275034, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata 1512 LPT', price: 209000, year: 2021, kilometers: 67915, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 3015', price: 1150000, year: 2021, kilometers: 108084, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 3019', price: 2200000, year: 2021, kilometers: 75200, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata Motors 3518', price: 2805000, year: 2019, kilometers: 82085, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2110 XP', price: 1705000, year: 2024, kilometers: 111339, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata Motors Ultra T16', price: 1155000, year: 2022, kilometers: 110312, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata LPT 1109 HEX 2', price: 935000, year: 2014, kilometers: 116432, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2110 XP', price: 1017500, year: 2019, kilometers: 230825, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata LPT 3118', price: 1595000, year: 2015, kilometers: 232643, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2118', price: 2172500, year: 2024, kilometers: 63529, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Ashok Leyland Partner 1114', price: 1056000, year: 2023, kilometers: 56021, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Ashok Leyland Partner 1615', price: 1320000, year: 2022, kilometers: 125064, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2114 XP', price: 1475000, year: 2022, kilometers: 120421, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Ashok Leyland Ecomet 1214', price: 1265000, year: 2019, kilometers: 350318, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2059 XP', price: 1455500, year: 2022, kilometers: 95421, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2118', price: 164000, year: 2024, kilometers: 45764, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata 1613 CRI6', price: 525000, year: 2020, kilometers: 96023, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2059 XP', price: 1595000, year: 2024, kilometers: 3111, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata 610', price: 1200000, year: 2021, kilometers: 51327, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Ashok Leyland Ecomet 1212', price: 1000000, year: 2018, kilometers: 196243, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 3015 XP', price: 2100000, year: 2023, kilometers: 85017, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'SML Isuzu Samrat GS', price: 850000, year: 2020, kilometers: 16024, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2059 XP', price: 850000, year: 2021, kilometers: 52012, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Eicher Pro 2059 XP', price: 900000, year: 2022, kilometers: 72154, fuelType: 'Diesel', transmission: 'Manual' },
  { model: 'Tata 709 LPT', price: 825000, year: 2021, kilometers: 87421, fuelType: 'CNG', transmission: 'Manual' },
  { model: 'Tata 709 G LPT', price: 1100000, year: 2022, kilometers: 83921, fuelType: 'CNG', transmission: 'Manual' },
  { model: 'Tata 1109 G LPT', price: 1150000, year: 2020, kilometers: 87631, fuelType: 'CNG', transmission: 'Manual' },
  { model: 'Tata 1512 LPT', price: 1500000, year: 2022, kilometers: 73542, fuelType: 'CNG', transmission: 'Manual' },
]

// Helper function to normalize model names for matching
function normalizeModelName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper function to extract model from truck name
function extractModelFromName(truckName) {
  // Truck name format is usually: "Year Manufacturer Model" or "Manufacturer Model"
  // We need to extract just the model part
  const parts = truckName.split(' ')
  // Remove year if present (first part if it's 4 digits)
  if (parts[0] && /^\d{4}$/.test(parts[0])) {
    parts.shift()
  }
  // Remove manufacturer (usually first word after year)
  // Common manufacturers: Eicher, Tata, Ashok, SML
  if (parts[0] && ['eicher', 'tata', 'ashok', 'sml'].includes(parts[0].toLowerCase())) {
    parts.shift()
  }
  // If second part is "Motors", "Pro", "Leyland", remove it
  if (parts[0] && ['motors', 'pro', 'leyland'].includes(parts[0].toLowerCase())) {
    parts.shift()
  }
  return parts.join(' ').trim()
}

// Helper function to create flexible matching patterns
function createMatchPatterns(modelName) {
  const normalized = normalizeModelName(modelName)
  const patterns = [normalized]
  
  // Remove common suffixes/prefixes for flexible matching
  patterns.push(normalized.replace(/\s*(lcv|xp|vd|gs|lpt|hex|g|cr|i6|partner|ecomet|samrat|ultra)\s*/gi, '').trim())
  patterns.push(normalized.replace(/\s*(pro|motors|truck|pick-up|commercial)\s*/gi, '').trim())
  
  // Extract numbers for matching
  const numbers = normalized.match(/\d+/g)
  if (numbers && numbers.length > 0) {
    patterns.push(numbers.join(' '))
  }
  
  return patterns.filter(p => p.length > 0)
}

// Helper function to check if two model names match (flexible)
function modelsMatch(dbModel, verifiedModel) {
  const dbPatterns = createMatchPatterns(dbModel)
  const verifiedPatterns = createMatchPatterns(verifiedModel)
  
  // Check if any patterns match
  for (const dbPattern of dbPatterns) {
    for (const verifiedPattern of verifiedPatterns) {
      if (dbPattern === verifiedPattern || 
          dbPattern.includes(verifiedPattern) || 
          verifiedPattern.includes(dbPattern)) {
        return true
      }
    }
  }
  
  // Also check if key numbers match
  const dbNumbers = dbModel.match(/\d+/g) || []
  const verifiedNumbers = verifiedModel.match(/\d+/g) || []
  if (dbNumbers.length > 0 && verifiedNumbers.length > 0) {
    const dbMainNumber = dbNumbers[0]
    const verifiedMainNumber = verifiedNumbers[0]
    if (dbMainNumber === verifiedMainNumber && dbNumbers.length === verifiedNumbers.length) {
      return true
    }
  }
  
  return false
}

async function updateTrucks() {
  console.log('🔄 Starting truck update process...\n')

  // Fetch all trucks from database
  const { data: trucks, error: fetchError } = await supabase
    .from('trucks')
    .select('id, name, manufacturer, model, year, price, kilometers')
    .eq('certified', true)
    .order('id', { ascending: true })

  if (fetchError) {
    console.error('❌ Error fetching trucks:', fetchError.message)
    return
  }

  if (!trucks || trucks.length === 0) {
    console.log('⚠️  No trucks found in database')
    return
  }

  console.log(`📊 Found ${trucks.length} trucks in database\n`)
  console.log(`📋 Have ${verifiedTrucks.length} verified truck records\n`)

  let updatedCount = 0
  let matchedCount = 0
  let notMatchedCount = 0
  const notMatched = []

  // Create a map of verified trucks by normalized model name
  const verifiedMap = new Map()
  verifiedTrucks.forEach((vt, index) => {
    const normalized = normalizeModelName(vt.model)
    if (!verifiedMap.has(normalized)) {
      verifiedMap.set(normalized, [])
    }
    verifiedMap.get(normalized).push({ ...vt, originalIndex: index })
  })

  // Match and update trucks
  for (const truck of trucks) {
    // Try to match by model name
    const truckModel = extractModelFromName(truck.name)
    const normalizedTruckModel = normalizeModelName(truckModel)
    const normalizedFullName = normalizeModelName(truck.name)
    
    // Also try matching with manufacturer + model
    const manufacturerModel = normalizeModelName(`${truck.manufacturer} ${truck.model}`)
    const fullNameWithYear = normalizeModelName(`${truck.year} ${truck.manufacturer} ${truck.model}`)

    let matchedVerified = null

    // Try multiple matching strategies
    if (verifiedMap.has(normalizedTruckModel)) {
      const candidates = verifiedMap.get(normalizedTruckModel)
      // If multiple matches, try to match by year first
      if (candidates.length === 1) {
        matchedVerified = candidates[0]
      } else {
        // Try to match by year
        const yearMatch = candidates.find(c => c.year === truck.year)
        if (yearMatch) {
          matchedVerified = yearMatch
        } else {
          // Use first match if no year match
          matchedVerified = candidates[0]
        }
      }
    } else if (verifiedMap.has(normalizedFullName)) {
      const candidates = verifiedMap.get(normalizedFullName)
      matchedVerified = candidates.length === 1 ? candidates[0] : candidates.find(c => c.year === truck.year) || candidates[0]
    } else if (verifiedMap.has(manufacturerModel)) {
      const candidates = verifiedMap.get(manufacturerModel)
      matchedVerified = candidates.length === 1 ? candidates[0] : candidates.find(c => c.year === truck.year) || candidates[0]
    } else if (verifiedMap.has(fullNameWithYear)) {
      const candidates = verifiedMap.get(fullNameWithYear)
      matchedVerified = candidates[0]
    } else {
      // Try flexible matching by iterating through all verified trucks
      for (const [verifiedKey, candidates] of verifiedMap.entries()) {
        for (const candidate of candidates) {
          if (modelsMatch(truckModel, candidate.model) || 
              modelsMatch(truck.name, candidate.model) ||
              modelsMatch(`${truck.manufacturer} ${truck.model}`, candidate.model)) {
            // Prefer year match if available
            if (candidate.year === truck.year) {
              matchedVerified = candidate
              break
            } else if (!matchedVerified) {
              matchedVerified = candidate
            }
          }
        }
        if (matchedVerified) break
      }
    }

    if (matchedVerified) {
      matchedCount++
      
      // Check if update is needed
      const needsUpdate = 
        Number(truck.price) !== matchedVerified.price ||
        truck.year !== matchedVerified.year ||
        truck.kilometers !== matchedVerified.kilometers

      if (needsUpdate) {
        const updateData = {
          price: matchedVerified.price.toString(),
          year: matchedVerified.year,
          kilometers: matchedVerified.kilometers,
        }

        const { error: updateError } = await supabase
          .from('trucks')
          .update(updateData)
          .eq('id', truck.id)

        if (updateError) {
          console.error(`❌ Error updating truck ID ${truck.id} (${truck.name}):`, updateError.message)
        } else {
          console.log(`✅ Updated: ${truck.name}`)
          console.log(`   Price: ₹${Number(truck.price).toLocaleString('en-IN')} → ₹${matchedVerified.price.toLocaleString('en-IN')}`)
          console.log(`   Year: ${truck.year} → ${matchedVerified.year}`)
          console.log(`   Kilometers: ${truck.kilometers.toLocaleString('en-IN')} → ${matchedVerified.kilometers.toLocaleString('en-IN')} km`)
          updatedCount++
        }
      } else {
        console.log(`⏭️  Skipped: ${truck.name} (already up to date)`)
      }
    } else {
      notMatchedCount++
      notMatched.push({
        id: truck.id,
        name: truck.name,
        manufacturer: truck.manufacturer,
        model: truck.model,
        year: truck.year
      })
      console.log(`⚠️  No match found for: ${truck.name} (Model: ${truckModel})`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Update Summary:')
  console.log(`✅ Successfully updated: ${updatedCount} trucks`)
  console.log(`🔍 Matched: ${matchedCount} trucks`)
  console.log(`⚠️  Not matched: ${notMatchedCount} trucks`)
  
  if (notMatched.length > 0) {
    console.log('\n⚠️  Trucks that could not be matched:')
    notMatched.forEach(truck => {
      console.log(`   - ID ${truck.id}: ${truck.name} (${truck.year} ${truck.manufacturer} ${truck.model})`)
    })
  }

  console.log('\n✅ Update process completed!')
}

updateTrucks()
  .then(() => {
    console.log('\n✅ Script execution completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script execution failed:', error)
    process.exit(1)
  })

