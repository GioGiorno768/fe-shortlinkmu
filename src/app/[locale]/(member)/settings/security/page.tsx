import SecuritySection from "@/components/dashboard/settings/SecuritySection";
import type { SecuritySettings } from "@/types/type";

async function fetchSecurityData() {
  console.log("MANGGIL API: GET /api/user/security");
  await new Promise((r) => setTimeout(r, 500));
  return {
    twoFactorEnabled: false,
    lastPasswordChange: "2025-10-01",
    isSocialLogin: false,
  } as SecuritySettings;
}

export default async function Page() {
  const data = await fetchSecurityData();
  return <SecuritySection initialData={data} />;
}
