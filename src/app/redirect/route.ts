import { NextRequest, NextResponse } from 'next/server';
import { upsertUser } from '@/lib/d1';
import { createSession } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = req.cookies.get('oauth_state')?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/api/auth/error', url.origin));
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = new URL('/redirect', baseUrl).toString();

  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  body.set('client_id', process.env.ROBLOX_CLIENT_ID as string);
  body.set('client_secret', process.env.ROBLOX_CLIENT_SECRET as string);

  const tokenRes = await fetch('https://apis.roblox.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/api/auth/error', url.origin));
  }

  const tokenJson: any = await tokenRes.json();

  const userRes = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL('/api/auth/error', url.origin));
  }

  const profile: any = await userRes.json();

  // 尝试将用户写入数据库（D1）
  try {
    await upsertUser({
      id: String(profile.sub),
      name: profile.name ?? profile.preferred_username ?? null,
      image: profile.picture ?? null,
      provider: 'roblox',
      username: profile.preferred_username ?? null,
      nickname: profile.nickname ?? null,
      profileUrl: profile.profile ?? null,
      robloxCreatedAt: profile.created_at ? new Date(profile.created_at * 1000).toISOString() : null,
    });
  } catch (e) {
    // 忽略落库失败，仍继续设置会话
    console.error('upsertUser failed', e);
    return NextResponse.redirect(new URL('/api/auth/error', url.origin));
  }

  // 创建 JWT 会话
  const session = await createSession({
    id: String(profile.sub),
    username: profile.preferred_username ?? profile.name ?? 'Roblox User',
    name: profile.name ?? 'Roblox User',
    image: profile.picture ?? null,
    profile_url: profile.profile ?? null,
  });

  // 创建用户信息对象
  const userInfo = {
    id: String(profile.sub),
    username: profile.preferred_username ?? profile.name ?? 'Roblox User',
    name: profile.name ?? 'Roblox User',
    image: profile.picture ?? null,
    profile_url: profile.profile ?? null,
  };

  const res = NextResponse.redirect(new URL('/account', url.origin));
  
  // 设置安全的 JWT 会话 cookie
  res.cookies.set('session_token', session, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 7天
  });
  
  // 设置用户信息到 cookie（供客户端读取）
  res.cookies.set('user_info', JSON.stringify(userInfo), {
    httpOnly: false, // 允许客户端读取
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 7天
  });
  
  // 删除旧的 session_user cookie（如果存在）
  res.cookies.delete('session_user');
  res.cookies.delete('oauth_state');
  return res;
}
