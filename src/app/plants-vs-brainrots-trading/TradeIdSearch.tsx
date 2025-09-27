'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TradeFilter from './TradeFilter'
import AutoRefreshSettings from './AutoRefreshSettings'

interface TradeIdSearchProps {
  onRefresh?: () => void
}

export default function TradeIdSearch({ onRefresh }: TradeIdSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState('')
  const [dmgOp, setDmgOp] = useState<'>' | '<'>('>')
  const [dmgVal, setDmgVal] = useState('')
  const [normalOp, setNormalOp] = useState<'>' | '<'>('>')
  const [normalVal, setNormalVal] = useState('')

  // Initialize from URL params
  useEffect(() => {
    const tradeIdParam = searchParams.get('tradeId') || ''
    setTradeId(tradeIdParam)
    const dgt = (searchParams.get('dmgGt') || '').trim()
    const dlt = (searchParams.get('dmgLt') || '').trim()
    if (dgt) { setDmgOp('>'); setDmgVal(dgt) }
    else if (dlt) { setDmgOp('<'); setDmgVal(dlt) } else { setDmgVal('') }
    const ngt = (searchParams.get('normalGt') || '').trim()
    const nlt = (searchParams.get('normalLt') || '').trim()
    if (ngt) { setNormalOp('>'); setNormalVal(ngt) }
    else if (nlt) { setNormalOp('<'); setNormalVal(nlt) } else { setNormalVal('') }
  }, [searchParams])

  const handleTradeIdChange = (value: string) => {
    setTradeId(value)
    updateURL(value)
  }

  const updateURL = (tradeIdValue: string) => {
    const params = new URLSearchParams()
    
    // Preserve existing filter params
    const have = searchParams.get('have')
    const want = searchParams.get('want')
    if (have) params.set('have', have)
    if (want) params.set('want', want)
    // DMG/Normal filters
    if (dmgVal.trim()) params.set(dmgOp === '>' ? 'dmgGt' : 'dmgLt', dmgVal.trim())
    if (normalVal.trim()) params.set(normalOp === '>' ? 'normalGt' : 'normalLt', normalVal.trim())
    
    // Add or remove tradeId
    if (tradeIdValue && tradeIdValue.trim()) {
      params.set('tradeId', tradeIdValue.trim())
    }
    
    router.push(`?${params.toString()}`)
  }

  const clearTradeId = () => {
    setTradeId('')
    updateURL('')
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
      <div className="flex-1"><TradeFilter /></div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 lg:flex-shrink-0 w-full md:w-auto">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label className="text-sm text-white/80 whitespace-nowrap">DMG:</label>
          <div className="flex items-center bg-[#141824]/60 border border-white/10 rounded-lg overflow-hidden w-full md:w-auto">
            <button
              type="button"
              onClick={() => setDmgOp(dmgOp === '>' ? '<' : '>')}
              className="px-3 py-2 bg-white/10 text-white hover:bg-white/15 transition-colors border-r border-white/10"
            >
              {dmgOp}
            </button>
            <input 
              type="number" 
              value={dmgVal} 
              onChange={(e)=>{ setDmgVal(e.target.value) }} 
              placeholder="10" 
              className="px-3 py-2 bg-transparent text-white text-sm placeholder:text-white/50 focus:outline-none w-full md:w-20 flex-1 min-w-0" 
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label className="text-sm text-white/80 whitespace-nowrap">Normal:</label>
          <div className="flex items-center bg-[#141824]/60 border border-white/10 rounded-lg overflow-hidden w-full md:w-auto">
            <button
              type="button"
              onClick={() => setNormalOp(normalOp === '>' ? '<' : '>')}
              className="px-3 py-2 bg-white/10 text-white hover:bg-white/15 transition-colors border-r border-white/10"
            >
              {normalOp}
            </button>
            <input 
              type="number" 
              value={normalVal} 
              onChange={(e)=>{ setNormalVal(e.target.value) }} 
              placeholder="5" 
              className="px-3 py-2 bg-transparent text-white text-sm placeholder:text-white/50 focus:outline-none w-full md:w-20 flex-1 min-w-0" 
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 w-full md:w-auto">
          <label className="text-sm text-gray-300 whitespace-nowrap">ID:</label>
          <input
            type="text"
            value={tradeId}
            onChange={(e) => handleTradeIdChange(e.target.value)}
            placeholder="Enter ID..."
            className="px-2 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 w-full md:w-32"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <AutoRefreshSettings onRefresh={onRefresh || (() => window.location.reload())} />
        </div>
        <div className="w-full md:w-auto md:ml-auto">
          <button onClick={() => updateURL(tradeId)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 w-full md:w-auto">Search</button>
        </div>
      </div>
    </div>
  )
}
