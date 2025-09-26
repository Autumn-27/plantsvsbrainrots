'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import plantsData from './data/plants.json'
import brainrotsData from './data/brainrots.json'

function getItemName(category: 'plant' | 'brainrot', id: string): string {
  if (category === 'plant') {
    const f = (plantsData as any[]).find((p: any) => String(p.slug).toLowerCase() === id.toLowerCase())
    return f?.name || id
  }
  const f = (brainrotsData as any[]).find((c: any) => String(c.slug).toLowerCase() === id.toLowerCase())
  return f?.name || id
}

function imageUrl(category: 'plant' | 'brainrot', id: string) {
  const dir = category === 'plant' ? 'plants' : 'brainrots'
  return `/images/plantsvsbrainrots/${dir}/${id}.webp`
}

function TradeItemCard({ item, isLastRow = false }: { item: any; isLastRow?: boolean }) {
  const id = String(item.item_id)
  const name = getItemName(item.category, id)
  const url = imageUrl(item.category, id)
  const mutationsArr = (item.mutations ? String(item.mutations).split(',').map((m: string) => m.trim()).filter(Boolean) : []) as string[]
  return (
    <div className="relative group bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-slate-600/50 rounded-xl p-3 flex flex-col min-w-0 hover:from-slate-600/80 hover:to-slate-700/80 transition-all duration-200 hover:scale-105 hover:z-20 overflow-visible shadow-lg hover:shadow-xl">
      {item.quantity > 1 && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.quantity}</div>
      )}
      <div className="flex justify-center mb-2">
        <div className="w-16 h-16 flex items-center justify-center">
        <ImageWithFallback src={url} alt={name} width={80} height={80} className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
      <div className="text-center">
        <div className="text-white font-medium text-sm truncate px-1">{name}</div>
        <div className={"text-[11px] " + (item.category === 'brainrot' ? 'text-purple-400' : 'text-green-400')}>{item.category === 'brainrot' ? 'Brainrot' : 'Plant'}</div>
      </div>
      <div className="mt-1 text-center text-[11px] text-gray-400">
        {item.category === 'plant' && item.weight != null && <span>{item.weight} kg</span>}
        {item.category === 'plant' && item.damage != null && <span className="ml-1">DMG {item.damage}</span>}
        {item.category === 'brainrot' && item.normal != null && <span className="ml-1">Normal {item.normal}</span>}
      </div>
      {mutationsArr.length > 0 && (
        <div className="mt-1 text-center text-[11px] text-gray-400">
          <span className="relative inline-flex items-center cursor-help group/mutation">
            {mutationsArr.length} mutation
            <span className={`absolute left-1/2 -translate-x-1/2 z-50 hidden group-hover/mutation:block whitespace-normal max-w-[220px] px-2 py-1 text-[10px] rounded bg-gray-900 text-gray-100 border border-gray-700 shadow-lg pointer-events-none ${
              isLastRow ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}>
              {mutationsArr.join(', ')}
</span>
          </span>
        </div>
      )}
    </div>
  )
}

// 按钮组件 - 只负责触发弹窗
import type { PvbTradeDTO } from './types/item'
import ImageWithFallback from '@/components/ImageWithFallback'

export function TradeDetailButton({ trade, onOpen }: { trade: PvbTradeDTO; onOpen: (trade: PvbTradeDTO) => void }) {
  return (
    <button
      onClick={() => onOpen(trade)}
      className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 text-slate-300 rounded-xl hover:from-slate-600 hover:to-slate-700 hover:text-white transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>Detail</span>
    </button>
  )
}

// 全局弹窗组件
export function TradeDetailModal({ trade, open, onClose }: { trade: PvbTradeDTO | null; open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !open || !trade) return null

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-600/50">
          <h2 className="text-xl font-bold text-white">Trade Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1E293B'
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {trade.user?.image ? (
                <img src={trade.user.image} alt={trade.user?.username || 'user'} className="w-14 h-14 rounded-full object-cover border-3 border-slate-500/50 shadow-lg" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-3 border-slate-500/50 shadow-lg" />
              )}
              <div>
                <div className="text-white font-bold text-xl">{trade.user?.username || 'Unknown user'}</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 font-mono">#{trade.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-lg ${
                    trade.status === 'completed' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-green-100 border border-green-500/30' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-blue-100 border border-blue-500/30'
                  }`}>
                    {trade.status === 'completed' ? 'Completed' : 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
            {trade.user?.profile_url && (
              <a
                href={trade.user.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Trade
              </a>
            )}
          </div>
          {trade.remark && (
            <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm whitespace-pre-wrap break-words">{trade.remark}</div>
          )}
          <div className="space-y-6 pb-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <h4 className="text-red-400 font-bold text-sm">Have ({trade.have.length})</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {trade.have.map((item: any, idx: number) => {
                  const totalItems = trade.have.length
                  const cols = 5 // lg:grid-cols-5
                  const isLastRow = idx >= totalItems - (totalItems % cols || cols)
                  return (
                    <TradeItemCard key={`dh-${trade.id}-${idx}`} item={item} isLastRow={isLastRow} />
                  )
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h4 className="text-green-400 font-bold text-sm">Want ({trade.want.length})</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {trade.want.map((item: any, idx: number) => {
                  const totalItems = trade.want.length
                  const cols = 5 // lg:grid-cols-5
                  const isLastRow = idx >= totalItems - (totalItems % cols || cols)
                  return (
                    <TradeItemCard key={`dw-${trade.id}-${idx}`} item={item} isLastRow={isLastRow} />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


