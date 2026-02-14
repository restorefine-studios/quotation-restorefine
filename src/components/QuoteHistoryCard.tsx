'use client'

import { QuoteData } from '@/types/quote'
import { Trash2, Eye, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

interface QuoteHistoryCardProps {
  quote: QuoteData
  onView: (quote: QuoteData) => void
  onDelete: (id: string) => void
}

export function QuoteHistoryCard({ quote, onView, onDelete }: QuoteHistoryCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {quote.clientLogo && (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <Image
                src={quote.clientLogo}
                alt={quote.clientName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-slate-900">{quote.packageName}</h3>
            <p className="text-sm text-slate-500">{quote.clientName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(quote)}
            className="h-9 w-9 border-slate-200 hover:bg-slate-100"
          >
            <Eye size={16} />
          </Button>
          {quote.id && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(quote.id!)}
              className="h-9 w-9 border-red-100 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-slate-600 line-clamp-2">{quote.subtitle}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {quote.showVideos && (
            <span className="font-medium">{quote.videoCount} Videos</span>
          )}
          {quote.showPhotos && (
            <span className="font-medium">{quote.photoCount} Photos</span>
          )}
          <span className="font-bold text-red-600">£{quote.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <Calendar size={14} className="text-slate-400" />
        <span className="text-xs text-slate-500">
          Created {quote.createdAt ? formatDate(quote.createdAt) : 'Unknown'}
        </span>
      </div>
    </div>
  )
}
