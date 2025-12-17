"use client";

import { useState, useEffect, useCallback } from "react";
import * as headerService from "@/services/headerService";
import type { HeaderStats } from "@/types/type";

/**
 * Hook for header stats with caching and background refresh.
 * Shows cached data immediately, fetches in background.
 */
export function useHeaderStats() {
  const [stats, setStats] = useState<HeaderStats>({
    balance: 0,
    payout: 0,
    cpm: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      // Try to show cached first (instant)
      const cached = headerService.getCachedHeaderStats();
      if (cached) {
        setStats(cached);
        setIsLoading(false);
      }

      // Fetch fresh data
      const fresh = await headerService.getHeaderStats();
      setStats(fresh);
    } catch (error) {
      console.error("Failed to fetch header stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Force refresh
  const refresh = useCallback(async () => {
    setIsLoading(true);
    const fresh = await headerService.refreshHeaderStats();
    setStats(fresh);
    setIsLoading(false);
  }, []);

  return {
    stats,
    isLoading,
    refresh,
  };
}
