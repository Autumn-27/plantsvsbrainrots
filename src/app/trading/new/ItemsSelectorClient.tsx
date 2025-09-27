/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import ImageWithFallback from '@/components/ImageWithFallback'
import plantsData from '../data/plants.json'
import brainrotsData from '../data/brainrots.json'
import React from 'react'

type Role = 'have' | 'want'
type Category = 'plant' | 'brainrot'

type SelectedItem = {
  category: Category
  item_id: string
  name: string
  quantity: number
  // plants
  damage?: number | null
  weight?: number | null
  plantSlug?: string
  // brainrots
  normal?: number | null
  brainrotSlug?: string
  // common
  mutations: string | null
}

export default function ItemsSelectorClient({ role, onChange, disableHidden }: { role: Role; onChange?: (items: SelectedItem[]) => void; disableHidden?: boolean }) {
  const [items, setItems] = useState<SelectedItem[]>([])
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Category>('plant')
  const [q, setQ] = useState('')
  const [stage, setStage] = useState<'list' | 'detail'>('list')
  const [pending, setPending] = useState<{ cat: Category; id: number; key: string; slug: string; name: string; img: string } | null>(null)
  const [detail, setDetail] = useState<{ quantity: number; mutations: string[]; weight: string; age: string; damage?: string; normal?: string }>({ quantity: 1, mutations: [], weight: '', age: '' })
  const [mounted, setMounted] = useState(false)

  const reset = () => setItems([])

  // 切换标签时清空搜索，避免视觉上像“追加”
  // 并重置到列表阶段
  React.useEffect(() => {
    setQ('')
    setStage('list')
  }, [tab])

  useEffect(() => { setMounted(true) }, [])

const addItem = (cat: Category, id: number, key: string, name: string, mutations: string[], weight: string, damageOrNormal?: string, extraSlug?: string) => {
    if (items.length >= 10) return
    setItems(prev => [
      ...prev,
      {
        category: cat,
      item_id: key,
        name,
        quantity: detail.quantity || 1,
        weight: weight ? Number(weight) : null,
      damage: cat === 'plant' ? (damageOrNormal && damageOrNormal !== '' ? Number(damageOrNormal) : null) : undefined,
      normal: cat === 'brainrot' ? (damageOrNormal && damageOrNormal !== '' ? Number(damageOrNormal) : null) : undefined,
      plantSlug: cat === 'plant' ? extraSlug : undefined,
      brainrotSlug: cat === 'brainrot' ? extraSlug : undefined,
        mutations: mutations.length ? mutations.join(',') : null,
      },
    ])
    setOpen(false)
    setStage('list')
    setPending(null)
    setDetail({ quantity: 1, mutations: [], weight: '', age: '' })
  }

  const removeAt = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))


  // Build catalogs with correct image URLs and keys
  const plantCatalog = useMemo(() => (
    (plantsData as unknown[]).map((p: unknown) => {
      const plant = p as { id: number; slug?: string; name: string }
      return {
        id: plant.id,
        key: String(plant.id),
        slug: String(plant.slug || plant.id),
        name: plant.name,
        img: `/plants/${plant.slug}.webp`,
      }
    })
  ), [])
  const brainrotCatalog = useMemo(() => (
    (brainrotsData as unknown[]).map((b: unknown) => {
      const brainrot = b as { id: number; slug?: string; name: string }
      return {
        id: brainrot.id,
        key: String(brainrot.id),
        slug: String(brainrot.slug || brainrot.id),
        name: brainrot.name,
        img: `/brainrots/${brainrot.slug}.webp`,
      }
    })
  ), [])

  const baseList = tab === 'plant' ? plantCatalog : brainrotCatalog
  const list = baseList.filter((x) => (
    x.name.toLowerCase().includes(q.toLowerCase().trim()) || String(x.key).toLowerCase().includes(q.toLowerCase().trim())
  ))

// emit changes upward
  if (onChange) {
    // simple emit on render when items ref changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => { onChange(items) }, [items])
  }

  return (
    <div className="space-y-3">
      {/* Hidden inputs for server action */}
      {!disableHidden && items.map((it, i) => (
        <div key={`hidden-${i}`}>
          <input type="hidden" name={`${role}[${i}][enabled]`} defaultValue="on" />
          <input type="hidden" name={`${role}[${i}][category]`} value={it.category} />
          <input type="hidden" name={`${role}[${i}][item_id]`} value={it.item_id} />
          <input type="hidden" name={`${role}[${i}][quantity]`} value={it.quantity} />
          <input type="hidden" name={`${role}[${i}][weight]`} value={it.weight ?? ''} />
          <input type="hidden" name={`${role}[${i}][damage]`} value={it.damage ?? ''} />
          <input type="hidden" name={`${role}[${i}][normal]`} value={it.normal ?? ''} />
          <input type="hidden" name={`${role}[${i}][mutations]`} value={it.mutations ?? ''} />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-white flex items-center gap-2">
          {role === 'have' ? 'I have' : 'I want'}
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-white">{items.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} disabled={!items.length} className="px-3 py-1.5 rounded-xl bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition">Reset</button>
          <button type="button" onClick={() => setOpen(true)} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition">Add item</button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group w-44 h-44 md:w-56 md:h-56 rounded-2xl border-2 border-dashed border-gray-500/50 flex flex-col items-center justify-center text-gray-300 transition hover:border-gray-400 bg-gray-800/40 hover:bg-gray-800/60"
          >
            <span className="text-3xl leading-none mb-2 text-white/70">+</span>
            <span className="text-sm text-white/80 group-hover:text-white">Add item</span>
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-2xl p-3 transition hover:shadow-md bg-gray-700/30 border border-gray-600/30">
              <div className="mt-2 w-full h-24 rounded-xl overflow-hidden flex items-center justify-center bg-gray-700/30">
                <ImageWithFallback src={it.category === 'plant' ? `/plants/${it.plantSlug || it.item_id}.webp` : `/brainrots/${it.brainrotSlug || it.item_id}.webp`} alt={it.name} width={96} height={96} className="h-24 w-24 rounded-lg object-cover border border-white/10" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-base font-semibold text-white">
                <span className="relative group inline-flex items-center">
                  {it.name}
                  {(it.mutations && it.mutations.split(',').filter(Boolean).length > 0) && (
                    <span className="absolute left-0 top-full mt-2 z-50 hidden group-hover:block whitespace-normal max-w-xs px-3 py-2 text-xs rounded-lg shadow-lg border bg-[#141824] text-white border-white/10">
                      {it.mutations.split(',').filter(Boolean).map(m => m.trim()).join(', ')}
                    </span>
                  )}
                </span>
                <span className="text-xs font-normal px-1.5 py-0.5 rounded-full bg-white/10 text-white">x{it.quantity}</span>
              </div>
              <div className="text-xs mt-0.5 text-white/70">{it.category === 'plant' ? 'Plant' : 'Brainrot'}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {typeof it.weight === 'number' && (
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">{it.weight} {it.category === 'plant' ? 'Size' : 'kg'}</span>
                )}
                {typeof it.damage === 'number' && it.category === 'plant' && (
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">DMG {it.damage}</span>
                )}
                {typeof it.normal === 'number' && it.category === 'brainrot' && (
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">Normal {it.normal}</span>
                )}
                {/* age 不再使用；保留占位可后续删掉 */}
                {(it.mutations && it.mutations.split(',').filter(Boolean).length > 0) && (
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">{it.mutations.split(',').filter(Boolean).length} mutations</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => removeAt(idx)} className="px-2 py-1 rounded-full text-xs bg-white/10 text-rose-300 hover:bg-white/15">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && mounted && createPortal((
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999997,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => setOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl md:max-w-5xl mx-auto p-0 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border shadow-2xl overflow-hidden" 
            style={{ 
              borderColor: '#475569',
              zIndex: 999998,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {stage === 'list' && (
              <>
                <div className="sticky top-0 z-10 px-4 py-3 border-b" style={{ borderColor: '#2a2a2a', backgroundColor: '#1A1A1A' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold" style={{ color: '#F3F4F6' }}>Select item</div>
                    <button type="button" onClick={() => setOpen(false)} className="hover:opacity-80" style={{ color: '#D1D5DB' }}>Close</button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 rounded-2xl p-2 flex items-center gap-2" style={{ backgroundColor: '#2B2C2E', border: '1px solid #3A3B3C' }}>
                      <button type="button" onClick={() => setTab('plant')} className={`px-3 py-1.5 rounded-xl ${tab==='plant'?'bg-white text-gray-900':'bg-gray-700 text-gray-200'}`}>Plant</button>
                      <button type="button" onClick={() => setTab('brainrot')} className={`px-3 py-1.5 rounded-xl ${tab==='brainrot'?'bg-white text-gray-900':'bg-gray-700 text-gray-200'}`}>Brainrot</button>
                    </div>
                    <div className="rounded-2xl p-2" style={{ backgroundColor: '#2B2C2E', border: '1px solid #3A3B3C' }}>
                      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" className="w-full rounded-lg border px-3 py-2 placeholder:opacity-80" style={{ borderColor: '#3A3B3C', backgroundColor: '#2F3133', color: '#F3F4F6' }} />
                    </div>
                  </div>
                </div>
                <div key={tab} className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[60vh] overflow-auto gg-scroll" style={{ backgroundColor: '#2B2C2E' }}>
                  {list.map(item => (
                    <button
                      key={`${tab}-${item.id}`}
                      type="button"
                      onClick={() => { setPending({ cat: tab, id: item.id, key: item.key, slug: item.slug, name: item.name, img: item.img }); setStage('detail') }}
                      className="text-left p-2 rounded-3xl transition hover:shadow"
                      style={{ backgroundColor: '#2F3133', border: '1px solid #3A3B3C' }}
                    >
                      <div className="w-full h-24 rounded-2xl overflow-hidden flex items-center justify-center mb-2">
                        <ImageWithFallback src={item.img} alt={item.name} width={96} height={96} className="h-24 w-24 rounded-lg object-cover border border-white/10" />
                      </div>
                      <div className="text-sm font-medium" style={{ color: '#F9FAFB' }}>{item.name}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {stage === 'detail' && pending && (
              <>
                <div className="sticky top-0 z-10 px-4 py-3 border-b border-slate-600/30 bg-slate-800/50 flex items-center justify-between">
                  <div className="text-lg font-semibold text-slate-200">Configure {pending.name}</div>
                  <button type="button" onClick={() => { setStage('list'); setDetail({ quantity: 1, mutations: [], weight: '', age: '' }) }} className="hover:opacity-80 text-slate-400 hover:text-slate-300 transition-colors">Back</button>
                </div>
                <div className="p-4 flex items-start gap-3 mb-1">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center bg-slate-700/50 border border-slate-600/30">
                    <ImageWithFallback src={pending.img} alt={pending.name} width={96} height={96} className="h-24 w-24 rounded-lg object-cover border border-white/10" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-100">{pending.name}</div>
                    <div className="text-xs text-slate-400">Mutations selected: {detail.mutations.length}</div>
                  </div>
                </div>
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="rounded-2xl p-3 bg-slate-800/50 border border-slate-600/30">
                    <label className="block text-xs mb-1 text-slate-300">Quantity</label>
                    <input type="number" min={1} value={detail.quantity}
                      onChange={e=>setDetail(d=>({ ...d, quantity: Math.max(1, Number(e.target.value)||1) }))}
                      className="w-full rounded-xl border border-slate-500/50 bg-slate-700/50 text-white px-2 py-2 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50" placeholder="Quantity" />
                  </div>
                    <div className="rounded-2xl p-3 bg-slate-800/50 border border-slate-600/30">
                      <label className="block text-xs mb-1 text-slate-300">{pending.cat === 'plant' ? 'Size' : 'Weight (kg)'}</label>
                      <input type="number" step="0.01" value={detail.weight}
                        onChange={e=>setDetail(d=>({ ...d, weight: e.target.value }))}
                        className="w-full rounded-xl border border-slate-500/50 bg-slate-700/50 text-white px-2 py-2 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50" placeholder={pending.cat === 'plant' ? 'Size' : 'Weight'} />
                    </div>
                    {pending.cat === 'plant' && (
                      <div className="rounded-2xl p-3 bg-slate-800/50 border border-slate-600/30">
                        <label className="block text-xs mb-1 text-slate-300">Damage (plants)</label>
                        <input type="number" value={detail.damage || ''}
                          onChange={e=>setDetail(d=>({ ...d, damage: e.target.value }))}
                          className="w-full rounded-xl border border-slate-500/50 bg-slate-700/50 text-white px-2 py-2 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50" placeholder="Damage" />
                      </div>
                    )}
                    {pending.cat === 'brainrot' && (
                      <div className="rounded-2xl p-3 bg-slate-800/50 border border-slate-600/30">
                        <label className="block text-xs mb-1 text-slate-300">Normal (brainrots)</label>
                        <input type="number" value={detail.normal || ''}
                          onChange={e=>setDetail(d=>({ ...d, normal: e.target.value }))}
                          className="w-full rounded-xl border border-slate-500/50 bg-slate-700/50 text-white px-2 py-2 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50" placeholder="Normal" />
                      </div>
                    )}
                </div>
                <div className="px-4 mb-3">
                  <div className="rounded-2xl p-3 bg-slate-800/50 border border-slate-600/30">
                    <div className="text-sm font-medium mb-2 text-slate-200">Mutations</div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-auto gg-scroll rounded-xl">
                    {['Gold','Diamond','Neon','Frozen'].map(m => {
                      const active = detail.mutations.includes(m)
                      return (
                        <button key={m} type="button" onClick={() => setDetail(d=>({ ...d, mutations: active ? d.mutations.filter(x=>x!==m) : [...d.mutations, m] }))} className={`px-2 py-1 rounded-full border transition ${active ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-slate-700/50 text-slate-300 border-slate-500/50 hover:bg-slate-600/50'}`}>{m}</button>
                      )
                    })}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => { setStage('list'); setPending(null) }} className="px-3 py-1.5 rounded-full bg-gray-800 text-gray-200">Cancel</button>
                  <button type="button" onClick={() => addItem(pending.cat, pending.id, pending.key, pending.name, detail.mutations, detail.weight, (pending.cat==='plant' ? detail.damage : detail.normal), pending.slug)} className="px-3 py-1.5 rounded-full bg-white text-gray-900 shadow hover:shadow-md">Add</button>
                </div>
              </>
            )}
          </div>
          <style jsx global>{`
            .gg-scroll { scrollbar-width: thin; scrollbar-color: #3a3b3c #1f2021; }
            .gg-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
            .gg-scroll::-webkit-scrollbar-track { background: #1f2021; border-radius: 8px; }
            .gg-scroll::-webkit-scrollbar-thumb { background: #3a3b3c; border-radius: 8px; }
            .gg-scroll::-webkit-scrollbar-thumb:hover { background: #4a4b4c; }
          `}</style>
        </div>
      ), document.body)}
    </div>
  )
}


