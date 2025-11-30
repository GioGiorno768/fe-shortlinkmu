// src/app/[locale]/(admin)/admin/dashboard/page.tsx
"use client";

import TopStatsCards from "@/components/dashboard/admin/TopStatsCards";
import { useAdminDashboard } from "@/hooks/useAdminDashboard"; // Hook baru

export default function AdminDashboard() {
  const { stats, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-8">
      {/* 1. Top Stats */}
      <TopStatsCards data={stats} isLoading={isLoading} />

      {/* ... komponen lainnya nanti ... */}
    </div>
  );
}
