import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { Providers } from '@/components/Providers'
import '../index.css'

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
    <html lang="en">
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
