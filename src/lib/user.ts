// 客户端用户信息管理工具

export interface UserInfo {
  id: string
  username: string
  name: string
  image?: string
  profile_url?: string
}

export function getUserInfo(): UserInfo | null {
  if (typeof window === 'undefined') return null
  
  try {
    // 首先尝试从 cookie 读取
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='))
      ?.split('=')[1]
    
    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue))
    }
    
    // 如果 cookie 不存在，尝试从 localStorage 读取
    const stored = localStorage.getItem('user_info')
    if (stored) {
      return JSON.parse(stored)
    }
    
    return null
  } catch (error) {
    console.error('Failed to get user info:', error)
    return null
  }
}

export function setUserInfo(userInfo: UserInfo): void {
  if (typeof window === 'undefined') return
  
  try {
    // 存储到 localStorage 作为备份
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  } catch (error) {
    console.error('Failed to set user info:', error)
  }
}

export function clearUserInfo(): void {
  if (typeof window === 'undefined') return
  
  try {
    // 清除 localStorage
    localStorage.removeItem('user_info')
    
    // 清除 cookie（通过设置过期时间）
    document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  } catch (error) {
    console.error('Failed to clear user info:', error)
  }
}

export function hasUserInfo(): boolean {
  return getUserInfo() !== null
}
