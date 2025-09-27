'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import ItemsSelectorClient from './ItemsSelectorClient'

type Category = 'plant' | 'brainrot'

type ClientItem = {
  category: Category
  item_id: string
  quantity: number
  weight: number | null
  damage?: number | null
  normal?: number | null
  mutations: string | null
}

export default function TradeFormClient() {
  const router = useRouter()
  const [remark, setRemark] = useState('')
  const [haveItems, setHaveItems] = useState<unknown[]>([])
  const [wantItems, setWantItems] = useState<unknown[]>([])
  const [submitting, setSubmitting] = useState(false)

  const have: ClientItem[] = useMemo(() => 
    haveItems.map((it) => {
      const item = it as Record<string, unknown>
      return {
        category: item.category as Category,
        item_id: String((item.plantSlug ?? item.brainrotSlug ?? item.item_id ?? '') || ''),
        quantity: (item.quantity as number) || 1,
        weight: typeof item.weight === 'number' ? item.weight : null,
        damage: typeof item.damage === 'number' ? item.damage : null,
        normal: typeof item.normal === 'number' ? item.normal : null,
        mutations: typeof item.mutations === 'string' ? item.mutations : null,
      }
    }),
  [haveItems])

  const want: ClientItem[] = useMemo(() => 
    wantItems.map((it) => {
      const item = it as Record<string, unknown>
      return {
        category: item.category as Category,
        item_id: String((item.plantSlug ?? item.brainrotSlug ?? item.item_id ?? '') || ''),
        quantity: (item.quantity as number) || 1,
        weight: typeof item.weight === 'number' ? item.weight : null,
        damage: typeof item.damage === 'number' ? item.damage : null,
        normal: typeof item.normal === 'number' ? item.normal : null,
        mutations: typeof item.mutations === 'string' ? item.mutations : null,
      }
    }),
  [wantItems])

  const payload = useMemo(() => ({ remark, have, want }), [remark, have, want])

  const submit = async () => {
    if (!have.length || !want.length) return
    setSubmitting(true)
    try {
      // check session
      // const sess = await fetch('/api/session', { cache: 'no-store' }).then(r => r.json()).catch(() => ({} as any)) as { user?: { id?: string } }
      // if (!sess.user?.id) {
      //   window.location.href = '/api/oauth/roblox/login'
      //   return
      // }
      const res = await fetch('/api/pvb/trades', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        // optionally show toast
        setSubmitting(false)
        return
      }
      router.push('/trading')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-gray-600/30">
        <ItemsSelectorClient role="have" onChange={setHaveItems} disableHidden />
      </section>
        <section className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-gray-600/30">
          <ItemsSelectorClient role="want" onChange={setWantItems} disableHidden />
        </section>
      </div>

      <section className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-gray-600/30">
        <h2 className="text-lg font-semibold text-white mb-3">Remark</h2>
        <div className="rounded-2xl border border-gray-600/30 p-3 bg-gray-700/50">
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value.slice(0, 200))}
            rows={4}
            className="w-full rounded-xl border border-gray-600/30 bg-gray-700/50 text-white placeholder:text-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Add any extra notes for your trade (≤200 chars)"
            maxLength={200}
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="button" onClick={submit} disabled={submitting || !have.length || !want.length} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        <span className="text-sm text-white/70">Add at least one item on each side</span>
      </div>
    </div>
  )
}


