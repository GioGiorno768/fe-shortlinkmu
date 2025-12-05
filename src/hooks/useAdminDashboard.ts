"use client";

import { useState, useEffect } from "react";
import * as dashboardService from "@/services/dashboardService";
import type {
  AdminDashboardStats,
  RecentWithdrawal,
  RecentUser,
} from "@/types/type";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activities, setActivities] = useState<{
    withdrawals: RecentWithdrawal[];
    users: RecentUser[];
    links: import("@/types/type").AdminLink[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activitiesData] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getAdminActivities(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Gagal load admin dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return { stats, activities, isLoading };
}
