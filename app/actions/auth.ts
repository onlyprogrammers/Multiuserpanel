"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { authenticateUser, generateDeviceFingerprint, logout as logoutUser, extendSession } from "@/lib/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1"
  const deviceFingerprint = generateDeviceFingerprint(userAgent, ip)

  const result = await authenticateUser(email, password, deviceFingerprint, ip, userAgent)

  if (result.success && result.token) {
    const cookieStore = await cookies()
    cookieStore.set("auth-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    // Redirect based on user role
    const role = result.user?.role
    if (role === "administrator") {
      redirect("/admin")
    } else if (role === "teacher") {
      redirect("/teacher")
    } else {
      redirect("/student")
    }
  }

  return result
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (token) {
    // Extract session token from JWT and logout
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      await logoutUser(payload.sessionToken)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  cookieStore.delete("auth-token")
  redirect("/login")
}

export async function extendUserSession(sessionToken: string) {
  const success = await extendSession(sessionToken)

  if (success) {
    // Update cookie expiration
    const cookieStore = await cookies()
    const currentToken = cookieStore.get("auth-token")?.value

    if (currentToken) {
      cookieStore.set("auth-token", currentToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      })
    }
  }

  return { success }
}
