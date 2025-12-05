// src/app/[locale]/(admin)/admin/dashboard/page.tsx
"use client";

import TopStatsCards from "@/components/dashboard/admin/dashboardAdmin/TopStatsCards";
import RecentActivities from "@/components/dashboard/admin/dashboardAdmin/RecentActivities";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { stats, activities, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-8">
      {/* 1. Top Stats */}
      <TopStatsCards data={stats} isLoading={isLoading} />

      {/* 2. Recent Activities */}
      <RecentActivities
        withdrawals={activities?.withdrawals || []}
        users={activities?.users || []}
        links={activities?.links || []}
        isLoading={isLoading}
      />
    </div>
  );
}
