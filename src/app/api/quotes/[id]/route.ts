import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

// GET /api/quotes/[id] - Get a specific quote (PUBLIC - no auth required for sharing)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Public access - anyone with the link can view the quote
    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Get quote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/quotes/[id] - Update a specific quote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if quote exists and user owns it
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    if (existingQuote.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update quote
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        clientName: body.clientName,
        clientLogo: body.clientLogo ?? undefined,
        packageName: body.packageName,
        subtitle: body.subtitle,
        videoCount: body.videoCount,
        photoCount: body.photoCount,
        showVideos: body.showVideos,
        showPhotos: body.showPhotos,
        platforms: body.platforms,
        addOns: body.addOns,
        price: body.price,
        priceSubtext: body.priceSubtext,
        initialTerm: body.initialTerm,
        initialTermLabel: body.initialTermLabel,
        exitNotice: body.exitNotice,
        exitNoticeLabel: body.exitNoticeLabel,
        showManagement: body.showManagement,
        showCTA: body.showCTA,
        ctaTitle: body.ctaTitle,
        ctaText: body.ctaText,
        ctaHighlight: body.ctaHighlight,
        ctaHighlightColor: body.ctaHighlightColor,
        ctaHighlightUnderline: body.ctaHighlightUnderline,
        ctaFooter: body.ctaFooter,
      },
    })

    return NextResponse.json({
      quote,
      message: 'Quote updated successfully',
    })
  } catch (error) {
    console.error('Update quote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/quotes/[id] - Delete a specific quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if quote exists and user owns it
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    if (existingQuote.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete quote
    await prisma.quote.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Quote deleted successfully',
    })
  } catch (error) {
    console.error('Delete quote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
