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

  return (
    <html lang={locale}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace("/${locale}/not-found")`,
          }}
        />
      </body>
    </html>
  );
}
