'use client'

import { useEffect, useState, memo } from 'react'
import type { PvbTradeDTO } from '@/app/plants-vs-brainrots-trading/types/item'
import { TradeCard } from '@/app/plants-vs-brainrots-trading/TradeCard'

function MyPvbTrades() {
  const [trades, setTrades] = useState<PvbTradeDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTrades = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pvb/trades?mine=1')
      if (!res.ok) throw new Error('Failed to load trades')
      const data = await res.json() as PvbTradeDTO[]
      setTrades(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTrades() }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={loadTrades} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
      </div>
    )
  }

  if (!trades.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">No PVB trades found</div>
    )
  }

  return (
    <div className="space-y-6">
      {trades.map(t => (
          <div key={t.id} className="space-y-3">
          <TradeCard key={t.id} trade={t} onOpenModal={() => {}} />
          <div className="flex items-center justify-between rounded-lg p-3 bg-[#141824]/60 backdrop-blur border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Status:</span>
              <select
                value={t.status || 'ongoing'}
                onChange={async (e) => {
                  const newStatus = e.target.value as 'ongoing' | 'completed'
                  try {
                    const res = await fetch(`/api/pvb/trades/${t.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: newStatus }),
                    })
                    if (!res.ok) throw new Error('Failed to update status')
                    setTrades(prev => prev.map(x => x.id === t.id ? { ...x, status: newStatus } : x))
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (e) {
                    setError('Failed to update status')
                  }
                }}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this trade?')) return
                try {
                  const res = await fetch(`/api/pvb/trades/${t.id}`, { method: 'DELETE' })
                  if (!res.ok) throw new Error('Failed to delete')
                  setTrades(prev => prev.filter(x => x.id !== t.id))
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                  setError('Failed to delete trade')
                }
              }}
              className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors"
            >
              Delete Trade
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(MyPvbTrades)


