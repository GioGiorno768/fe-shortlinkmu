import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import * as settingsService from "@/services/settingsService";

export default async function AdminProfilePage() {
  const data = await settingsService.getAdminProfile();
  return <ProfileSection initialData={data} type="admin" />;
}
