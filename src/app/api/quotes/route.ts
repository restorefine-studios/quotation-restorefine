import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

// GET /api/quotes - Get all quotes for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const quotes = await prisma.quote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Get quotes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'clientName',
      'packageName',
      'subtitle',
      'platforms',
      'addOns',
      'price',
      'ctaTitle',
      'ctaText',
      'ctaHighlight',
      'ctaFooter',
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        userId: user.id,
        clientName: body.clientName,
        clientLogo: body.clientLogo || null,
        packageName: body.packageName,
        subtitle: body.subtitle,
        videoCount: body.videoCount || 0,
        photoCount: body.photoCount || 0,
        showVideos: body.showVideos !== undefined ? body.showVideos : true,
        showPhotos: body.showPhotos !== undefined ? body.showPhotos : true,
        platforms: body.platforms,
        addOns: body.addOns,
        price: body.price,
        priceSubtext: body.priceSubtext || 'Billed monthly in advance',
        initialTerm: body.initialTerm || '3 Months',
        initialTermLabel: body.initialTermLabel || 'Initial Term',
        exitNotice: body.exitNotice || '30 Days',
        exitNoticeLabel: body.exitNoticeLabel || 'Exit Notice',
        showManagement: body.showManagement !== undefined ? body.showManagement : true,
        showCTA: body.showCTA !== undefined ? body.showCTA : true,
        ctaTitle: body.ctaTitle,
        ctaText: body.ctaText,
        ctaHighlight: body.ctaHighlight,
        ctaHighlightColor: body.ctaHighlightColor || '#EF4444',
        ctaHighlightUnderline:
          body.ctaHighlightUnderline !== undefined
            ? body.ctaHighlightUnderline
            : true,
        ctaFooter: body.ctaFooter,
      },
    })

    return NextResponse.json(
      { quote, message: 'Quote created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create quote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
