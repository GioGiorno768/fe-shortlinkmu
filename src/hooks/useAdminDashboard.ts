"use client";

import { useState, useEffect } from "react";
import * as dashboardService from "@/services/dashboardService";
import type { AdminDashboardStats } from "@/types/type";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Gagal load admin stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return { stats, isLoading };
}
