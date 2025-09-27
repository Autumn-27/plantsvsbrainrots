'use client'

import { useState, useEffect } from 'react'

interface AutoRefreshSettingsProps {
  onRefresh: () => void
}

export default function AutoRefreshSettings({ onRefresh }: AutoRefreshSettingsProps) {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(300) // 默认300秒
  const [showSettings, setShowSettings] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // 自动刷新逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isAutoRefresh && refreshInterval > 0) {
      setTimeLeft(refreshInterval)
      
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onRefresh()
            return refreshInterval
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoRefresh, refreshInterval, onRefresh])

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value)
    if (newInterval >= 30 && newInterval <= 3600) { // 限制在30秒到1小时之间
      setRefreshInterval(newInterval)
      if (isAutoRefresh) {
        setTimeLeft(newInterval)
      }
    }
  }

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh)
    if (!isAutoRefresh) {
      setTimeLeft(refreshInterval)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm hover:bg-gray-700 transition-colors"
        title="Auto Refresh Settings"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        {isAutoRefresh && (
          <div className="flex items-center space-x-1 text-xs text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </button>

      {showSettings && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-xl shadow-2xl"
          style={{ zIndex: 999996 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Auto Refresh Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Auto Refresh Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Enable Auto Refresh</label>
                <button
                  onClick={toggleAutoRefresh}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAutoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAutoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Refresh Interval */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Refresh Interval (seconds)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="30"
                    max="3600"
                    value={refreshInterval}
                    onChange={(e) => handleIntervalChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:border-blue-500"
                    disabled={isAutoRefresh}
                  />
                  <span className="text-xs text-gray-400">30s - 1h</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '1m', value: 60 },
                    { label: '5m', value: 300 },
                    { label: '10m', value: 600 },
                    { label: '15m', value: 900 },
                    { label: '30m', value: 1800 },
                    { label: '1h', value: 3600 }
                  ].map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => handleIntervalChange(preset.value.toString())}
                      disabled={isAutoRefresh}
                      className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              {isAutoRefresh && (
                <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-md">
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Auto refresh active - Next refresh in {formatTime(timeLeft)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
