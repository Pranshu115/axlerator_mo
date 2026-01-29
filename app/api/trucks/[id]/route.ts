import { NextRequest, NextResponse } from 'next/server'
import { safeSupabaseQuery } from '@/lib/supabase'
import { seedTrucks } from '@/lib/seed-data'

type TruckWithNumberPrice = {
  id: number
  name: string
  manufacturer: string
  model: string
  year: number
  kilometers: number
  horsepower: number
  price: number
  imageUrl: string
  subtitle: string | null
  certified: boolean
  state: string | null
  location: string | null
  city: string | null
  createdAt: Date
  updatedAt: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const truckId = parseInt(id)

    if (isNaN(truckId)) {
      return NextResponse.json(
        { error: 'Invalid truck ID' },
        { status: 400 }
      )
    }

    const truck = await safeSupabaseQuery<TruckWithNumberPrice | null>(
      async (supabase) => {
        const { data: result, error } = await supabase
          .from('trucks')
          .select('*')
          .eq('id', truckId)
          .single()

        if (error || !result) {
          return null
        }

        // Convert Supabase format to API format
        return {
          id: result.id,
          name: result.name,
          manufacturer: result.manufacturer,
          model: result.model,
          year: result.year,
          kilometers: result.kilometers,
          horsepower: result.horsepower,
          price: Number(result.price),
          imageUrl: result.image_url,
          subtitle: result.subtitle ?? null,
          certified: result.certified,
          state: result.state ?? null,
          location: result.location ?? null,
          city: result.city ?? null,
          createdAt: new Date(result.created_at),
          updatedAt: new Date(result.updated_at),
        }
      },
      // Fallback to seed data when database is unavailable
      (() => {
        const seedTruck = seedTrucks.find(t => t.id === truckId)
        if (!seedTruck) return null
        return {
          ...seedTruck,
          subtitle: seedTruck.subtitle ?? null,
          state: null,
          location: null,
          city: null,
        } as TruckWithNumberPrice
      })()
    )

    if (!truck) {
      return NextResponse.json(
        { error: 'Truck not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(truck)
  } catch (error) {
    console.error('Error fetching truck:', error)
    return NextResponse.json(
      { error: 'Failed to fetch truck details' },
      { status: 500 }
    )
  }
}
