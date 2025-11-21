// src/app/[locale]/(member)/layout.tsx
import DashboardLayout from "@/components/dashboard/DashboardLayout";
// Hapus import getMemberMenu dan useTranslations

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kita cuma kasih tau role-nya aja, biarin DashboardLayout yang mikir menunya
  return <DashboardLayout role="member">{children}</DashboardLayout>;
}
