// src/app/[locale]/(member)/settings/security/page.tsx
import SecuritySection from "@/components/dashboard/settings/SecuritySection";
import * as settingsService from "@/services/settingsService"; // Pake Service

export default async function Page() {
  // Fetch data dari Service (Server Side)
  const data = await settingsService.getSecuritySettings();
  return <SecuritySection initialData={data} />;
}
