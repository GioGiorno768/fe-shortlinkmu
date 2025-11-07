import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matcher untuk skip file internal Next.js, file statis, dan API
  matcher: ["/", "/(id|en)/:path*"],
};
