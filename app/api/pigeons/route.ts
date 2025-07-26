
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const pigeons = await prisma.pigeon.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert any BigInt values to strings for JSON serialization
    const serializedPigeons = pigeons.map(pigeon => ({
      ...pigeon,
      // Ensure all numeric values are properly handled
      attitudeRating: Number(pigeon.attitudeRating),
      strutRating: Number(pigeon.strutRating),
      touristJudgingRating: Number(pigeon.touristJudgingRating),
      bonusPoints: Number(pigeon.bonusPoints),
      overallScore: Number(pigeon.overallScore),
      createdAt: pigeon.createdAt.toISOString(),
      updatedAt: pigeon.updatedAt.toISOString()
    }))

    return NextResponse.json(serializedPigeons)

  } catch (error) {
    console.error('Failed to fetch pigeons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pigeons' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
