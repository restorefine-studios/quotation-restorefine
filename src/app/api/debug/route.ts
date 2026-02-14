import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      hasCookieName: !!process.env.COOKIE_NAME,
      nodeEnv: process.env.NODE_ENV,
      // Don't expose actual values, just check if they exist
    }

    // Try to import Prisma
    let prismaStatus = 'not-checked'
    try {
      const { default: prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      prismaStatus = 'connected'
      await prisma.$disconnect()
    } catch (error: any) {
      prismaStatus = `error: ${error.message}`
    }

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      prisma: prismaStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
