// File baru: src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  // Daftar semua locale yang didukung
  locales: locales,

  // Locale default
  defaultLocale: defaultLocale,

  // Sembunyikan prefix locale default (opsional tapi rapi)
  // Jadi /id/about -> /about, tapi /en/about -> /en/about
  localePrefix: "as-needed",
});

export const config = {
  // Skip path yang gak perlu di-translate
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};