export const runtime = 'edge'
import { Metadata } from 'next'
import TradingPageClient from './TradingPageClient'
import { pvbListTrades, pvbGetTradeById } from '@/lib/pvb/d1'
import PublishTradeButton from './PublishTradeButton'

export const metadata: Metadata = {
  title: {
    absolute: 'Plants vs Brainrots Trading'
  },
  description: 'Trade your Plants and Brainrots with other players. Find the perfect match for your collection!',
}

async function fetchTrades(search: { have?: string; want?: string; tradeId?: string; dmgGt?: string; dmgLt?: string; normalGt?: string; normalLt?: string }) {
  // 如果有交易ID，直接查询该交易
  if (search.tradeId && search.tradeId.trim()) {
    try {
      const trade = await pvbGetTradeById(parseInt(search.tradeId.trim()))
      return trade ? [trade] : []
    } catch (error) {
      console.error('Error fetching trade by ID:', error)
      return []
    }
  }
  
  // 否则按筛选条件查询
  const haveIds = (search.have || '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  const wantIds = (search.want || '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  return await pvbListTrades({ 
    haveItemIds: haveIds.length ? haveIds : undefined, 
    wantItemIds: wantIds.length ? wantIds : undefined, 
    dmgGt: search.dmgGt ? Number(search.dmgGt) : undefined,
    dmgLt: search.dmgLt ? Number(search.dmgLt) : undefined,
    normalGt: search.normalGt ? Number(search.normalGt) : undefined,
    normalLt: search.normalLt ? Number(search.normalLt) : undefined,
    limit: 20, 
    offset: 0 
  })
}


export default async function TradingListPage({ searchParams }: { searchParams: Promise<{ have?: string; want?: string; tradeId?: string; dmgGt?: string; dmgLt?: string; normalGt?: string; normalLt?: string }> }) {
  const sp = await searchParams
  const trades = await fetchTrades(sp || {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 页面头部区域 */}
      <div className="bg-gradient-to-r from-blue-900/20 via-slate-800/40 to-purple-900/20 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Plants vs Brainrots Trading
            </h1>
            <p className="text-xl text-slate-300 mb-2 font-medium">
              Professional Plants & Brainrots Exchange Platform
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Trade globally with trusted players — fast, secure, and reliable for your collection.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <PublishTradeButton />
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-2xl p-8">
          <TradingPageClient initialTrades={trades} />
        </div>
      </div>
    </div>
  )
}


