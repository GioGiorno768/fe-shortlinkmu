import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import type { UserProfile } from "@/types/type";

// MOCK API FETCH
async function fetchProfileData() {
  console.log("MANGGIL API: GET /api/user/profile");
  await new Promise((r) => setTimeout(r, 500));
  return {
    name: "Kevin Ragil",
    email: "kevinragil768@gmail.com",
    phone: "08123456789",
    avatarUrl: "https://avatar.iran.liara.run/public/35",
    username: "Narancia",
  } as UserProfile;
}

export default async function Page() {
  const data = await fetchProfileData();
  return <ProfileSection initialData={data} />;
}
