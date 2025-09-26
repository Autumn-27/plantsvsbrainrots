'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { TradeCard } from './TradeCard'
import type { PvbTradeDTO } from './types/item'

interface TradeListClientProps {
  initialTrades: PvbTradeDTO[]
  onOpenModal: (trade: PvbTradeDTO) => void
}

export default function TradeListClient({ initialTrades, onOpenModal }: TradeListClientProps) {
  const searchParams = useSearchParams()
  const [trades, setTrades] = useState<PvbTradeDTO[]>(initialTrades)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMoreTrades = useCallback(async () => {
    if (loading || !hasMore) return

    const tradeId = searchParams.get('tradeId')
    
    // 如果正在查询特定 tradeId，不需要加载更多
    if (tradeId) {
      setHasMore(false)
      return
    }

    setLoading(true)
    try {
      const have = searchParams.get('have') || ''
      const want = searchParams.get('want') || ''
      
      const params = new URLSearchParams({
        have,
        want,
        page: (page + 1).toString(),
        limit: '10'
      })

      const response = await fetch(`/api/pvb/trades?${params.toString()}`)
      const newTrades = await response.json() as PvbTradeDTO[]

      if (newTrades.length === 0) {
        setHasMore(false)
      } else {
        setTrades(prev => [...prev, ...newTrades])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to load more trades:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, searchParams])

  // Reset when search params change
  useEffect(() => {
    setTrades(initialTrades)
    setPage(1)
    setHasMore(true)
  }, [initialTrades])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreTrades()
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = document.getElementById('load-more-sentinel')
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [loadMoreTrades, hasMore, loading])

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} onOpenModal={onOpenModal} />
        ))}
      </div>
      
      {/* Loading indicator and sentinel */}
      <div id="load-more-sentinel" className="h-10 flex items-center justify-center">
        {loading && (
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="font-medium">Loading more trades...</span>
          </div>
        )}
        {!hasMore && trades.length > 0 && (
          <div className="text-slate-500 text-center py-12">
            <div className="text-lg font-medium">No more trades to load</div>
            <div className="text-sm mt-1">You've reached the end of the list</div>
          </div>
        )}
      </div>
    </>
  )
}
