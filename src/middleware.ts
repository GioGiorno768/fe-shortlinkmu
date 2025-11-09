import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Ini akan mencocokkan SEMUA path KECUALI yang mengandung:
    // - api (rute API)
    // - _next/static (file statis Next.js)
    // - _next/image (file optimasi gambar)
    // - . (dot), yang menandakan file statis (misal: favicon.ico, cpm.png)
    "/((?!api|_next/static|_next/image|.*\\..*).*)",

    // Ini diperlukan agar path root (/) juga ditangani
    "/",
  ],
};
