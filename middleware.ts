import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login"]

  if (publicRoutes.includes(pathname)) {
    // If user is already authenticated, redirect to appropriate dashboard
    if (token) {
      const sessionData = await verifyToken(token)
      if (sessionData) {
        const role = sessionData.user.role
        if (role === "administrator") {
          return NextResponse.redirect(new URL("/admin", request.url))
        } else if (role === "teacher") {
          return NextResponse.redirect(new URL("/teacher", request.url))
        } else {
          return NextResponse.redirect(new URL("/student", request.url))
        }
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const sessionData = await verifyToken(token)
  if (!sessionData) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Role-based access control
  const role = sessionData.user.role

  if (pathname.startsWith("/admin") && role !== "administrator") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
