
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const NYC_LANDMARKS = [
  { name: 'Empire State Building', bonus: 50 },
  { name: 'Times Square', bonus: 45 },
  { name: 'Brooklyn Bridge', bonus: 40 },
  { name: 'Statue of Liberty', bonus: 60 },
  { name: 'One World Trade Center', bonus: 45 },
  { name: 'Central Park', bonus: 30 },
  { name: 'High Line', bonus: 25 },
  { name: 'Washington Square Park', bonus: 25 },
  { name: 'Coney Island', bonus: 30 },
  { name: '9/11 Memorial', bonus: 40 },
  { name: 'Other NYC Location', bonus: 10 },
]

const NYC_SLANG_TEMPLATES = [
  "This bird's got more attitude than a {location} street vendor!",
  "Strutting like they own the whole borough of {borough}!",
  "Judging tourists harder than a native New Yorker waiting for the subway!",
  "Got that Brooklyn swag mixed with Manhattan confidence!",
  "Walking with more swagger than someone late for the 6 train!",
  "This pigeon's giving off serious 'I've seen it all' vibes!",
  "Cooler than a bodega cat and twice as street smart!",
  "Radiating that classic NYC 'don't mess with me' energy!",
  "Strutting like they just paid $4,000 rent and don't care!",
  "This bird's got more character than a Times Square performer!"
]

export async function POST(request: NextRequest) {
  try {
    const { imageData, landmark } = await request.json()

    if (!imageData || !landmark) {
      return NextResponse.json(
        { error: 'Missing image data or landmark' },
        { status: 400 }
      )
    }

    // Get landmark bonus points
    const landmarkInfo = NYC_LANDMARKS.find(l => l.name === landmark)
    const bonusPoints = landmarkInfo?.bonus || 10

    // Call LLM API for image analysis
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this pigeon image and rate it on three NYC-specific criteria (1-5 scale each):

1. ATTITUDE: How much swagger and confidence does this pigeon show? (1=timid, 5=total boss energy)
2. STRUT LEVEL: How impressive is their walk/posture? (1=basic pigeon walk, 5=runway model strut)  
3. TOURIST JUDGING FACTOR: How much does this pigeon look like it's silently judging tourists? (1=friendly, 5=maximum judgment)

Also provide a fun NYC-style description of the pigeon using local slang and references.

Respond in JSON format:
{
  "attitudeRating": <number 1-5>,
  "strutRating": <number 1-5>, 
  "touristJudgingRating": <number 1-5>,
  "funDescription": "<fun NYC slang description>"
}

Make the description authentic NYC style with references to boroughs, landmarks, local culture. Keep it family-friendly and humorous.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    const llmResponse = await response.json()
    const analysis = JSON.parse(llmResponse.choices[0]?.message?.content || '{}')

    // Calculate overall score
    const baseScore = (
      (analysis.attitudeRating || 3) + 
      (analysis.strutRating || 3) + 
      (analysis.touristJudgingRating || 3)
    ) / 3

    // Add bonus points influence (scaled down for overall score)
    const overallScore = Math.min(5.0, baseScore + (bonusPoints / 100))

    // Add some NYC flair to description if needed
    let funDescription = analysis.funDescription || "This pigeon's got that classic NYC attitude!"
    
    // Replace placeholders in template descriptions
    const randomTemplate = NYC_SLANG_TEMPLATES[Math.floor(Math.random() * NYC_SLANG_TEMPLATES.length)]
    if (!funDescription.includes('NYC') && !funDescription.includes('New York')) {
      funDescription = randomTemplate.replace('{location}', landmark).replace('{borough}', 'Brooklyn')
    }

    const result = {
      attitudeRating: analysis.attitudeRating || 3,
      strutRating: analysis.strutRating || 3,
      touristJudgingRating: analysis.touristJudgingRating || 3,
      overallScore: parseFloat(overallScore.toFixed(2)),
      funDescription,
      bonusPoints
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Pigeon analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze pigeon. Our AI expert is taking a bagel break!' },
      { status: 500 }
    )
  }
}
