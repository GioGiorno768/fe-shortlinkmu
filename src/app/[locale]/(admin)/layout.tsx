// src/app/[locale]/(admin)/layout.tsx
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck>
      <DashboardLayout role="admin">{children}</DashboardLayout>
    </DashboardAuthCheck>
  );
}
