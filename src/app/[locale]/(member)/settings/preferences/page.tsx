// src/app/[locale]/(member)/settings/preferences/page.tsx
import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";
import * as settingsService from "@/services/settingsService"; // Pake Service

export default async function Page() {
  const data = await settingsService.getUserPreferences();
  return <PreferencesSection initialData={data} />;
}
