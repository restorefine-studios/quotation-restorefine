import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/compare-links/[slug] - Resolve slug to quoteIds (public)
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const link = await prisma.compareLink.findUnique({ where: { slug } })
    if (!link) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ quoteIds: link.quoteIds })
  } catch (error) {
    console.error('Get compare link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
