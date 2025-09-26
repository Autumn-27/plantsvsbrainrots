export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';

// ===== Trading Types =====
export type TradeItemRole = 'have' | 'want';
export type TradeItemCategory = 'pet' | 'crop';

export type D1Trade = {
  id: number;
  user_id: string;
  remark: string | null;
  status?: 'ongoing' | 'completed';
  created_at: string;
};

export type D1TradeItem = {
  id: number;
  trade_id: number;
  role: TradeItemRole;
  category: TradeItemCategory;
  item_id: string; // allow string ids per design (data id)
  quantity: number;
  age: number | null;
  weight: number | null;
  mutations: string | null; // comma separated
};

export type TradeUser = {
  id: string;
  username: string | null;
  image: string | null; // 来自 users.image
  profile_url: string | null; // 来自 users.profile_url
};

export type TradeItemPayload = {
  category: TradeItemCategory;
  item_id: string;
  quantity?: number;
  age?: number | null;
  weight?: number | null;
  mutations?: string | null; // comma separated
};

export type TradeDTO = {
  id: number;
  user: TradeUser | null;
  remark: string | null;
  status?: 'ongoing' | 'completed';
  created_at: string;
  have: Omit<D1TradeItem, 'role'>[];
  want: Omit<D1TradeItem, 'role'>[];
};

export type D1Game = {
  id: string;
  title: string;
  slug?: string | null;
  description: string | null;
  instructions: string | null;
  url: string;
  category: string | null;
  tags: string | null;
  thumb: string | null;
};

type QueryTable = 'games' | 'topgames';

export type D1User = {
  id: string;
  name: string | null;
  image: string | null;
  provider: string | null;
  username?: string | null; // preferred_username
  nickname?: string | null;
  profileUrl?: string | null; // profile
  robloxCreatedAt?: string | null; // ISO string
  created_at?: string;
  updated_at?: string;
};

export async function upsertUser(user: D1User) {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  // 简单 upsert：先尝试更新，若无行受影响则插入
  const now = new Date().toISOString();
  const updateRes = await db
    .prepare(
      `UPDATE users
       SET name = ?, image = ?, provider = ?, username = ?, nickname = ?, profile_url = ?, roblox_created_at = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      user.name,
      user.image,
      user.provider,
      user.username ?? null,
      user.nickname ?? null,
      user.profileUrl ?? null,
      user.robloxCreatedAt ?? null,
      now,
      user.id
    )
    .run();

  if (updateRes.success && updateRes.meta.changes > 0) return { updated: true } as const;

  const insertRes = await db
    .prepare(
      `INSERT INTO users (
         id, name, image, provider, username, nickname, profile_url, roblox_created_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      user.id,
      user.name,
      user.image,
      user.provider,
      user.username ?? null,
      user.nickname ?? null,
      user.profileUrl ?? null,
      user.robloxCreatedAt ?? null,
      now,
      now
    )
    .run();

  return { inserted: insertRes.success } as const;
}

export async function queryGames(opts: { page: number; perPage: number; category?: string; q?: string; table?: QueryTable; select?: 'minimal' | 'full' }) {
  const { page, perPage } = opts;
  const table: QueryTable = opts.table === 'topgames' ? 'topgames' : 'games';
  const env = getRequestContext().env as { DB: D1Database; CACHE?: KVNamespace };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  const cache = (env as { DB: D1Database; CACHE?: KVNamespace }).CACHE;
  const CACHE_TTL_SECONDS = 60 * 60 * 6; // 6h

  const normalize = (v?: string | null) => (v ? v.trim().toLowerCase() : '');
  const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0).toString(16);
  };
  const key = `games:query:${table}:${opts.select === 'minimal' ? 'm' : 'f'}:${normalize(opts.category) || '__'}:${opts.q ? hash(normalize(opts.q)) : '__'}:${page}:${perPage}`;

  if (cache) {
    const cached = await cache.get(key, 'json');
    if (cached) {
      return cached as { page: number; perPage: number; total: number; totalPages: number; items: D1Game[] };
    }
  }

  const conditions: string[] = [];
  const values: unknown[] = [];
  if (opts.category) {
    conditions.push('category = ?');
    values.push(opts.category);
  }
  if (opts.q) {
    const like = `%${opts.q.toLowerCase()}%`;
    conditions.push('(lower(title) LIKE ? OR lower(description) LIKE ? OR lower(tags) LIKE ?)');
    values.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countStmtRaw = db.prepare(`SELECT COUNT(*) as cnt FROM ${table} ${where}`);
  const countStmt = values.length ? countStmtRaw.bind(...values) : countStmtRaw;
  const countRes = await countStmt.first<{ cnt: number }>();
  const total = countRes?.cnt ?? 0;

  const offset = (page - 1) * perPage;
  const selectingMinimal = opts.select === 'minimal';
  const selectCols = selectingMinimal
    ? 'id, title, slug, thumb, category'
    : 'id, title, slug, thumb, category';
  const listStmtRaw = db
    .prepare(
      `SELECT ${selectCols}
       FROM ${table}
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
  const listBindValues = values.length ? [...values, perPage, offset] : [perPage, offset];
  const listStmt = listBindValues.length ? listStmtRaw.bind(...listBindValues) : listStmtRaw;
  const rows = (await listStmt.all<D1Game>()).results ?? [];

  const result = { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)), items: rows };

  if (cache) {
    await cache.put(key, JSON.stringify(result), { expirationTtl: CACHE_TTL_SECONDS });
  }

  return result;
}

// 更新交易状态
export async function updateTradeStatus(tradeId: number, userId: string, status: 'ongoing' | 'completed') {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  const result = (await db
    .prepare('UPDATE trades SET status = ? WHERE id = ? AND user_id = ?')
    .bind(status, tradeId, userId)
    .run()) as { success: boolean; meta?: { changes?: number } };

  if (!result.success) {
    throw new Error('Failed to update trade status');
  }

  if ((result.meta?.changes ?? 0) === 0) {
    throw new Error('Trade not found or not owned by user');
  }

  return result;
}

// 删除交易
export async function deleteTrade(tradeId: number, userId: string) {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  // 先删除交易物品
  await db
    .prepare('DELETE FROM trade_items WHERE trade_id = ?')
    .bind(tradeId)
    .run();

  // 再删除交易
  const result = (await db
    .prepare('DELETE FROM trades WHERE id = ? AND user_id = ?')
    .bind(tradeId, userId)
    .run()) as { success: boolean; meta?: { changes?: number } };

  if (!result.success) {
    throw new Error('Failed to delete trade');
  }

  if ((result.meta?.changes ?? 0) === 0) {
    throw new Error('Trade not found or not owned by user');
  }

  return result;
}

export async function getGameBySlug(slug: string, table: QueryTable = 'games') {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');
  const stmt = db.prepare(
    `SELECT id, title, slug, description, instructions, url, category, tags, thumb
     FROM ${table}
     WHERE slug = ?
     LIMIT 1`
  ).bind(slug);
  return await stmt.first<D1Game | null>();
}


// ===== Notifications (D1) =====
export type D1Notification = {
  id: number
  user_id: string
  title: string
  message: string
  is_read: number
  created_at: string
}

export async function createNotification(params: { userId: string; title: string; message: string }) {
  const env = getRequestContext().env as { DB: D1Database }
  const db = env?.DB as D1Database
  if (!db) throw new Error('D1 binding DB not found')

  const res = await db
    .prepare(`INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`)
    .bind(params.userId, params.title, params.message)
    .run()
  if (!res.success) throw new Error('failed to insert notification')
  const row = await db.prepare('SELECT last_insert_rowid() as id').first<{ id: number }>()
  return { id: row?.id as number }
}

export async function listNotifications(params: { userId: string; limit?: number; offset?: number }) {
  const env = getRequestContext().env as { DB: D1Database }
  const db = env?.DB as D1Database
  if (!db) throw new Error('D1 binding DB not found')
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100)
  const offset = Math.max(params.offset ?? 0, 0)
  const rows = (await db
    .prepare(`SELECT id, user_id, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(params.userId, limit, offset)
    .all<D1Notification>()).results || []
  return rows
}

export async function getUnreadNotificationCount(userId: string) {
  const env = getRequestContext().env as { DB: D1Database }
  const db = env?.DB as D1Database
  if (!db) throw new Error('D1 binding DB not found')
  const row = await db
    .prepare(`SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0`)
    .bind(userId)
    .first<{ cnt: number }>()
  return row?.cnt ?? 0
}

export async function markNotificationRead(userId: string, id: number) {
  const env = getRequestContext().env as { DB: D1Database }
  const db = env?.DB as D1Database
  if (!db) throw new Error('D1 binding DB not found')
  const res = await db
    .prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`)
    .bind(id, userId)
    .run()
  if (!res.success) throw new Error('failed to update notification')
  return { ok: true }
}

// ===== Trading Queries (D1) =====
export async function createTrade(params: { userId: string; remark?: string | null; have: TradeItemPayload[]; want: TradeItemPayload[] }) {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  if (!params.have?.length || !params.want?.length) throw new Error('at least one have and one want');
  if (params.have.length > 10 || params.want.length > 10) throw new Error('item limit exceeded');

  // insert trade
  const insertTrade = await db
    .prepare(`INSERT INTO trades (user_id, remark, status) VALUES (?, ?, ?)`)
    .bind(params.userId, params.remark ?? null, 'ongoing')
    .run();
  if (!insertTrade.success) throw new Error('failed to insert trade');
  // D1 last_insert_rowid()
  const tradeIdRow = await db.prepare('SELECT last_insert_rowid() as id').first<{ id: number }>();
  const tradeId = tradeIdRow?.id as number;

  const insertItemStmt = db.prepare(
    `INSERT INTO trade_items (trade_id, role, category, item_id, quantity, age, weight, mutations)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertOne = async (role: TradeItemRole, it: TradeItemPayload) => {
    const quantity = it.quantity && it.quantity > 0 ? it.quantity : 1;
    await insertItemStmt
      .bind(
        tradeId,
        role,
        it.category,
        it.item_id,
        quantity,
        it.age ?? null,
        it.weight ?? null,
        it.mutations ?? null
      )
      .run();
  };

  for (const it of params.have) await insertOne('have', it);
  for (const it of params.want) await insertOne('want', it);

  return { tradeId } as const;
}

export async function getTradeById(id: number): Promise<TradeDTO | null> {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  const trade = await db
    .prepare(`SELECT t.id, t.user_id, t.remark, t.status, t.created_at, u.username, u.image, u.profile_url
              FROM trades t
              LEFT JOIN users u ON u.id = t.user_id
              WHERE t.id = ?`)
    .bind(id)
    .first<{ id: number; user_id: string; remark: string | null; status: 'ongoing' | 'completed'; created_at: string; username: string | null; image: string | null; profile_url: string | null }>();
  if (!trade) return null;

  const items = (await db
    .prepare(`SELECT id, trade_id, role, category, item_id, quantity, age, weight, mutations FROM trade_items WHERE trade_id = ?`)
    .bind(id)
    .all<D1TradeItem>()).results || [];

  const have = items.filter(i => i.role === 'have').map(({ role, ...rest }) => rest);
  const want = items.filter(i => i.role === 'want').map(({ role, ...rest }) => rest);

  return {
    id: trade.id,
    user: { id: trade.user_id, username: trade.username, image: trade.image, profile_url: trade.profile_url },
    remark: trade.remark,
    status: trade.status,
    created_at: trade.created_at,
    have,
    want,
  };
}

export async function listTrades(opts?: { haveItemIds?: string[]; wantItemIds?: string[]; userId?: string; limit?: number; offset?: number }): Promise<TradeDTO[]> {
  const env = getRequestContext().env as { DB: D1Database };
  const db = env?.DB as D1Database;
  if (!db) throw new Error('D1 binding DB not found');

  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 100);
  const offset = Math.max(opts?.offset ?? 0, 0);

  // Build WHERE conditions for filtering
  const whereConditions: string[] = [];
  const bindParams: Array<string | number> = [];

  // Filter by have items (items that users want to trade away)
  if (opts?.haveItemIds?.length) {
    const havePlaceholders = opts.haveItemIds.map(() => '?').join(',');
    whereConditions.push(`t.id IN (
      SELECT DISTINCT trade_id 
      FROM trade_items 
      WHERE role = 'want' AND item_id IN (${havePlaceholders})
    )`);
    bindParams.push(...opts.haveItemIds);
  }

  // Filter by want items (items that users want to receive)
  if (opts?.wantItemIds?.length) {
    const wantPlaceholders = opts.wantItemIds.map(() => '?').join(',');
    whereConditions.push(`t.id IN (
      SELECT DISTINCT trade_id 
      FROM trade_items 
      WHERE role = 'have' AND item_id IN (${wantPlaceholders})
    )`);
    bindParams.push(...opts.wantItemIds);
  }

  // Filter by user ID
  if (opts?.userId) {
    whereConditions.push('t.user_id = ?');
    bindParams.push(opts.userId);
  }

  // Build the final query
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  const query = `SELECT t.id, t.user_id, t.remark, t.status, t.created_at, u.username, u.image, u.profile_url
                 FROM trades t
                 LEFT JOIN users u ON u.id = t.user_id
                 ${whereClause}
                 ORDER BY t.id DESC
                 LIMIT ? OFFSET ?`;

  const trades = (await db
    .prepare(query)
    .bind(...bindParams, limit, offset)
    .all<{ id: number; user_id: string; remark: string | null; status: 'ongoing' | 'completed'; created_at: string; username: string | null; image: string | null; profile_url: string | null }>()).results || [];
  
  if (!trades.length) return [];

  // Get all items for the filtered trades
  const ids = trades.map(t => t.id);
  const placeholders = ids.map(() => '?').join(',');
  const itemsAll = (await db
    .prepare(`SELECT id, trade_id, role, category, item_id, quantity, age, weight, mutations FROM trade_items WHERE trade_id IN (${placeholders})`)
    .bind(...ids)
    .all<D1TradeItem>()).results || [];

  // Group items by trade
  const byTrade: Record<number, D1TradeItem[]> = {};
  for (const it of itemsAll) {
    (byTrade[it.trade_id] ||= []).push(it);
  }

  return trades.map(t => {
    const items = byTrade[t.id] || [];
    const have = items.filter(i => i.role === 'have').map(({ role, ...rest }) => rest);
    const want = items.filter(i => i.role === 'want').map(({ role, ...rest }) => rest);
    return {
      id: t.id,
      user: { id: t.user_id, username: t.username, image: t.image, profile_url: t.profile_url },
      remark: t.remark,
      status: t.status,
      created_at: t.created_at,
      have,
      want,
    } as TradeDTO;
  });
}


