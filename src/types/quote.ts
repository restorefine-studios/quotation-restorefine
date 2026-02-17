export interface QuoteData {
  id?: string
  clientName: string
  clientLogo?: string
  packageName: string
  subtitle: string
  videoCount: number
  photoCount: number
  showVideos: boolean
  showPhotos: boolean
  platforms: string[]
  addOns: string[]
  price: string
  priceSubtext: string
  initialTerm: string
  initialTermLabel: string
  exitNotice: string
  exitNoticeLabel: string
  showManagement: boolean
  ctaTitle: string
  ctaText: string
  ctaHighlight: string
  ctaHighlightColor: string
  ctaHighlightUnderline: boolean
  ctaFooter: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export const PLATFORMS = ['Instagram', 'TikTok']
export const ADD_ONS = [
  'Drone footage',
  'UGC / Presenter',
  'Paid ads',
  'Google Business',
  'Menu / website visuals'
]

export const DEFAULT_QUOTE: QuoteData = {
  clientName: 'Client Name',
  packageName: 'Social Media Growth Package',
  subtitle: 'Premium Content Strategy',
  videoCount: 12,
  photoCount: 20,
  showVideos: true,
  showPhotos: true,
  platforms: ['Instagram', 'TikTok'],
  addOns: ['Drone footage', 'Paid ads'],
  price: '995',
  priceSubtext: 'Billed monthly in advance',
  initialTerm: '3 Months',
  initialTermLabel: 'Initial Term',
  exitNotice: '30 Days',
  exitNoticeLabel: 'Exit Notice',
  showManagement: true,
  ctaTitle: 'Ready to Start?',
  ctaText: 'Reply GO to activate',
  ctaHighlight: 'GO',
  ctaHighlightColor: '#EF4444',
  ctaHighlightUnderline: true,
  ctaFooter: 'Premium Content Quality Guaranteed'
}
