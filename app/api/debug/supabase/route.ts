import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint to check Supabase environment variables
 * This helps debug deployment issues
 * 
 * Usage: GET /api/debug/supabase
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  
  // Check if variables are set (without exposing full values)
  const hasUrl = !!supabaseUrl
  const hasKey = !!supabaseAnonKey
  const urlLength = supabaseUrl?.length || 0
  const keyLength = supabaseAnonKey?.length || 0
  
  // Show partial URL for verification (first 20 chars)
  const urlPreview = supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not set'
  const keyPreview = supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not set'
  
  // Check which variable names are set
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
  }
  
  // Try to create Supabase client to test connection
  let connectionTest = 'Not tested'
  if (hasUrl && hasKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      // Test connection by listing buckets
      const { data, error } = await supabase.storage.listBuckets()
      
      if (error) {
        connectionTest = `Error: ${error.message}`
      } else {
        connectionTest = `✅ Connected! Found ${data?.length || 0} buckets`
      }
    } catch (error: any) {
      connectionTest = `Error: ${error.message || 'Unknown error'}`
    }
  }
  
  return NextResponse.json({
    status: hasUrl && hasKey ? '✅ Configured' : '❌ Not Configured',
    environment: {
      url: {
        set: hasUrl,
        preview: urlPreview,
        length: urlLength,
        expectedLength: '40-60 characters'
      },
      key: {
        set: hasKey,
        preview: keyPreview,
        length: keyLength,
        expectedLength: '200+ characters (JWT token)'
      }
    },
    environmentVariables: envCheck,
    connectionTest,
    recommendations: !hasUrl || !hasKey ? [
      'Set NEXT_PUBLIC_SUPABASE_URL in your deployment platform',
      'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment platform',
      'Make sure variable names have NEXT_PUBLIC_ prefix',
      'Clear build cache and redeploy after setting variables',
      'Get credentials from: https://supabase.com/dashboard → Settings → API'
    ] : [
      'Environment variables are set correctly',
      'If images still don\'t load, check Supabase Storage bucket permissions',
      'Verify bucket "truck-images" exists and is public'
    ]
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  })
}
