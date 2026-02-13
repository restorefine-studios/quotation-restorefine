export interface QuoteData {
  id?: string
  clientName: string
  packageName: string
  subtitle: string
  videoCount: number
  photoCount: number
  showVideos: boolean
  showPhotos: boolean
  platforms: string[]
  addOns: string[]
  price: string
  ctaTitle: string
  ctaText: string
  ctaHighlight: string
  ctaHighlightColor: string
  ctaHighlightUnderline: boolean
  ctaFooter: string
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
  ctaTitle: 'Ready to Start?',
  ctaText: 'Reply GO to activate',
  ctaHighlight: 'GO',
  ctaHighlightColor: '#EF4444',
  ctaHighlightUnderline: true,
  ctaFooter: 'Premium Content Quality Guaranteed'
}
