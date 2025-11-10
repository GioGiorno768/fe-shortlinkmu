// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass untuk API routes dan static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm)$/)
  ) {
    return NextResponse.next();
  }

  // Handle i18n routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match semua path KECUALI yang di bawah
    "/((?!api|_next/static|_next/image|.*\\..*).*)",

    // Pastikan root path juga di-handle
    "/",
  ],
};
