
'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Star, MapPin, Calendar, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Pigeon {
  id: string
  imageUrl: string
  attitudeRating: number
  strutRating: number
  touristJudgingRating: number
  overallScore: number
  landmark: string
  bonusPoints: number
  funDescription: string
  submittedBy: string
  createdAt: string
}

export function PigeonLeaderboard() {
  const [topPigeons, setTopPigeons] = useState<Pigeon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopPigeons()
  }, [])

  const fetchTopPigeons = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setTopPigeons(data)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">{index + 1}</div>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-100 to-yellow-200 border-yellow-300'
      case 1:
        return 'from-gray-50 to-gray-100 border-gray-300'
      case 2:
        return 'from-amber-50 to-amber-100 border-amber-300'
      default:
        return 'from-blue-50 to-blue-100 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {topPigeons.map((pigeon, index) => (
        <motion.div
          key={pigeon.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r ${getRankColor(index)} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 flex items-center space-x-3">
                  {getRankIcon(index)}
                  <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={pigeon.imageUrl}
                      alt={`Pigeon at ${pigeon.landmark}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {pigeon.overallScore.toFixed(1)}
                      </Badge>
                      {pigeon.bonusPoints > 0 && (
                        <Badge variant="secondary">
                          +{pigeon.bonusPoints} bonus
                        </Badge>
                      )}
                    </div>
                    {index < 3 && (
                      <Badge className={index === 0 ? 'bg-yellow-600' : index === 1 ? 'bg-gray-600' : 'bg-amber-600'}>
                        #{index + 1} Place
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{pigeon.landmark}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">{pigeon.attitudeRating}/5</div>
                      <div className="text-xs text-gray-500">Attitude</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{pigeon.strutRating}/5</div>
                      <div className="text-xs text-gray-500">Strut</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{pigeon.touristJudgingRating}/5</div>
                      <div className="text-xs text-gray-500">Judging</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-700 italic bg-white/60 p-2 rounded mb-2">
                    "{pigeon.funDescription}"
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{pigeon.submittedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(pigeon.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {topPigeons.length === 0 && (
        <Card className="text-center p-12">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pigeons Yet!</h3>
            <p className="text-gray-500">Be the first to rate a pigeon and claim the top spot!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
