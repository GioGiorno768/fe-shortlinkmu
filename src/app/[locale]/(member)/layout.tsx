// src/app/[locale]/(member)/layout.tsx
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck>
      <DashboardLayout role="member">{children}</DashboardLayout>
    </DashboardAuthCheck>
  );
}
