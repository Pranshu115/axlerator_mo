import { NextRequest, NextResponse } from 'next/server'
import { safePrismaQuery } from '@/lib/prisma'
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

    const truck = await safePrismaQuery<TruckWithNumberPrice | null>(
      async (prisma) => {
        const result = await prisma.truck.findUnique({
          where: {
            id: truckId,
          },
        })
        // Convert Decimal to number for JSON serialization
        if (result) {
          return {
            ...result,
            price: Number(result.price),
            subtitle: result.subtitle ?? null,
          }
        }
        return null
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
