'use client'

import { useRouter } from 'next/navigation'
import { hasUserInfo } from '@/lib/user'

export default function PublishTradeButton() {
  const router = useRouter()

  const handleClick = () => {
    // 检查本地是否有用户信息
    if (!hasUserInfo()) {
      window.location.href = '/api/oauth/roblox/login'
      return
    }
    
    router.push('/trading/new')
  }

  return (
    <button onClick={handleClick} className="px-2 sm:px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 text-sm sm:text-base">
      <span className="hidden sm:inline">Create Trade</span>
      <span className="sm:hidden">Create Trade</span>
    </button>
  )
}


