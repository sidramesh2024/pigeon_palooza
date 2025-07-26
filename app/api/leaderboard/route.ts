
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const topPigeons = await prisma.pigeon.findMany({
      orderBy: {
        overallScore: 'desc'
      },
      take: 50 // Top 50 pigeons
    })

    // Convert any BigInt values to strings for JSON serialization
    const serializedPigeons = topPigeons.map(pigeon => ({
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
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
