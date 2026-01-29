// Test script to check image API endpoint
const fetch = require('node-fetch')

async function testImageAPI() {
  const baseUrl = process.argv[2] || 'http://localhost:3000'
  const truckId = process.argv[3] || '1'
  
  console.log(`Testing image API for truck ID: ${truckId}`)
  console.log(`Base URL: ${baseUrl}\n`)
  
  try {
    // First, get truck info
    console.log('1. Fetching truck info...')
    const truckRes = await fetch(`${baseUrl}/api/trucks/${truckId}`)
    const truckData = await truckRes.json()
    console.log('Truck name:', truckData.name)
    console.log('Truck image_url:', truckData.imageUrl || 'N/A')
    console.log('')
    
    // Then, get images
    console.log('2. Fetching images...')
    const imagesRes = await fetch(`${baseUrl}/api/trucks/${truckId}/images`)
    const imagesData = await imagesRes.json()
    
    console.log('Response:', JSON.stringify(imagesData, null, 2))
    console.log('')
    console.log(`Total images: ${imagesData.images?.length || 0}`)
    
    if (imagesData.images && imagesData.images.length > 0) {
      console.log('First 3 image URLs:')
      imagesData.images.slice(0, 3).forEach((url, idx) => {
        console.log(`  ${idx + 1}. ${url}`)
      })
    } else {
      console.log('❌ No images found!')
      if (imagesData.error) {
        console.log('Error:', imagesData.error)
      }
      if (imagesData.debug) {
        console.log('Debug info:', imagesData.debug)
      }
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testImageAPI()

