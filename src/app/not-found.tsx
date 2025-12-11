// src/app/not-found.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * Global 404 handler
 * Redirect ke locale-aware 404 page
 */
export default async function RootNotFound() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // Deteksi bahasa dari browser
  const locale = acceptLanguage.includes("id") ? "id" : "en";

  // Redirect ke 404 page dengan locale
  redirect(`/${locale}/not-found`);

  // Return dummy structure to satisfy root layout requirement
  return (
    <html>
      <body></body>
    </html>
  );
}
