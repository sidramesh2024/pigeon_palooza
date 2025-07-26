
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const {
      imageData,
      landmark,
      submittedBy,
      attitudeRating,
      strutRating,
      touristJudgingRating,
      overallScore,
      funDescription,
      bonusPoints
    } = await request.json()

    // Validate required fields
    if (!imageData || !landmark || attitudeRating === undefined || strutRating === undefined || touristJudgingRating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const pigeon = await prisma.pigeon.create({
      data: {
        imageUrl: imageData,
        attitudeRating: parseInt(attitudeRating),
        strutRating: parseInt(strutRating),
        touristJudgingRating: parseInt(touristJudgingRating),
        overallScore: parseFloat(overallScore),
        landmark: landmark,
        bonusPoints: parseInt(bonusPoints) || 0,
        funDescription: funDescription || "This pigeon's got attitude!",
        submittedBy: submittedBy || "Anonymous New Yorker"
      }
    })

    return NextResponse.json({ 
      success: true, 
      pigeonId: pigeon.id,
      message: 'Pigeon added to the Palooza!' 
    })

  } catch (error) {
    console.error('Pigeon submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit pigeon. Try again!' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
