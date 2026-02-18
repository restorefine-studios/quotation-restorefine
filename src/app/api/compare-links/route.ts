import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// POST /api/compare-links - Create a short compare link
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { quoteIds, clientName } = await request.json()

    if (!Array.isArray(quoteIds) || quoteIds.length === 0) {
      return NextResponse.json({ error: 'quoteIds required' }, { status: 400 })
    }

    // Check if an identical compare link already exists
    const existing = await prisma.compareLink.findFirst({
      where: { quoteIds: { equals: quoteIds } },
    })
    if (existing) {
      return NextResponse.json({ slug: existing.slug })
    }

    // Build a unique slug
    const base = `quotations-${toSlug(clientName || 'client')}`
    let slug = base
    let attempt = 2
    while (await prisma.compareLink.findUnique({ where: { slug } })) {
      slug = `${base}-${attempt++}`
    }

    const link = await prisma.compareLink.create({
      data: { slug, quoteIds },
    })

    return NextResponse.json({ slug: link.slug }, { status: 201 })
  } catch (error) {
    console.error('Create compare link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
