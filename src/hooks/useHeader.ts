// src/hooks/useHeader.ts
"use client";

import { useState, useEffect } from "react";
import * as headerService from "@/services/headerService";
import type { HeaderStats, AdminHeaderStats } from "@/types/type";

export function useHeader(role: "member" | "admin" | "super-admin" = "member") {
  const [stats, setStats] = useState<HeaderStats | AdminHeaderStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        let data;
        if (role === "admin" || role === "super-admin") {
          data = await headerService.getAdminHeaderStats();
        } else {
          data = await headerService.getHeaderStats();
        }
        setStats(data);
      } catch (error) {
        console.error("Gagal load header stats", error);
        // Opsional: Set default 0 kalo error
        if (role === "admin" || role === "super-admin") {
          setStats({
            pendingWithdrawals: 0,
            abuseReports: 0,
            newUsers: 0,
          });
        } else {
          setStats({ balance: 0, payout: 0, cpm: 0 });
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [role]);

  return { stats, isLoading };
}
