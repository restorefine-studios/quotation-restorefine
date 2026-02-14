import { cookies } from 'next/headers'
import { validateSession } from './session'

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_session'

/**
 * Get the authenticated user from the request
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const session = await validateSession(sessionToken)

  if (!session) {
    return null
  }

  return session.user
}

/**
 * Set the session cookie
 * @param token - Session token to set in cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Clear the session cookie (for logout)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}