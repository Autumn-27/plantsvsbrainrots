/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { TradeDetailButton } from './TradeDetailButton'
import type { PvbTradeDTO } from './types/item'
import plantsData from './data/plants.json'
import brainrotsData from './data/brainrots.json'
import ImageWithFallback from '@/components/ImageWithFallback'

function getItemName(category: 'plant' | 'brainrot', slugOrId: string): string {
  // 根据 slug 查询 name；若找不到再回退按 id
  const key = String(slugOrId).toLowerCase()
  if (category === 'plant') {
    const f = (plantsData as any[]).find(p => String(p.slug ?? '').toLowerCase() === key) ||
              (plantsData as any[]).find(p => String(p.id ?? '').toLowerCase() === key)
    return f?.name || slugOrId
  }
  const f = (brainrotsData as any[]).find(c => String(c.slug ?? '').toLowerCase() === key) ||
            (brainrotsData as any[]).find(c => String(c.id ?? '').toLowerCase() === key)
  return f?.name || slugOrId
}

function imageUrl(category: 'plant' | 'brainrot', id: string) {
  const dir = category === 'plant' ? 'plants' : 'brainrots'
  return `/${dir}/${id}.webp`
}

function getRelativeTime(iso: string) {
  const normalizeToUTC = (s: string) => {
    // 如果字符串不包含时区信息，按 UTC 处理
    if (/Z|[+-]\d{2}:?\d{2}$/.test(s)) return s
    return s + 'Z'
  }
  const now = Date.now()
  const then = new Date(normalizeToUTC(iso)).getTime()
  const diff = Math.max(0, Math.floor((now - then) / 1000))
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

function TradeItemCard({ item }: { item: any }) {
  const keyRaw = item?.item_id ?? item?.plantSlug ?? item?.brainrotSlug ?? ''
  const id = String(keyRaw)
  const name = id ? getItemName(item.category, id) : 'Unknown'
  const url = imageUrl(item.category, id || '__missing__')
  const mutationsArr = (item.mutations ? String(item.mutations).split(',').map((m: string) => m.trim()).filter(Boolean) : []) as string[]
  return (
    <div className="relative group bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-slate-600/50 rounded-xl p-3 sm:p-4 hover:from-slate-600/80 hover:to-slate-700/80 transition-all duration-200 hover:scale-[1.02] hover:z-10 w-28 md:w-32 flex flex-col overflow-visible shadow-lg hover:shadow-xl">
      {item.quantity > 1 && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border border-blue-500/30">{item.quantity}</div>
      )}
      <div className="flex justify-center mb-2 flex-shrink-0">
        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-inner">
          <ImageWithFallback src={url} alt={name} width={80} height={80} className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
      <div className="space-y-1 flex-grow min-h-0">
        <div className="text-center">
          <div className="text-white font-semibold text-xs sm:text-sm truncate px-1">{name}</div>
          <div className={"text-[10px] sm:text-xs whitespace-nowrap font-medium " + (item.category === 'brainrot' ? 'text-purple-300' : 'text-green-300')}>{item.category === 'brainrot' ? 'Brainrot' : 'Plant'}</div>
        </div>
        <div className="text-center flex justify-center space-x-1 text-[10px] text-slate-400 font-medium">
        {item.weight != null && <span>{item.weight} {item.category === 'plant' ? 'Size' : 'kg'}</span>}
          {item.category === 'plant' && item.damage != null && <span>DMG {item.damage}</span>}
          {item.category === 'brainrot' && item.normal != null && <span>Normal {item.normal}</span>}
        </div>
        {mutationsArr.length > 0 && (
          <div className="text-center text-[10px] text-slate-400 mt-1">
            <span className="relative inline-flex items-center group/mutation">
              {mutationsArr.length} mutation
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden group-hover/mutation:block whitespace-normal max-w-[220px] px-3 py-2 text-[10px] rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl pointer-events-none">
                {mutationsArr.join(', ')}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function TradeCard({ trade, onOpenModal }: { trade: PvbTradeDTO; onOpenModal: (trade: PvbTradeDTO) => void }) {
  const maxItemsToShow = 6

  return (
    <>
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-slate-500/70 group">
      <div className="p-8 relative">
        <div className="mb-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              {trade.user?.image ? (
                <img src={trade.user.image} alt={trade.user?.username || 'user'} className="w-14 h-14 rounded-full object-cover border-3 border-slate-500/50 shadow-lg" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-3 border-slate-500/50 shadow-lg" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <h3 className="text-white font-bold text-xl">{trade.user?.username || 'Unknown User'}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400 font-mono">#{trade.id}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-lg w-fit ${
                      trade.status === 'completed' 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-green-100 border border-green-500/30' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-blue-100 border border-blue-500/30'
                    }`}>
                      {trade.status === 'completed' ? 'Completed' : 'Ongoing'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm min-w-0">
                <span className="text-slate-400 whitespace-nowrap font-medium">{getRelativeTime(trade.created_at)}</span>
                {trade.remark ? (
                  <span className="text-slate-300 truncate max-w-[400px]">• {trade.remark}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:absolute sm:top-8 sm:right-8 flex gap-3">
            {trade.user?.profile_url && (
              <a
                href={trade.user.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Trade
              </a>
            )}
            <TradeDetailButton trade={trade} onOpen={onOpenModal} />
          </div>
        </div>
        <div className="border-t border-slate-600/50 mb-6" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"></div>
              <h4 className="text-red-400 font-bold text-base uppercase tracking-wide">Have ({trade.have.length})</h4>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
              {trade.have.slice(0, maxItemsToShow).map((item: any, index: number) => (
                <TradeItemCard key={`h-${trade.id}-${item.item_id}-${index}`} item={item} />
              ))}
              {trade.have.length > maxItemsToShow && (
                <div className="w-28 h-12 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-center text-slate-300 text-sm font-semibold">+{trade.have.length - maxItemsToShow}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg"></div>
              <h4 className="text-green-400 font-bold text-base uppercase tracking-wide">Want ({trade.want.length})</h4>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
              {trade.want.slice(0, maxItemsToShow).map((item: any, index: number) => (
                <TradeItemCard key={`w-${trade.id}-${item.item_id}-${index}`} item={item} />
              ))}
              {trade.want.length > maxItemsToShow && (
                <div className="w-28 h-12 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-center text-slate-300 text-sm font-semibold">+{trade.want.length - maxItemsToShow}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
