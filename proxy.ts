import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

const protectedRoutes = ["/dashboard", "/lesson", "/quiz", "/journey", "/profile", "/achievements", "/progress"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow NextAuth API routes through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const session = await auth()

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
