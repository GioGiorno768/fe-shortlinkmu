// File: i18n.ts (DI ROOT)
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "id"];
export const defaultLocale = "id";

export default getRequestConfig(async ({ locale }) => {
  // Validasi locale
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    // [UBAH] Path-nya jadi './messages' (sebelumnya '../messages')
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
