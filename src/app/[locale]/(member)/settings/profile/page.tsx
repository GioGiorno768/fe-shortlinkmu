import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import * as settingsService from "@/services/settingsService"; // Import Service

export default async function Page() {
  // Fetch data dari Service (Server Side)
  const data = await settingsService.getUserProfile();
  return <ProfileSection initialData={data} />;
}
