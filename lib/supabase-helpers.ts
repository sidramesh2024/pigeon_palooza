import { supabase } from './supabase'

// Types
interface PigeonData {
  imageUrl: string
  attitudeRating: number
  strutRating: number
  touristJudgingRating: number
  overallScore: number
  landmark: string
  bonusPoints: number
  funDescription: string
  submittedBy: string
}

interface PigeonAnalysis {
  attitudeRating: number
  strutRating: number
  touristJudgingRating: number
  overallScore: number
  funDescription: string
  bonusPoints: number
}

// Pigeon database operations
export async function createPigeon(pigeonData: PigeonData) {
  // Only run on client side
  if (typeof window === 'undefined') {
    throw new Error('Database operations only available on client side')
  }
  
  const { data, error } = await supabase
    .from('pigeons')
    .insert([{
      imageUrl: pigeonData.imageUrl,
      attitudeRating: pigeonData.attitudeRating,
      strutRating: pigeonData.strutRating,
      touristJudgingRating: pigeonData.touristJudgingRating,
      overallScore: pigeonData.overallScore,
      landmark: pigeonData.landmark,
      bonusPoints: pigeonData.bonusPoints,
      funDescription: pigeonData.funDescription,
      submittedBy: pigeonData.submittedBy
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAllPigeons() {
  // Only run on client side
  if (typeof window === 'undefined') {
    return []
  }
  
  const { data, error } = await supabase
    .from('pigeons')
    .select('*')
    .order('createdAt', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getLeaderboard(limit: number = 50) {
  // Only run on client side
  if (typeof window === 'undefined') {
    return []
  }
  
  const { data, error } = await supabase
    .from('pigeons')
    .select('*')
    .order('overallScore', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

// AI Analysis - Client-side mock for now, will need Edge Function for production
export async function analyzePigeonImage(imageData: string, landmark: string): Promise<PigeonAnalysis> {
  // For static deployment, we'll use a mock analysis
  // In production, this should call a Supabase Edge Function or Netlify Function
  
  // NYC Landmarks with bonus points
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

  // Get landmark bonus points
  const landmarkInfo = NYC_LANDMARKS.find(l => l.name === landmark)
  const bonusPoints = landmarkInfo?.bonus || 10

  // Generate random but realistic ratings for demo
  const attitudeRating = Math.floor(Math.random() * 3) + 3; // 3-5
  const strutRating = Math.floor(Math.random() * 3) + 3; // 3-5
  const touristJudgingRating = Math.floor(Math.random() * 3) + 3; // 3-5

  // Calculate overall score
  const baseScore = (attitudeRating + strutRating + touristJudgingRating) / 3
  const overallScore = Math.min(5.0, baseScore + (bonusPoints / 100))

  // NYC slang descriptions
  const descriptions = [
    `This pigeon's got that classic ${landmark} swagger - definitely born and raised in the five boroughs!`,
    `Spotted this absolute unit strutting around ${landmark} like they own the place. Respect!`,
    `This bird's giving major NYC energy at ${landmark} - probably judges tourists better than any Yelp review.`,
    `Pure Brooklyn attitude on display at ${landmark}. This pigeon's seen some things and ain't impressed.`,
    `This feathered New Yorker at ${landmark} is serving looks and attitude in equal measure.`
  ]

  const funDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

  return {
    attitudeRating,
    strutRating,
    touristJudgingRating,
    overallScore: parseFloat(overallScore.toFixed(2)),
    funDescription,
    bonusPoints
  }
}

// Real-time subscription for new pigeons
export function subscribeToPigeonUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('pigeons-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'pigeons' 
      }, 
      callback
    )
    .subscribe()
}

// Upload pigeon image to Supabase Storage
export async function uploadPigeonImage(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from('pigeon-images')
    .upload(fileName, file)
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('pigeon-images')
    .getPublicUrl(fileName)
    
  return publicUrl
}

// Get real-time leaderboard (alias for getLeaderboard)
export async function getRealtimeLeaderboard() {
  return getLeaderboard(10)
} 