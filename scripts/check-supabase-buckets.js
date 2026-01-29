const { createClient } = require('@supabase/supabase-js')

// Use the provided Supabase credentials
const supabaseUrl = 'https://zdxqxgnuzhgacveozqgf.supabase.co'
const supabaseAnonKey = 'sb_publishable_jYX0LjiSnWTRQ5bJ0pCIQQ_-EF_3pMM'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkBuckets() {
  console.log('🔍 Checking Supabase Storage buckets...\n')
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`)

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error('❌ Error listing buckets:', error.message)
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.error('\n⚠️  This might be a permissions issue.')
        console.error('   You may need to use SUPABASE_SERVICE_ROLE_KEY instead of anon key.')
      }
      return
    }

    if (!buckets || buckets.length === 0) {
      console.log('⚠️  No buckets found in your Supabase project.')
      console.log('\n📝 You need to create a bucket first:')
      console.log('   1. Go to https://supabase.com/dashboard')
      console.log('   2. Select your project')
      console.log('   3. Go to Storage → New bucket')
      console.log('   4. Create bucket named: truck-images')
      console.log('   5. Make it PUBLIC (so images are accessible)')
      return
    }

    console.log(`✅ Found ${buckets.length} bucket(s):\n`)
    buckets.forEach((bucket, index) => {
      console.log(`${index + 1}. ${bucket.name}`)
      console.log(`   ID: ${bucket.id}`)
      console.log(`   Public: ${bucket.public ? '✅ Yes' : '❌ No'}`)
      console.log(`   Created: ${bucket.created_at}`)
      console.log('')
    })

    const truckImagesBucket = buckets.find(b => b.name === 'truck-images')
    if (!truckImagesBucket) {
      console.log('⚠️  Bucket "truck-images" not found!')
      console.log('\n📝 You need to create it:')
      console.log('   1. Go to https://supabase.com/dashboard')
      console.log('   2. Select your project')
      console.log('   3. Go to Storage → New bucket')
      console.log('   4. Create bucket named: truck-images')
      console.log('   5. Make it PUBLIC (so images are accessible)')
    } else {
      console.log('✅ Bucket "truck-images" exists!')
      if (!truckImagesBucket.public) {
        console.log('⚠️  Warning: Bucket is not public. Images may not be accessible.')
      }
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
  }
}

checkBuckets()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
