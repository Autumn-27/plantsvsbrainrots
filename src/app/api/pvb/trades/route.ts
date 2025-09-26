export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { pvbCreateTrade, pvbGetTradeById, pvbListTrades, PvbTradeItemCategory } from '@/lib/pvb/d1'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const tradeId = url.searchParams.get('tradeId')
    const have = (url.searchParams.get('have') || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    const want = (url.searchParams.get('want') || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20', 10), 1), 10)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1)
    const offset = (page - 1) * limit
    const dmgGt = url.searchParams.get('dmgGt')
    const dmgLt = url.searchParams.get('dmgLt')
    const normalGt = url.searchParams.get('normalGt')
    const normalLt = url.searchParams.get('normalLt')
    const mine = url.searchParams.get('mine')

    if (tradeId) {
      const trade = await pvbGetTradeById(parseInt(tradeId, 10))
      return NextResponse.json(trade ? [trade] : [])
    }

    let userId: string | undefined = undefined
    if (mine === '1') {
      const me = await getCurrentUser().catch(() => null)
      userId = me?.id
      if (!userId) {
        return NextResponse.json([], { status: 200 })
      }
    }

    const items = await pvbListTrades({ 
      haveItemIds: have.length ? have : undefined, 
      wantItemIds: want.length ? want : undefined, 
      limit, 
      offset,
      userId,
      dmgGt: dmgGt ? Number(dmgGt) : undefined,
      dmgLt: dmgLt ? Number(dmgLt) : undefined,
      normalGt: normalGt ? Number(normalGt) : undefined,
      normalLt: normalLt ? Number(normalLt) : undefined,
    })
    return NextResponse.json(items)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const userId = user.id

    const body = (await req.json()) as Record<string, unknown>
    const remark: string | null = body.remark ? String(body.remark).slice(0, 200) : null
    const have = Array.isArray(body?.have) ? body.have : []
    const want = Array.isArray(body?.want) ? body.want : []

    if (!have.length || !want.length) return NextResponse.json({ error: 'need at least one have and one want' }, { status: 400 })
    if (have.length > 10 || want.length > 10) return NextResponse.json({ error: 'item limit exceeded' }, { status: 400 })

    const normalizeItem = (it: Record<string, unknown>) => {
      const category: PvbTradeItemCategory = it?.category === 'brainrot' ? 'brainrot' : 'plant'
      const item_id = typeof it?.item_id === 'string' ? it.item_id : String(it?.item_id ?? '')
      const mutations = it?.mutations != null ? String(it.mutations) : null
      return {
        category,
        item_id,
        quantity: Math.max(1, Number(it?.quantity) || 1),
        damage: it?.damage != null && it?.damage !== '' ? Number(it.damage) : null,
        weight: it?.weight != null && it?.weight !== '' ? Number(it.weight) : null,
        normal: it?.normal != null && it?.normal !== '' ? Number(it.normal) : null,
        mutations,
      }
    }

    const haveN = have.map(normalizeItem).filter((x) => x.item_id)
    const wantN = want.map(normalizeItem).filter((x) => x.item_id)
    if (!haveN.length || !wantN.length) return NextResponse.json({ error: 'invalid items' }, { status: 400 })

    const { tradeId } = await pvbCreateTrade({ userId, remark, have: haveN, want: wantN })
    return NextResponse.json({ success: true, trade_id: tradeId })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'internal error' }, { status: 500 })
  }
}


