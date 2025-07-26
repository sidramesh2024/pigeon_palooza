
'use client'

import { Camera, Star, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 py-12"
    >
      <div className="flex justify-center">
        <div className="relative">
          <Camera className="h-16 w-16 text-blue-600" />
          <motion.div 
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Pigeon <span className="text-blue-600">Palooza</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The Big Apple's premier pigeon rating experience! Snap pics of NYC's feathered citizens and rate their 
          <span className="font-semibold text-blue-600"> attitude</span>, 
          <span className="font-semibold text-orange-600"> strut level</span>, and 
          <span className="font-semibold text-green-600"> tourist-judging skills</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-sm">
        <div className="flex items-center justify-center space-x-2 bg-white/60 rounded-lg p-4 shadow-sm">
          <Camera className="h-5 w-5 text-blue-600" />
          <span>Snap or Upload Photos</span>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-white/60 rounded-lg p-4 shadow-sm">
          <Star className="h-5 w-5 text-yellow-600" />
          <span>Get AI-Powered Ratings</span>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-white/60 rounded-lg p-4 shadow-sm">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>Earn Landmark Bonuses</span>
        </div>
      </div>
    </motion.div>
  )
}
