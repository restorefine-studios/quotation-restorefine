import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession } from '@/lib/session'
import { clearSessionCookie } from '@/lib/auth'

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_session'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value

    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken)
    }

    // Clear session cookie
    await clearSessionCookie()

    return NextResponse.json({
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    // Still clear cookie even if database deletion fails
    await clearSessionCookie()
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )
  }
}