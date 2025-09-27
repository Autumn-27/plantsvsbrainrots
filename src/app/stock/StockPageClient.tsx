"use client"

import { useState, useEffect, useCallback } from 'react'
import ImageWithFallback from '@/components/ImageWithFallback'

interface StockItem {
  name: string
  stock: number
  available: boolean
  category: string
  type: string
  lastUpdated: string
}

interface StockData {
  seeds: StockItem[]
  gears: StockItem[]
  timestamp: string
  source: string
}

interface ItemData {
  name: string
  slug: string
  rarity: string
  [key: string]: string | number
}

const plantsData: ItemData[] = [
  { name: "Cactus", slug: "cactus", rarity: "Rare" },
  { name: "Strawberry", slug: "strawberry", rarity: "Rare" },
  { name: "Pumpkin", slug: "pumpkin", rarity: "Epic" },
  { name: "Sunflower", slug: "sunflower", rarity: "Epic" },
  { name: "Dragon Fruit", slug: "dragon-fruit", rarity: "Legendary" },
  { name: "Eggplant", slug: "eggplant", rarity: "Legendary" },
  { name: "Watermelon", slug: "watermelon", rarity: "Mythic" },
  { name: "Cocotank", slug: "cocotank", rarity: "Godly" },
  { name: "Carnivorous Plant", slug: "carnivorous-plant", rarity: "Godly" },
  { name: "Mr. Carrot", slug: "mr-carrot", rarity: "Secret" },
  { name: "Tomatrio", slug: "tomatrio", rarity: "Secret" }
]

const gearsData: ItemData[] = [
  { name: "Bat", slug: "bat", rarity: "Common" },
  { name: "Banana Gun", slug: "banana-gun", rarity: "Epic" },
  { name: "Carrot Launcher", slug: "carrot-launcher", rarity: "Godly" },
  { name: "Frost Grenade", slug: "frost-grenade", rarity: "Epic" },
  { name: "Frost Blower", slug: "frost-blower", rarity: "Legendary" },
  { name: "Water Bucket", slug: "water-bucket", rarity: "Epic" },
  { name: "Lucky Potion", slug: "lucky-potion", rarity: "Legendary" },
  { name: "Speed Potion", slug: "speed-potion", rarity: "Legendary" }
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'text-gray-400'
    case 'Rare': return 'text-green-400'
    case 'Epic': return 'text-purple-400'
    case 'Legendary': return 'text-yellow-400'
    case 'Mythic': return 'text-pink-400'
    case 'Godly': return 'text-red-400'
    case 'Secret': return 'text-cyan-400'
    default: return 'text-gray-400'
  }
}

const getStockStatusColor = (stock: number, available: boolean) => {
  if (!available) return 'text-red-400'
  if (stock === 0) return 'text-red-400'
  if (stock <= 2) return 'text-yellow-400'
  return 'text-green-400'
}

const getStockStatusText = (stock: number, available: boolean) => {
  if (!available) return 'Out of Stock'
  if (stock === 0) return 'Out of Stock'
  if (stock <= 2) return 'Low Stock'
  return 'In Stock'
}

export default function StockPageClient() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(0)

  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/stock')
      if (!response.ok) {
        throw new Error('Failed to fetch stock data')
      }
      const data: StockData = await response.json()
      setStockData(data)
      setLastRefresh(new Date())
      
      // Calculate next refresh time (5-minute intervals) using UTC time
      const now = new Date()
      const utcMinutes = now.getUTCMinutes()
      const nextRefreshMinutes = Math.ceil(utcMinutes / 5) * 5
      const nextRefreshTime = new Date(now)
      nextRefreshTime.setUTCMinutes(nextRefreshMinutes, 0, 0)
      
      // If the calculated time is in the past, add 5 minutes
      if (nextRefreshTime <= now) {
        nextRefreshTime.setUTCMinutes(nextRefreshTime.getUTCMinutes() + 5)
      }
      
      console.log('Current UTC time:', now.toISOString())
      console.log('Next refresh time:', nextRefreshTime.toISOString())
      console.log('Time difference (minutes):', (nextRefreshTime.getTime() - now.getTime()) / (1000 * 60))
      
      setNextRefresh(nextRefreshTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleManualRefresh = () => {
    setStockData(null) // 清空旧数据
    fetchStockData()
  }

  // Auto-refresh timer
  useEffect(() => {
    if (!nextRefresh) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = nextRefresh.getTime() - now.getTime()
      
      if (diff <= 0) {
        setStockData(null) // 清空旧数据
        fetchStockData()
      } else {
        const seconds = Math.ceil(diff / 1000)
        // 确保倒计时不会超过5分钟（300秒）
        setTimeUntilRefresh(Math.min(seconds, 300))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [nextRefresh, fetchStockData])

  // Initial fetch
  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  const formatTime = (seconds: number) => {
    if (seconds < 0) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getItemData = (name: string, type: 'seed' | 'gear') => {
    const data = type === 'seed' ? plantsData : gearsData
    return data.find(item => item.name === name) || { name, slug: name.toLowerCase().replace(/\s+/g, '-'), rarity: 'Unknown' }
  }

  const getImagePath = (name: string, type: 'seed' | 'gear') => {
    const itemData = getItemData(name, type)
    if (!itemData) return '/image.webp' // fallback image
    
    const folder = type === 'seed' ? 'plants' : 'gears'
    const extension = type === 'seed' ? 'webp' : 'png'
    return `/${folder}/${itemData.slug}.${extension}`
  }

  if (loading && !stockData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading stock data...</p>
        </div>
      </div>
    )
  }

  if (loading && stockData) {
    return (
      <div className="space-y-8">
        {/* 刷新控制区域 */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Stock Status</h2>
              <div className="text-slate-400">
                {lastRefresh && (
                  <p>Last updated: {lastRefresh.toLocaleString('en-US', { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })} (Local Time)</p>
                )}
                {nextRefresh && (
                  <p>Next refresh in: {formatTime(timeUntilRefresh)} (UTC)</p>
                )}
              </div>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Refreshing...
            </button>
          </div>
        </div>

        {/* 显示旧数据但带有刷新覆盖层 */}
        <div className="relative">
          <div className="opacity-50 pointer-events-none">
            {/* 这里显示旧数据，但被禁用 */}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Refreshing stock data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-400 text-xl mb-4">Error: {error}</div>
        <button
          onClick={handleManualRefresh}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 刷新控制区域 */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Stock Status</h2>
            <div className="text-slate-400">
              {lastRefresh && (
                <p>Last updated: {lastRefresh.toLocaleString('en-US', { 
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })} (Local Time)</p>
              )}
              {nextRefresh && (
                <p>Next refresh in: {formatTime(timeUntilRefresh)} (UTC)</p>
              )}
            </div>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Refresh Now
          </button>
        </div>
      </div>

      {/* 种子库存 */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          Seeds ({stockData?.seeds.length || 0})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stockData?.seeds.map((item) => {
            const itemData = getItemData(item.name, 'seed')
            return (
              <div
                key={item.name}
                className="bg-slate-700/50 rounded-xl border border-slate-600/50 p-4 hover:bg-slate-700/70 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ImageWithFallback
                    src={getImagePath(item.name, 'seed')}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{item.name}</h4>
                    <p className={`text-sm ${getRarityColor(itemData?.rarity || '')}`}>
                      {itemData?.rarity || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Stock:</span>
                    <span className={`font-semibold ${getStockStatusColor(item.stock, item.available)}`}>
                      {item.stock}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <span className={`text-sm font-medium ${getStockStatusColor(item.stock, item.available)}`}>
                      {getStockStatusText(item.stock, item.available)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 装备库存 */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Gears ({stockData?.gears.length || 0})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stockData?.gears.map((item) => {
            const itemData = getItemData(item.name, 'gear')
            return (
              <div
                key={item.name}
                className="bg-slate-700/50 rounded-xl border border-slate-600/50 p-4 hover:bg-slate-700/70 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ImageWithFallback
                    src={getImagePath(item.name, 'gear')}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{item.name}</h4>
                    <p className={`text-sm ${getRarityColor(itemData?.rarity || '')}`}>
                      {itemData?.rarity || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Stock:</span>
                    <span className={`font-semibold ${getStockStatusColor(item.stock, item.available)}`}>
                      {item.stock}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <span className={`text-sm font-medium ${getStockStatusColor(item.stock, item.available)}`}>
                      {getStockStatusText(item.stock, item.available)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
