
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedPigeons = [
  {
    imageUrl: 'https://i.ytimg.com/vi/OC08Vbinydo/maxresdefault.jpg',
    attitudeRating: 5,
    strutRating: 4,
    touristJudgingRating: 5,
    overallScore: 4.8,
    landmark: 'Times Square',
    bonusPoints: 45,
    funDescription: "This bird's got more swagger than a Broadway performer and twice the attitude of a taxi driver in rush hour!",
    submittedBy: 'StreetPhotographer_NYC'
  },
  {
    imageUrl: 'https://pbs.twimg.com/media/FyhoPGHWIAIoUAZ.jpg:large',
    attitudeRating: 5,
    strutRating: 5,
    touristJudgingRating: 4,
    overallScore: 4.7,
    landmark: 'Central Park',
    bonusPoints: 30,
    funDescription: "Strutting through the park like they just paid Manhattan rent and don't care who knows it!",
    submittedBy: 'ParkRanger_Pete'
  },
  {
    imageUrl: 'https://i.ytimg.com/vi/iKxZhQozAjI/maxresdefault.jpg',
    attitudeRating: 4,
    strutRating: 5,
    touristJudgingRating: 3,
    overallScore: 4.2,
    landmark: 'Washington Square Park',
    bonusPoints: 25,
    funDescription: "Walking with more confidence than someone who just found a good pizza slice for under $3!",
    submittedBy: 'VillageLocal'
  },
  {
    imageUrl: 'https://laughingsquid.com/wp-content/uploads/2024/10/New-York-City-Pigeons.jpg',
    attitudeRating: 4,
    strutRating: 3,
    touristJudgingRating: 4,
    overallScore: 3.8,
    landmark: 'Other NYC Location',
    bonusPoints: 10,
    funDescription: "Classic NYC street pigeon with that 'I've seen everything' vibe of a lifetime subway rider!",
    submittedBy: 'NYCNative_2024'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/10144311/pexels-photo-10144311.jpeg',
    attitudeRating: 3,
    strutRating: 2,
    touristJudgingRating: 2,
    overallScore: 2.5,
    landmark: 'Central Park',
    bonusPoints: 30,
    funDescription: "Chillin' in Central Park with the laid-back energy of someone who found a rent-stabilized apartment!",
    submittedBy: 'NaturePhotog_NY'
  },
  {
    imageUrl: 'https://thumbs.dreamstime.com/b/portrait-funny-pigeon-pigeon-sitting-looking-directly-camera-portrait-funny-pigeon-pigeon-sitting-looking-319917652.jpg',
    attitudeRating: 5,
    strutRating: 3,
    touristJudgingRating: 5,
    overallScore: 4.4,
    landmark: 'Other NYC Location',
    bonusPoints: 10,
    funDescription: "Staring down tourists with the intensity of a bodega owner watching someone touch all the fruit!",
    submittedBy: 'TouristWatcher'
  },
  {
    imageUrl: 'https://i.ytimg.com/vi/659rogrizPo/maxresdefault.jpg',
    attitudeRating: 4,
    strutRating: 4,
    touristJudgingRating: 4,
    overallScore: 4.1,
    landmark: 'Brooklyn Bridge',
    bonusPoints: 40,
    funDescription: "Brooklyn born and raised, with attitude thicker than a good New York cheesecake!",
    submittedBy: 'BrooklynBirdWatcher'
  },
  {
    imageUrl: 'https://cdn.abacus.ai/images/bd9deaf2-e520-4a74-b7c9-de14a838a9f0.png',
    attitudeRating: 5,
    strutRating: 4,
    touristJudgingRating: 5,
    overallScore: 4.9,
    landmark: 'Empire State Building',
    bonusPoints: 50,
    funDescription: "This pigeon's got more chutzpah than a Times Square hot dog vendor and the judgment skills of a true New Yorker!",
    submittedBy: 'SkylineSpotter'
  },
  {
    imageUrl: 'https://cdn.abacus.ai/images/078c6183-ecd5-4577-bf0b-ae29eccad12b.png',
    attitudeRating: 5,
    strutRating: 5,
    touristJudgingRating: 4,
    overallScore: 4.8,
    landmark: 'Brooklyn Bridge',
    bonusPoints: 40,
    funDescription: "Sashaying across the Brooklyn Bridge like they're walking the runway at Fashion Week!",
    submittedBy: 'BridgeWalker_NYC'
  },
  {
    imageUrl: 'https://cdn.abacus.ai/images/f114e813-6672-4753-af38-ae406ea57d2c.png',
    attitudeRating: 4,
    strutRating: 3,
    touristJudgingRating: 5,
    overallScore: 4.2,
    landmark: 'Central Park',
    bonusPoints: 30,
    funDescription: "Giving tourists the side-eye with more judgment than a native New Yorker watching someone take photos of pigeons!",
    submittedBy: 'CentralParkRegular'
  }
]

async function main() {
  console.log('🐦 Starting Pigeon Palooza database seeding...')
  
  // Clear existing data
  await prisma.pigeon.deleteMany({})
  console.log('📝 Cleared existing pigeon data')
  
  // Add sample pigeons
  for (const pigeon of seedPigeons) {
    await prisma.pigeon.create({
      data: {
        ...pigeon,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      }
    })
  }
  
  console.log(`✅ Successfully seeded ${seedPigeons.length} pigeons into the database!`)
  console.log('🎉 Pigeon Palooza is ready to rate some birds!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
