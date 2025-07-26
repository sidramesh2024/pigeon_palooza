
import { PigeonLeaderboard } from '@/components/pigeon-leaderboard'

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏆 Top Pigeons of NYC
        </h1>
        <p className="text-xl text-gray-600">
          The most legendary pigeons in the Big Apple!
        </p>
      </div>
      <PigeonLeaderboard />
    </div>
  )
}
