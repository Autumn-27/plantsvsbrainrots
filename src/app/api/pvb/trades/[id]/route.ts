export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { pvbDeleteTrade, pvbGetTradeById, pvbUpdateTradeStatus } from '@/lib/pvb/d1'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

    const body = await req.json()
    const status = String(body?.status) === 'completed' ? 'completed' : 'ongoing'

    // ownership check
    const trade = await pvbGetTradeById(id)
    if (!trade || trade.user?.id !== user.id) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    await pvbUpdateTradeStatus(id, status)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

    // ownership check
    const trade = await pvbGetTradeById(id)
    if (!trade || trade.user?.id !== user.id) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    await pvbDeleteTrade(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}


