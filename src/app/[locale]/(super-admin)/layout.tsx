import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👇 INI RAHASIANYA: Kita pasang role="super-admin"
  // Otomatis DashboardLayout bakal ngambil menu khusus Super Admin dari 'src/lib/menus.ts'
  return <DashboardLayout role="super-admin">{children}</DashboardLayout>;
}
