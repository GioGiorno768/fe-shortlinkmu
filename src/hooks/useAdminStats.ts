"use client";

import { useState, useEffect } from "react";
import * as headerService from "@/services/headerService";
import type { AdminHeaderStats } from "@/types/type";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminHeaderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return { stats, isLoading };
}
