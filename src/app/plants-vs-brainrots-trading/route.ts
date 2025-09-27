import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectUrl = new URL('/trading', url.origin);
  
  // 保留查询参数
  if (url.search) {
    redirectUrl.search = url.search;
  }
  
  return NextResponse.redirect(redirectUrl, 301);
}
