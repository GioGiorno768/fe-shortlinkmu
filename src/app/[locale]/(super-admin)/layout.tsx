import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck>
      <DashboardLayout role="super-admin">{children}</DashboardLayout>
    </DashboardAuthCheck>
  );
}
