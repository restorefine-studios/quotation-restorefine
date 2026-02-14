'use client'

import { useParams, useRouter } from 'next/navigation'
import { QuoteData } from '@/types/quote'
import { QuotePreview } from '@/components/QuotePreview'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

export default function PublicQuotePage() {
  const params = useParams()
  const router = useRouter()

  // Fetch quote using TanStack Query
  const {
    data: quote,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['quote', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/${params.id}`)
      if (!response.ok) throw new Error('Quote not found')
      const data = await response.json()
      return data.quote as QuoteData
    },
    enabled: !!params.id,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white gap-6 overflow-hidden">
        {/* Subtle red blur effect */}
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10">
          <Image
            src="/r-logo.png"
            alt="RestoRefine Logo"
            width={64}
            height={64}
            className="rounded-2xl shadow-2xl animate-bounce mx-auto"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">
            RestoRefine
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold italic">Loading Quote...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Quote Not Found</h1>
          <p className="text-slate-400 mb-8">This quote doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl">
        <QuotePreview quote={quote} />
      </div>
    </div>
  )
}
