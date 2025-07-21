import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // ✅ Những route public
  const publicPaths = ['/login', '/about', '/contact','/register']

  const isPublic = publicPaths.some((path) => pathname.startsWith(path))
  if (isPublic) {
    return NextResponse.next()
  }

  // ✅ Những route yêu cầu đăng nhập
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('message', `unauthorized-${Date.now()}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'], // Áp dụng cho tất cả route
}
