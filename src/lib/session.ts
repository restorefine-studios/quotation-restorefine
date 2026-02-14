import { randomBytes } from 'crypto'
import prisma from './prisma'

const SESSION_EXPIRY_DAYS = 30

/**
 * Generate a cryptographically secure random session token
 * @returns 64-character hexadecimal token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Create a new session for a user
 * @param userId - User ID to create session for
 * @returns Created session object with token
 */
export async function createSession(userId: string) {
  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  return session
}

/**
 * Validate a session token and return the session with user if valid
 * @param token - Session token to validate
 * @returns Session with user if valid, null otherwise
 */
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    // Delete expired session
    await prisma.session.delete({
      where: { id: session.id },
    })
    return null
  }

  return session
}

/**
 * Delete a session (for logout)
 * @param token - Session token to delete
 */
export async function deleteSession(token: string) {
  await prisma.session.delete({
    where: { token },
  })
}

/**
 * Delete all sessions for a user (for password reset)
 * @param userId - User ID to delete all sessions for
 */
export async function deleteAllUserSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  })
}