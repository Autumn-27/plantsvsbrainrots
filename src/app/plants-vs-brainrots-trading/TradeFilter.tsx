'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import plantsData from './data/plants.json'
import brainrotsData from './data/brainrots.json'
import ImageWithFallback from '@/components/ImageWithFallback'

function getItemName(category: 'plant' | 'brainrot', id: string): string {
  if (category === 'plant') {
    const f = (plantsData as any[]).find(p => String(p.id).toLowerCase() === id.toLowerCase())
    return f?.name || id
  }
  const f = (brainrotsData as any[]).find(c => String(c.id).toLowerCase() === id.toLowerCase())
  return f?.name || id
}

function imageUrl(category: 'plant' | 'brainrot', id: string) {
  const dir = category === 'plant' ? 'plants' : 'brainrots'
  return `/${dir}/${id}.webp`
}

export default function TradeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [haveItems, setHaveItems] = useState<string[]>([])
  const [wantItems, setWantItems] = useState<string[]>([])
  const [showHaveModal, setShowHaveModal] = useState(false)
  const [showWantModal, setShowWantModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'plant' | 'brainrot'>('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize from URL params
  useEffect(() => {
    const have = searchParams.get('have')?.split(',').filter(Boolean) || []
    const want = searchParams.get('want')?.split(',').filter(Boolean) || []
    setHaveItems(have)
    setWantItems(want)
  }, [searchParams])

  const updateURL = (have: string[], want: string[]) => {
    const params = new URLSearchParams()
    
    // Preserve existing tradeId param
    const tradeId = searchParams.get('tradeId')
    if (tradeId) params.set('tradeId', tradeId)
    
    // Add filter params
    if (have.length > 0) params.set('have', have.join(','))
    if (want.length > 0) params.set('want', want.join(','))
    
    router.push(`?${params.toString()}`)
  }

  const handleHaveItemToggle = (itemId: string) => {
    const newHave = haveItems.includes(itemId)
      ? haveItems.filter(id => id !== itemId)
      : [...haveItems, itemId]
    setHaveItems(newHave)
    updateURL(newHave, wantItems)
  }

  const handleWantItemToggle = (itemId: string) => {
    const newWant = wantItems.includes(itemId)
      ? wantItems.filter(id => id !== itemId)
      : [...wantItems, itemId]
    setWantItems(newWant)
    updateURL(haveItems, newWant)
  }

  const clearFilters = () => {
    setHaveItems([])
    setWantItems([])
    updateURL([], [])
  }

  // Get filtered items for display
  const getFilteredItems = () => {
    let items: Array<{ id: string; category: 'plant' | 'brainrot'; name: string; image: string }> = []
    
    if (selectedCategory === 'all' || selectedCategory === 'plant') {
      items = [...items, ...(plantsData as any[]).map((p: any) => ({
        id: String(p.slug),
        category: 'plant' as const,
        name: p.name,
        image: imageUrl('plant', String(p.slug))
      }))]
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'brainrot') {
      items = [...items, ...(brainrotsData as any[]).map((c: any) => ({
        id: String(c.slug),
        category: 'brainrot' as const,
        name: c.name,
        image: imageUrl('brainrot', String(c.slug))
      }))]
    }

    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return items
  }

  const filteredItems = getFilteredItems()

  const hasActiveFilters = haveItems.length > 0 || wantItems.length > 0

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl mb-6">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white">Filter Trades</h2>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                {haveItems.length + wantItems.length} filters
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFilters()
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span className="text-red-400">Have: {haveItems.length}</span>
              <span>•</span>
              <span className="text-green-400">Want: {wantItems.length}</span>
            </div>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* I Have Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-400">I Have</h3>
                <span className="text-xs text-gray-500">{haveItems.length} selected</span>
              </div>
              <div className="space-y-1">
                {haveItems.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {haveItems.map(itemId => {
                      const isPlant = (plantsData as any[]).some((p: any) => String(p.id) === itemId)
                      const category = isPlant ? 'plant' : 'brainrot'
                      const name = getItemName(category, itemId)
                      const image = imageUrl(category, itemId)
                      
                      return (
                        <div key={itemId} className="flex items-center bg-gray-700 rounded-md px-2 py-1 text-xs">
                          <span className="text-white truncate max-w-[80px]">{name}</span>
                          <button
                            onClick={() => handleHaveItemToggle(itemId)}
                            className="text-gray-400 hover:text-red-400 ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                <button
                  onClick={() => setShowHaveModal(true)}
                  className="w-full border border-dashed border-gray-600 rounded-md py-2 text-xs text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  + Add items
                </button>
              </div>
            </div>

            {/* I Want Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-green-400">I Want</h3>
                <span className="text-xs text-gray-500">{wantItems.length} selected</span>
              </div>
              <div className="space-y-1">
                {wantItems.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {wantItems.map(itemId => {
                      const isPlant = (plantsData as any[]).some((p: any) => String(p.id) === itemId)
                      const category = isPlant ? 'plant' : 'brainrot'
                      const name = getItemName(category, itemId)
                      const image = imageUrl(category, itemId)
                      
                      return (
                        <div key={itemId} className="flex items-center bg-gray-700 rounded-md px-2 py-1 text-xs">
                          <span className="text-white truncate max-w-[80px]">{name}</span>
                          <button
                            onClick={() => handleWantItemToggle(itemId)}
                            className="text-gray-400 hover:text-red-400 ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                <button
                  onClick={() => setShowWantModal(true)}
                  className="w-full border border-dashed border-gray-600 rounded-md py-2 text-xs text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  + Add items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Selection Modal */}
      {mounted && (showHaveModal || showWantModal) && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50"
          onClick={() => {
            setShowHaveModal(false)
            setShowWantModal(false)
            setSearchTerm('')
            setSelectedCategory('all')
          }}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-slate-600/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">
                Select {showHaveModal ? 'I Have' : 'I Want'} Items
              </h3>
              <button
                onClick={() => {
                  setShowHaveModal(false)
                  setShowWantModal(false)
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedCategory('plant')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === 'plant' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Plants
                  </button>
                  <button
                    onClick={() => setSelectedCategory('brainrot')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === 'brainrot' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Brainrots
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-400" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#64748b #1e293b'
            }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredItems.map((item, index) => {
                  const isSelected = showHaveModal 
                    ? haveItems.includes(item.id)
                    : wantItems.includes(item.id)
                  
                  return (
                    <button
                      key={`${item.category}-${item.id}-${index}`}
                      onClick={() => {
                        if (showHaveModal) {
                          handleHaveItemToggle(item.id)
                        } else {
                          handleWantItemToggle(item.id)
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <ImageWithFallback src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover rounded-lg" />
                        <div className="text-center">
                          <div className="text-white text-xs font-medium truncate w-full">{item.name}</div>
                      <div className={`text-[10px] px-1 py-0.5 rounded-full mt-1 ${
                            item.category === 'brainrot' ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'
                          }`}>
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
