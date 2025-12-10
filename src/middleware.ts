import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass API & Static
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Redirect bare /admin or /super-admin to dashboards
  // Extract locale and check path after locale
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1) {
    const locale = segments[0]; // en or id
    const path = segments.slice(1).join("/");

    // Check if accessing bare admin or super-admin
    if (path === "admin" || path === "super-admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${path}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // 3. AUTH PROTECTION - Check token from cookie
  const token = request.cookies.get("auth_token")?.value;
  const userDataCookie = request.cookies.get("user_data")?.value;
  let userRole: string | null = null;

  if (userDataCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      userRole = userData.role;
    } catch (e) {
      // Invalid user data
      userRole = null;
    }
  }

  // Check if accessing protected routes
  const isDashboardPath = pathname.includes("/dashboard");
  const isAdminPath = pathname.includes("/admin");
  const isSuperAdminPath = pathname.includes("/super-admin");

  // Auth pages (login, register)
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    const url = request.nextUrl.clone();
    // Redirect based on role
    if (userRole === "super_admin") {
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/super-admin/dashboard`;
    } else if (userRole === "admin") {
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/admin/dashboard`;
    } else {
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/dashboard`;
    }
    return NextResponse.redirect(url);
  }

  // Protect dashboard routes - require authentication
  if (isDashboardPath && !isAdminPath && !isSuperAdminPath) {
    // This is user dashboard (/dashboard)
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // Block admin from accessing user dashboard (only super_admin can access)
    if (userRole === "admin") {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/admin/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes - require admin or super_admin role
  if (isAdminPath && !isSuperAdminPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "admin" && userRole !== "super_admin") {
      // Not authorized - redirect to user dashboard
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Protect super-admin routes - require super_admin role only
  if (isSuperAdminPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "super_admin") {
      // Not super admin - redirect based on role
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      if (userRole === "admin") {
        url.pathname = `/${locale}/admin/dashboard`;
      } else {
        url.pathname = `/${locale}/dashboard`;
      }
      return NextResponse.redirect(url);
    }
  }

  // 4. Lanjut ke i18n Handler
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)", "/"],
};
