import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";
import * as settingsService from "@/services/settingsService";

export default async function AdminPreferencesPage() {
  const data = await settingsService.getAdminPreferences();
  return <PreferencesSection initialData={data} type="admin" />;
}
