import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this-in-production')
const alg = 'HS256'

export interface UserSession {
  id: string
  username: string
  name: string
  image?: string
  profile_url?: string
  iat: number
  exp: number
}

export async function createSession(user: { 
  id: string
  username: string
  name: string
  image?: string
  profile_url?: string
}) {
  const session = await new SignJWT({
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    profile_url: user.profile_url,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d') // 7天过期
    .sign(secret)

  return session
}

export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [alg],
    })
    
    return payload as unknown as UserSession
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value
    
    if (!token) {
      return null
    }
    
    return await verifySession(token)
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

export async function setSessionCookie(session: string) {
  const cookieStore = await cookies()
  cookieStore.set('session_token', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')
}