// src/app/[locale]/(member)/settings/page.tsx
import { redirect } from "@/i18n/routing";

export default function SettingsPage() {
  redirect({ href: "/settings/profile", locale: "en" });
}
