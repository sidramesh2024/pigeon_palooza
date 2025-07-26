
'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, MapPin, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzePigeonImage, createPigeon } from '@/lib/supabase-helpers'

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

interface RatingResult {
  attitudeRating: number
  strutRating: number
  touristJudgingRating: number
  overallScore: number
  funDescription: string
  bonusPoints: number
}

export function PigeonRater() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedLandmark, setSelectedLandmark] = useState<string>('')
  const [submitterName, setSubmitterName] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [ratingResult, setRatingResult] = useState<RatingResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setRatingResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setRatingResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage || !selectedLandmark) {
      toast({
        title: "Missing Info",
        description: "Please select an image and landmark before analyzing!",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await analyzePigeonImage(selectedImage, selectedLandmark)
      setRatingResult(result)
      
      toast({
        title: "Analysis Complete!",
        description: "Your pigeon has been rated by our AI expert!",
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis Failed",
        description: "Our pigeon expert is taking a coffee break. Try again!",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const submitRating = async () => {
    if (!ratingResult || !selectedImage) return

    setIsSubmitting(true)
    try {
      await createPigeon({
        imageUrl: selectedImage,
        landmark: selectedLandmark,
        submittedBy: submitterName || "Anonymous New Yorker",
        attitudeRating: ratingResult.attitudeRating,
        strutRating: ratingResult.strutRating,
        touristJudgingRating: ratingResult.touristJudgingRating,
        overallScore: ratingResult.overallScore,
        funDescription: ratingResult.funDescription,
        bonusPoints: ratingResult.bonusPoints
      })

      toast({
        title: "Pigeon Submitted!",
        description: "Your feathered friend is now part of the Palooza!",
      })
      
      // Reset form
      setSelectedImage(null)
      setSelectedLandmark('')
      setSubmitterName('')
      setRatingResult(null)
      
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Try again!",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Capture Your Pigeon</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              variant="outline"
              size="lg"
              className="h-32 border-dashed border-2 hover:bg-blue-50"
            >
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <span>Take Photo</span>
              </div>
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
              className="h-32 border-dashed border-2 hover:bg-green-50"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <span>Upload Image</span>
              </div>
            </Button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
            >
              <Image
                src={selectedImage}
                alt="Selected pigeon"
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landmark">NYC Landmark</Label>
              <Select value={selectedLandmark} onValueChange={setSelectedLandmark}>
                <SelectTrigger>
                  <SelectValue placeholder="Where'd you spot this bird?" />
                </SelectTrigger>
                <SelectContent>
                  {NYC_LANDMARKS.map((landmark) => (
                    <SelectItem key={landmark.name} value={landmark.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{landmark.name}</span>
                        <span className="text-xs text-gray-500 ml-2">+{landmark.bonus} pts</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Anonymous New Yorker"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={analyzeImage}
            disabled={!selectedImage || !selectedLandmark || isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Pigeon Personality...
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Rate This Pigeon!
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {ratingResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Pigeon Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {ratingResult.overallScore.toFixed(1)}/5.0
                  </div>
                  <div className="text-lg text-gray-600">Overall Pigeon Score</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {ratingResult.attitudeRating}/5
                    </div>
                    <div className="text-sm text-gray-600">Attitude</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {ratingResult.strutRating}/5
                    </div>
                    <div className="text-sm text-gray-600">Strut Level</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {ratingResult.touristJudgingRating}/5
                    </div>
                    <div className="text-sm text-gray-600">Tourist Judging</div>
                  </div>
                </div>

                {ratingResult.bonusPoints > 0 && (
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      🎉 Landmark Bonus: +{ratingResult.bonusPoints} points!
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">NYC Expert Analysis:</h3>
                  <p className="text-blue-700 italic">"{ratingResult.funDescription}"</p>
                </div>

                <Button
                  onClick={submitRating}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding to Palooza...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Add to Pigeon Palooza!
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
