import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing'; // <-- GUNAKAN @

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Import messages dari folder di root project
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
