
'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, User } from 'lucide-react'
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

export function PigeonGallery() {
  const [pigeons, setPigeons] = useState<Pigeon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPigeons()
  }, [])

  const fetchPigeons = async () => {
    try {
      const response = await fetch('/api/pigeons')
      if (response.ok) {
        const data = await response.json()
        setPigeons(data)
      }
    } catch (error) {
      console.error('Failed to fetch pigeons:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pigeons.map((pigeon, index) => (
        <motion.div
          key={pigeon.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={pigeon.imageUrl}
                alt={`Pigeon at ${pigeon.landmark}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  {pigeon.overallScore.toFixed(1)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{pigeon.landmark}</span>
                {pigeon.bonusPoints > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{pigeon.bonusPoints}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-purple-600">{pigeon.attitudeRating}/5</div>
                  <div className="text-gray-500">Attitude</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{pigeon.strutRating}/5</div>
                  <div className="text-gray-500">Strut</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">{pigeon.touristJudgingRating}/5</div>
                  <div className="text-gray-500">Judging</div>
                </div>
              </div>
              
              <p className="text-sm text-blue-700 italic bg-blue-50 p-2 rounded">
                "{pigeon.funDescription}"
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{pigeon.submittedBy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(pigeon.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
