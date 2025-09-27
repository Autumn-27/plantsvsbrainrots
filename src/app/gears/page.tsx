/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import gearsData from '@/content/data/gears.json'
import ImageWithFallback from '@/components/ImageWithFallback'

export const metadata: Metadata = {
  title: 'Plants vs Brainrots Gears List - Gears Guide',
  description: 'Complete guide to all gears in Plants vs Brainrots, including weapons, potions, equipment, and strategic gameplay items',
}

interface Gear {
  name: string
  slug: string
  rarity: string
  price: number | string
  description: string
  category: string
  damage?: number
  effect?: string
  priority: string
}

const rarityColors = {
  Common: 'text-gray-400',
  Epic: 'text-purple-400',
  Legendary: 'text-yellow-400',
  Godly: 'text-red-400',
  Secret: 'text-pink-400',
  Mythic: 'text-orange-400',
  Rare: 'text-blue-400'
}

const priorityColors = {
  essential: 'bg-red-500/15 text-red-200 border-red-400/30',
  recommended: 'bg-yellow-500/15 text-yellow-200 border-yellow-400/30',
  optional: 'bg-blue-500/15 text-blue-200 border-blue-400/30',
  luxury: 'bg-purple-500/15 text-purple-200 border-purple-400/30'
}

const priorityLabels = {
  essential: '🔥 Essential',
  recommended: '⭐ Recommended',
  optional: '📦 Optional',
  luxury: '🎮 Luxury'
}

export default function GearsPage() {
  const gears: Gear[] = gearsData

  return (
    <main className="min-h-screen px-5 py-8 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300 mb-4">
            Plants vs Brainrots Gears List
          </h1>
          <p className="text-lg text-white/80 max-w-4xl mx-auto">
            Complete guide to all gears in Plants vs Brainrots, including weapons, potions, equipment, and strategic gameplay items. Master these gears to dominate both defense and multiplayer interactions.
          </p>
        </div>

        {/* Key Info */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Gear Shop</h3>
              <p className="text-white/80">
                Gear Shop restocks every 5 minutes - set timers for rare items like Frost Grenade!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Get Gears</h3>
              <p className="text-white/80">
                Purchase all gears from the Gear Shop which refreshes inventory every 5 minutes. Tools are stored in your inventory and require manual activation.
              </p>
            </div>
          </div>
        </div>

        {/* Purchase Priority Guide */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Purchase Priority Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border-red-500/20 bg-red-500/5">
              <h3 className="font-bold text-red-300 mb-2">🔥 Essential</h3>
              <p className="text-sm text-red-200">Buy Immediately</p>
              <p className="text-xs text-red-300/80 mt-2">Frost Grenades - Game's most critical tool, prioritize above all else</p>
            </div>
            <div className="card p-4 border-yellow-500/20 bg-yellow-500/5">
              <h3 className="font-bold text-yellow-300 mb-2">⭐ Recommended</h3>
              <p className="text-sm text-yellow-200">Buy When Affordable</p>
              <p className="text-xs text-yellow-300/80 mt-2">Lucky Potion - Use before planting expensive seeds for better mutations</p>
            </div>
            <div className="card p-4 border-blue-500/20 bg-blue-500/5">
              <h3 className="font-bold text-blue-300 mb-2">📦 Optional</h3>
              <p className="text-sm text-blue-200">Situational Use</p>
              <p className="text-xs text-blue-300/80 mt-2">Water Bucket - Only cost-effective on Epic+ plants due to diminishing returns</p>
            </div>
            <div className="card p-4 border-purple-500/20 bg-purple-500/5">
              <h3 className="font-bold text-purple-300 mb-2">🎮 Luxury</h3>
              <p className="text-sm text-purple-200">Entertainment Value</p>
              <p className="text-xs text-purple-300/80 mt-2">Carrot Launcher - Multiplayer fun, minimal combat utility</p>
            </div>
          </div>
        </div>

        {/* All Gears List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">All Gear List</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-2 pr-3 text-center">Tool Name</th>
                    <th className="py-2 pr-3">Rarity</th>
                    <th className="py-2 pr-3">Price</th>
                    <th className="py-2 pr-3">Description</th>
                    <th className="py-2 pr-3">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {gears.map((gear, i) => (
                    <tr key={gear.slug} className={i % 2 === 0 ? "bg-white/[.02]" : "bg-transparent"}>
                      <td className="py-3 pr-3">
                        <div className="flex flex-col items-center gap-2 min-w-[180px]">
                          <ImageWithFallback
                            src={`/gears/${gear.slug}.png`}
                            alt={`${gear.name} image`}
                            width={128}
                            height={128}
                            className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover border border-white/10 shadow-sm"
                          />
                          <span className="text-sm font-medium text-white/90 text-center">{gear.name}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <span className={`text-sm font-medium ${rarityColors[gear.rarity as keyof typeof rarityColors]}`}>
                          {gear.rarity}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-sm text-white/90">
                        {typeof gear.price === 'number' ? `$${gear.price.toLocaleString()}` : gear.price}
                      </td>
                      <td className="py-2 pr-3 text-sm text-white/80 max-w-md">
                        {gear.description}
                      </td>
                      <td className="py-2 pr-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${priorityColors[gear.priority as keyof typeof priorityColors]}`}>
                          {priorityLabels[gear.priority as keyof typeof priorityLabels]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Advanced Techniques */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Advanced Techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Frost Grenade Mastery</h3>
              <ul className="space-y-2 text-white/80">
                <li>• <strong>Target Priority:</strong> Largest, highest-HP brainrots first</li>
                <li>• <strong>Timing:</strong> Throw just before brainrot reaches your strongest plants</li>
                <li>• <strong>Team Support:</strong> Help neighboring players with their toughest enemies</li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Potion Optimization</h3>
              <ul className="space-y-2 text-white/80">
                <li>• <strong>Always Stack:</strong> Lucky + Speed potions together for multiplicative benefits</li>
                <li>• <strong>Timing:</strong> Activate before planting expensive seeds or active sessions</li>
                <li>• <strong>Planning:</strong> Buy multiple potions for extended play sessions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Reminders */}
        <div className="card p-6 border-yellow-500/20 bg-yellow-500/5">
          <h2 className="text-2xl font-semibold mb-4">Key Reminders</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shop Management</h3>
              <p className="text-white/80 text-sm">
                Check Gear Shop every 5 minutes for Frost Grenade restocks and rare items.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tool Activation</h3>
              <p className="text-white/80 text-sm">
                All purchased tools go to inventory and require manual activation when needed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Budget Priority</h3>
              <p className="text-white/80 text-sm">
                Always maintain $15k+ cash reserve for immediate Frost Grenade purchases when available.
              </p>
            </div>
          </div>
        </div>
    </main>
  )
}
