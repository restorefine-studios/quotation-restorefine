import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { Providers } from '@/components/Providers'
import { Geist } from 'next/font/google'
import { Manrope } from 'next/font/google'
import '../index.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RestoRefine Quote Card',
  description: 'Transform lengthy proposals into sleek, mobile-friendly infographic quotes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
