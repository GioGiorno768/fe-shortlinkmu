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

  // 3. PROTEKSI HALAMAN ADMIN
  // Cek apakah URL mengandung "/admin"
  // (Logic aslinya nanti lu ganti pake cek Session/Token user)
  const isAdminPath = pathname.includes("/admin");
  const isUserAdmin = true; // <--- GANTI INI DENGAN LOGIC AUTH LU NANTI (misal: checkCookie)

  if (isAdminPath && !isUserAdmin) {
    // Kalau bukan admin coba masuk, tendang ke login atau 404
    const url = request.nextUrl.clone();
    url.pathname = "/en/login"; // Atau halaman 'unauthorized'
    return NextResponse.redirect(url);
  }

  // 4. Lanjut ke i18n Handler
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)", "/"],
};
