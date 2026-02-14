'use client'

import { QuoteDashboard } from '../components/QuoteDashboard'
import { AuthGuard } from '../components/AuthGuard'

export default function Home() {
  return (
    <AuthGuard>
      <main>
        <QuoteDashboard />
      </main>
    </AuthGuard>
  )
}
