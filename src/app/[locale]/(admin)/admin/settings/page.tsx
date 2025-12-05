import { redirect } from "@/i18n/routing";

export default function AdminSettingsPage() {
  redirect({ href: "/admin/settings/profile", locale: "en" });
}
