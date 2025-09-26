import { Metadata } from 'next'
import Link from 'next/link'
import TradeFormClient from './TradeFormClient'

export const metadata: Metadata = {
  title: 'Plants vs Brainrots - Create Trade',
  description: 'Set up your trade offer and find the perfect match for your items',
}

export default function NewTradePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Create Trade</h1>
        <Link href="/plants-vs-brainrots-trading" className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors">Back to list</Link>
      </div>

      <div className="space-y-6">
        <TradeFormClient />
      </div>
    </div>
  )
}


