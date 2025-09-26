export const runtime = 'edge'

import { getRequestContext } from '@cloudflare/next-on-pages'

// ===== PVB Trading Types =====
export type PvbTradeItemRole = 'have' | 'want'
export type PvbTradeItemCategory = 'plant' | 'brainrot'

export type PvbTrade = {
  id: number
  user_id: string
  remark: string | null
  status?: 'ongoing' | 'completed'
  created_at: string
}

export type PvbTradeItem = {
  id: number
  trade_id: number
  role: PvbTradeItemRole
  category: PvbTradeItemCategory
  item_id: string
  quantity: number
  // fields specific to plants vs brainrots
  damage: number | null
  weight: number | null
  normal: number | null
  mutations: string | null // comma separated (Gold,Diamond,Neon,Frozen)
}

export type PvbTradeUser = {
  id: string
  username: string | null
  image: string | null
  profile_url: string | null
}

export type PvbTradeItemPayload = {
  category: PvbTradeItemCategory
  item_id: string
  quantity?: number
  // plant
  damage?: number | null
  weight?: number | null
  // brainrot
  normal?: number | null
  // common
  mutations?: string | null
}

export type PvbTradeDTO = {
  id: number
  user: PvbTradeUser | null
  remark: string | null
  status?: 'ongoing' | 'completed'
  created_at: string
  have: Omit<PvbTradeItem, 'role'>[]
  want: Omit<PvbTradeItem, 'role'>[]
}

// ===== Core Helpers =====
function getDB() {
  const env = getRequestContext().env as { DB: D1Database }
  const db = env?.DB as D1Database
  if (!db) throw new Error('D1 binding DB not found')
  return db
}

// ===== Create Trade =====
export async function pvbCreateTrade(params: { userId: string; remark?: string | null; have: PvbTradeItemPayload[]; want: PvbTradeItemPayload[] }) {
  const db = getDB()

  if (!params.have?.length || !params.want?.length) throw new Error('at least one have and one want')
  if (params.have.length > 10 || params.want.length > 10) throw new Error('item limit exceeded')

  const insertTrade = await db
    .prepare(`INSERT INTO pvb_trades (user_id, remark, status) VALUES (?, ?, ?)`)
    .bind(params.userId, params.remark ?? null, 'ongoing')
    .run()
  if (!insertTrade.success) throw new Error('failed to insert pvb trade')

  const idRow = await db.prepare('SELECT last_insert_rowid() as id').first<{ id: number }>()
  const tradeId = idRow?.id as number

  const insertItemStmt = db.prepare(
    `INSERT INTO pvb_trade_items (trade_id, role, category, item_id, quantity, damage, weight, normal, mutations)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insertOne = async (role: PvbTradeItemRole, it: PvbTradeItemPayload) => {
    const quantity = it.quantity && it.quantity > 0 ? it.quantity : 1
    await insertItemStmt
      .bind(
        tradeId,
        role,
        it.category,
        it.item_id,
        quantity,
        it.damage ?? null,
        it.weight ?? null,
        it.normal ?? null,
        it.mutations ?? null,
      )
      .run()
  }

  for (const it of params.have) await insertOne('have', it)
  for (const it of params.want) await insertOne('want', it)

  return { tradeId } as const
}

// ===== Get Trade By Id =====
export async function pvbGetTradeById(id: number): Promise<PvbTradeDTO | null> {
  const db = getDB()

  const trade = await db
    .prepare(`SELECT t.id, t.user_id, t.remark, t.status, t.created_at, u.username, u.image, u.profile_url
              FROM pvb_trades t
              LEFT JOIN users u ON u.id = t.user_id
              WHERE t.id = ?`)
    .bind(id)
    .first<{ id: number; user_id: string; remark: string | null; status: 'ongoing' | 'completed'; created_at: string; username: string | null; image: string | null; profile_url: string | null }>()
  if (!trade) return null

  const items = (await db
    .prepare(`SELECT id, trade_id, role, category, item_id, quantity, damage, weight, normal, mutations FROM pvb_trade_items WHERE trade_id = ?`)
    .bind(id)
    .all<PvbTradeItem>()).results || []

  const have = items.filter(i => i.role === 'have').map(({ role, ...rest }) => rest)
  const want = items.filter(i => i.role === 'want').map(({ role, ...rest }) => rest)

  return {
    id: trade.id,
    user: { id: trade.user_id, username: trade.username, image: trade.image, profile_url: trade.profile_url },
    remark: trade.remark,
    status: trade.status,
    created_at: trade.created_at,
    have,
    want,
  }
}

// ===== List Trades with filters =====
export async function pvbListTrades(opts?: { haveItemIds?: string[]; wantItemIds?: string[]; userId?: string; limit?: number; offset?: number; dmgGt?: number; dmgLt?: number; normalGt?: number; normalLt?: number }): Promise<PvbTradeDTO[]> {
  const db = getDB()
  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 100)
  const offset = Math.max(opts?.offset ?? 0, 0)

  const where: string[] = []
  const params: any[] = []

  if (opts?.haveItemIds?.length) {
    const placeholders = opts.haveItemIds.map(() => '?').join(',')
    where.push(`t.id IN (SELECT DISTINCT trade_id FROM pvb_trade_items WHERE role = 'want' AND item_id IN (${placeholders}))`)
    params.push(...opts.haveItemIds)
  }
  if (opts?.wantItemIds?.length) {
    const placeholders = opts.wantItemIds.map(() => '?').join(',')
    where.push(`t.id IN (SELECT DISTINCT trade_id FROM pvb_trade_items WHERE role = 'have' AND item_id IN (${placeholders}))`)
    params.push(...opts.wantItemIds)
  }
  if (opts?.userId) {
    where.push('t.user_id = ?')
    params.push(opts.userId)
  }

  // Damage filters (plants only)
  if (typeof opts?.dmgGt === 'number' && !Number.isNaN(opts.dmgGt)) {
    where.push(`t.id IN (SELECT trade_id FROM pvb_trade_items WHERE category = 'plant' AND damage > ?)`)
    params.push(opts.dmgGt)
  }
  if (typeof opts?.dmgLt === 'number' && !Number.isNaN(opts.dmgLt)) {
    where.push(`t.id IN (SELECT trade_id FROM pvb_trade_items WHERE category = 'plant' AND damage < ?)`)
    params.push(opts.dmgLt)
  }

  // Normal filters (brainrots only)
  if (typeof opts?.normalGt === 'number' && !Number.isNaN(opts.normalGt)) {
    where.push(`t.id IN (SELECT trade_id FROM pvb_trade_items WHERE category = 'brainrot' AND normal > ?)`)
    params.push(opts.normalGt)
  }
  if (typeof opts?.normalLt === 'number' && !Number.isNaN(opts.normalLt)) {
    where.push(`t.id IN (SELECT trade_id FROM pvb_trade_items WHERE category = 'brainrot' AND normal < ?)`)
    params.push(opts.normalLt)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  // Debug: print SQL and params for diagnostics
  try {
    console.log('[pvbListTrades] where=', whereClause, 'params=', params, 'limit=', limit, 'offset=', offset)
  } catch {}

  const rows = (await db
    .prepare(`SELECT t.id, t.user_id, t.remark, t.status, t.created_at, u.username, u.image, u.profile_url
              FROM pvb_trades t
              LEFT JOIN users u ON u.id = t.user_id
              ${whereClause}
              ORDER BY t.id DESC
              LIMIT ? OFFSET ?`)
    .bind(...params, limit, offset)
    .all<{ id: number; user_id: string; remark: string | null; status: 'ongoing' | 'completed'; created_at: string; username: string | null; image: string | null; profile_url: string | null }>()).results || []

  if (!rows.length) return []

  const ids = rows.map(r => r.id)
  const placeholders = ids.map(() => '?').join(',')
  const itemsAll = (await db
    .prepare(`SELECT id, trade_id, role, category, item_id, quantity, damage, weight, normal, mutations FROM pvb_trade_items WHERE trade_id IN (${placeholders})`)
    .bind(...ids)
    .all<PvbTradeItem>()).results || []

  const byTrade: Record<number, PvbTradeItem[]> = {}
  for (const it of itemsAll) (byTrade[it.trade_id] ||= []).push(it)

  return rows.map(r => {
    const items = byTrade[r.id] || []
    const have = items.filter(i => i.role === 'have').map(({ role, ...rest }) => rest)
    const want = items.filter(i => i.role === 'want').map(({ role, ...rest }) => rest)
    return {
      id: r.id,
      user: { id: r.user_id, username: r.username, image: r.image, profile_url: r.profile_url },
      remark: r.remark,
      status: r.status,
      created_at: r.created_at,
      have,
      want,
    } as PvbTradeDTO
  })
}

// ===== Update Trade Status =====
export async function pvbUpdateTradeStatus(id: number, status: 'ongoing' | 'completed') {
  const db = getDB()
  const res = await db
    .prepare(`UPDATE pvb_trades SET status = ? WHERE id = ?`)
    .bind(status, id)
    .run()
  if (!res.success) throw new Error('failed to update pvb trade')
  return { success: true as const }
}

// ===== Delete Trade =====
export async function pvbDeleteTrade(id: number) {
  const db = getDB()
  // delete items first due to FK
  await db.prepare(`DELETE FROM pvb_trade_items WHERE trade_id = ?`).bind(id).run()
  const res = await db.prepare(`DELETE FROM pvb_trades WHERE id = ?`).bind(id).run()
  if (!res.success) throw new Error('failed to delete pvb trade')
  return { success: true as const }
}


