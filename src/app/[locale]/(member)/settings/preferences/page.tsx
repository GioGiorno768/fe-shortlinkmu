// src/app/[locale]/(member)/settings/preferences/page.tsx

import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";
import type { UserPreferences } from "@/types/type";

async function fetchUserPreferences() {
  console.log("MANGGIL API: GET /api/user/preferences");
  await new Promise((r) => setTimeout(r, 500));
  return {
    language: "en",
    currency: "USD",
    timezone: "Asia/Jakarta",

    // 👇 DATA BARU: PRIVACY & SESSION
    privacy: {
      loginAlert: true,
      cookieConsent: true,
      saveLoginInfo: false,
    },
  } as UserPreferences;
}

export default async function Page() {
  const data = await fetchUserPreferences();
  return <PreferencesSection initialData={data} />;
}
