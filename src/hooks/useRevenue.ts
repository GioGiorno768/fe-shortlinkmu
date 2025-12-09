// Hook untuk Revenue Dashboard
"use client";

import { useState, useEffect } from "react";
import * as revenueService from "@/services/revenueService";
import type {
  RevenueStats,
  TopEarner,
  RevenueByLevel,
  WithdrawalTrend,
} from "@/services/revenueService";

export function useRevenue() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [topEarners, setTopEarners] = useState<TopEarner[]>([]);
  const [revenueByLevel, setRevenueByLevel] = useState<RevenueByLevel[]>([]);
  const [withdrawalTrends, setWithdrawalTrends] = useState<WithdrawalTrend[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data concurrently
        const [statsData, earnersData, levelData, trendsData] =
          await Promise.all([
            revenueService.getRevenueStats(),
            revenueService.getTopEarners(10),
            revenueService.getRevenueByAdLevel(),
            revenueService.getWithdrawalTrends(6),
          ]);

        setStats(statsData);
        setTopEarners(earnersData);
        setRevenueByLevel(levelData);
        setWithdrawalTrends(trendsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch revenue data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    stats,
    topEarners,
    revenueByLevel,
    withdrawalTrends,
    isLoading,
    error,
  };
}
