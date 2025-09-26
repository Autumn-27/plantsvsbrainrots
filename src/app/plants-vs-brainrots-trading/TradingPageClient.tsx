'use client'

import { useState, useEffect } from 'react'
import type { PvbTradeDTO } from './types/item'
import { useRouter, useSearchParams } from 'next/navigation'
import TradeIdSearch from './TradeIdSearch'
import TradeListClient from './TradeListClient'
import { TradeDetailModal } from './TradeDetailButton'

interface TradingPageClientProps { initialTrades: PvbTradeDTO[] }

export default function TradingPageClient({ initialTrades }: TradingPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trades, setTrades] = useState<PvbTradeDTO[]>(initialTrades)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<PvbTradeDTO | null>(null)

  const refreshData = async () => {
    setLoading(true)
    try {
      const have = searchParams.get('have') || ''
      const want = searchParams.get('want') || ''
      const tradeId = searchParams.get('tradeId') || ''
      const dmgGt = searchParams.get('dmgGt') || ''
      const dmgLt = searchParams.get('dmgLt') || ''
      const normalGt = searchParams.get('normalGt') || ''
      const normalLt = searchParams.get('normalLt') || ''
      
      const params = new URLSearchParams()
      if (have) params.set('have', have)
      if (want) params.set('want', want)
      if (tradeId) params.set('tradeId', tradeId)
      if (dmgGt) params.set('dmgGt', dmgGt)
      if (dmgLt) params.set('dmgLt', dmgLt)
      if (normalGt) params.set('normalGt', normalGt)
      if (normalLt) params.set('normalLt', normalLt)
      
      const response = await fetch(`/api/pvb/trades?${params.toString()}`)
      const newTrades = await response.json() as PvbTradeDTO[]
      setTrades(newTrades)
    } catch (error) {
      console.error('Failed to refresh trades:', error)
    } finally {
      setLoading(false)
    }
  }

  // 监听URL参数变化，自动刷新数据
  useEffect(() => {
    refreshData()
  }, [searchParams])

  const handleOpenModal = (trade: PvbTradeDTO) => {
    setSelectedTrade(trade)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTrade(null)
  }

  return (
    <>
      <TradeIdSearch onRefresh={refreshData} />
      <TradeListClient initialTrades={trades} onOpenModal={handleOpenModal} />
      <TradeDetailModal trade={selectedTrade} open={modalOpen} onClose={handleCloseModal} />
    </>
  )
}
