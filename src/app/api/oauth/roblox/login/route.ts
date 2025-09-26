import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const clientId = process.env.ROBLOX_CLIENT_ID as string;
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const redirectUri = new URL('/redirect', baseUrl).toString();
  const state = Math.random().toString(36).slice(2);

  const authorizeUrl = new URL('https://apis.roblox.com/oauth/v1/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'openid profile');
  authorizeUrl.searchParams.set('state', state);

  const res = NextResponse.redirect(authorizeUrl.toString());
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 300,
  });
  return res;
}


