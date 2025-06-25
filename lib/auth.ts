import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

// ----- Database client -----------------------------------------------------
const databaseUrl = process.env.DATABASE_URL // server-side only
type SQL = ReturnType<typeof neon> | ((strings: TemplateStringsArray, ...args: any[]) => Promise<any[]>)

/**
 * If DATABASE_URL exists we connect to Neon.
 * Otherwise we expose a mock async function so the app
 * still boots in preview mode (all queries return `[]`).
 */
const sql: SQL = databaseUrl
  ? neon(databaseUrl)
  : async () => {
      /* eslint-disable no-console */
      console.warn("[mock-db] DATABASE_URL not set – using in-memory stub. " + "No data will be returned.")
      return []
    }

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: number
  email: string
  name: string
  role: "administrator" | "teacher" | "student"
}

export interface SessionData {
  user: User
  sessionToken: string
  expiresAt: number
}

// Generate device fingerprint
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  return Buffer.from(`${userAgent}-${ip}`).toString("base64")
}

// Create JWT token
export async function createToken(payload: SessionData): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload as SessionData
  } catch (error) {
    return null
  }
}

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string,
  deviceFingerprint: string,
  ipAddress: string,
  userAgent: string,
) {
  try {
    // Get user from database
    const users = await sql`
      SELECT id, email, password, role, name 
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

   // if (!isValidPassword) {
  //    return { success: false, error: "Invalid credentials" }
  //  }

    // Check for existing active sessions on this device
    const existingSessions = await sql`
      SELECT id FROM user_sessions 
      WHERE user_id = ${user.id} AND device_fingerprint = ${deviceFingerprint}
      AND expires_at > NOW()
    `

    // Deactivate existing sessions for this device
    if (existingSessions.length > 0) {
      await sql`
        DELETE FROM user_sessions 
        WHERE user_id = ${user.id} AND device_fingerprint = ${deviceFingerprint}
      `
    }

    // Create new session
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await sql`
      INSERT INTO user_sessions (user_id, session_token, device_fingerprint, ip_address, user_agent, expires_at)
      VALUES (${user.id}, ${sessionToken}, ${deviceFingerprint}, ${ipAddress}, ${userAgent}, ${expiresAt})
    `

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const sessionData: SessionData = {
      user: userData,
      sessionToken,
      expiresAt: expiresAt.getTime(),
    }

    const token = await createToken(sessionData)

    return { success: true, token, user: userData }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

// Get current session
export async function getCurrentSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const sessionData = await verifyToken(token)
    if (!sessionData) return null

    // Verify session exists in database
    const sessions = await sql`
      SELECT expires_at FROM user_sessions 
      WHERE session_token = ${sessionData.sessionToken}
      AND expires_at > NOW()
    `

    if (sessions.length === 0) return null

    return sessionData
  } catch (error) {
    return null
  }
}

// Extend session
export async function extendSession(sessionToken: string): Promise<boolean> {
  try {
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await sql`
      UPDATE user_sessions 
      SET expires_at = ${newExpiresAt}, last_activity = NOW()
      WHERE session_token = ${sessionToken}
    `

    return true
  } catch (error) {
    return false
  }
}

// Logout
export async function logout(sessionToken: string): Promise<void> {
  try {
    await sql`
      DELETE FROM user_sessions 
      WHERE session_token = ${sessionToken}
    `
  } catch (error) {
    console.error("Logout error:", error)
  }
}
