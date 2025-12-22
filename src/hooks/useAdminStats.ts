"use client";

import { useState, useEffect } from "react";
import * as headerService from "@/services/headerService";
import type { AdminHeaderStats } from "@/types/type";

/**
 * Hook to fetch admin header stats
 * @param enabled - Set to false to skip API call (for non-admin users)
 */
export function useAdminStats(enabled: boolean = true) {
  const [stats, setStats] = useState<AdminHeaderStats | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    // Skip API call if not enabled (non-admin user)
    if (!enabled) {
      setStats({ pendingWithdrawals: 0, abuseReports: 0, newUsers: 0 });
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        const data = await headerService.getAdminHeaderStats();
        setStats(data);
      } catch (error) {
        console.error("Gagal load admin stats", error);
        // Default value kalo error
        setStats({ pendingWithdrawals: 0, abuseReports: 0, newUsers: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [enabled]);

  return { stats, isLoading };
}
