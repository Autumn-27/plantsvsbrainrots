import { Metadata } from 'next'
import StockPageClient from './StockPageClient'

export const metadata: Metadata = {
  title: 'Live Stock Tracker',
  description: 'Real-time stock tracking for Plants vs Brainrots seeds and gears. Monitor availability and get instant updates.',
}

export default function StockPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 页面头部区域 */}
      <div className="bg-gradient-to-r from-blue-900/20 via-slate-800/40 to-purple-900/20 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent mb-4">
            Plants vs Brainrots Stock Live Tracker
            </h1>
            <p className="text-xl text-slate-300 mb-2 font-medium">
              Real-time  Plants vs Brainrots Stock Live Tracker
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Track seed and gear availability with live updates every 5 minutes. Never miss out on restocks again.
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <StockPageClient />
      </div>
    </div>
  )
}
