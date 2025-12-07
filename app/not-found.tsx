import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering - prevent any static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const runtime = 'nodejs'

export default function NotFound() {
  // Force dynamic rendering by using noStore
  noStore()
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1rem',
        margin: 0
      }}>404</h1>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '1rem',
        margin: '0 0 1rem 0'
      }}>Page Not Found</h2>
      <p style={{
        fontSize: '1.125rem',
        color: '#6b7280',
        marginBottom: '2rem',
        maxWidth: '500px',
        margin: '0 0 2rem 0'
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s'
        }}
      >
        Go Back Home
      </Link>
    </div>
  )
}
