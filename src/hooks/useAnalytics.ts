// src/hooks/useAnalytics.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import * as analyticsService from "@/services/analyticsService";
import type { StatCardData } from "@/components/dashboard/SharedStatsGrid";
import { DollarSign, Eye, UserPlus2, TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

// Range types
export type AnalyticsRange = "perWeek" | "perMonth" | "perYear" | "lifetime";
export type ChartMetric = "clicks" | "earnings" | "valid_clicks";

// Query keys for React Query
export const analyticsKeys = {
  all: ["analytics"] as const,
  stats: (range: AnalyticsRange) =>
    [...analyticsKeys.all, "stats", range] as const,
  chart: (range: AnalyticsRange, metric: ChartMetric) =>
    [...analyticsKeys.all, "chart", range, metric] as const,
  history: () => [...analyticsKeys.all, "history"] as const,
};

export function useAnalytics() {
  const t = useTranslations("Dashboard");

  // 💱 Use global currency context
  const { format: formatCurrency } = useCurrency();

  // Controls (filters)
  const [range, setRange] = useState<AnalyticsRange>("perMonth");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("clicks");

  // Helper: Format number
  const formatNumber = useCallback(
    (val: number) => val.toLocaleString("en-US"),
    []
  );

  // Helper: Get sub label based on range
  const getSubLabel = useCallback(
    (rangeVal: AnalyticsRange) => {
      switch (rangeVal) {
        case "perWeek":
          return t("perWeek");
        case "perMonth":
          return t("perMonth");
        case "perYear":
          return t("perYear");
        case "lifetime":
          return t("allTime");
        default:
          return t("perMonth");
      }
    },
    [t]
  );

  // 1. Query: Summary Stats (for SharedStatsGrid)
  const {
    data: statsData,
    isLoading: statsLoading,
    isFetching: statsFetching,
    error: statsError,
  } = useQuery({
    queryKey: analyticsKeys.stats(range),
    queryFn: () => analyticsService.getSummaryStats(range),
    staleTime: 2 * 60 * 1000, // 2 minutes (matches backend cache)
  });

  // Transform stats data to StatCardData format
  const statsCards: StatCardData[] = useMemo(() => {
    if (!statsData) return [];

    const subLabel = getSubLabel(range);

    return [
      {
        id: "earnings",
        title: t("totalEarnings"),
        value: formatCurrency(statsData.earnings.total_earnings),
        subLabel: subLabel,
        icon: DollarSign,
        color: "green",
      },
      {
        id: "views",
        title: t("totalViews"),
        value: formatNumber(statsData.clicks.total_clicks),
        subLabel: subLabel,
        icon: Eye,
        color: "blue",
      },
      {
        id: "referrals",
        title: t("referral"),
        value: formatNumber(statsData.referrals.referral_count),
        subLabel: subLabel,
        icon: UserPlus2,
        color: "purple",
      },
      {
        id: "cpm",
        title: t("avgCPM"),
        value: formatCurrency(statsData.cpm.average_cpm),
        subLabel: subLabel,
        icon: TrendingUp,
        color: "orange",
      },
    ];
  }, [statsData, range, t, getSubLabel, formatCurrency, formatNumber]);

  // 2. Query: Chart Data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: analyticsKeys.chart(range, chartMetric),
    queryFn: async () => {
      // Determine group_by based on range
      let groupBy: "day" | "week" | "month" = "day";
      if (range === "perMonth") groupBy = "day";
      else if (range === "perYear") groupBy = "month";
      else if (range === "lifetime") groupBy = "month";

      return analyticsService.getAnalyticsData(range, chartMetric, groupBy);
    },
    staleTime: 2 * 60 * 1000,
  });

  // 3. Query: Traffic History (trailing 12 months)
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: analyticsKeys.history(),
    queryFn: () => analyticsService.getTrafficHistory("per12Months"),
    staleTime: 5 * 60 * 1000, // 5 minutes for history (less frequently changing)
  });

  // Query Client for manual refetch
  const queryClient = useQueryClient();

  // Refetch all analytics data
  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
  }, [queryClient]);

  // Combined fetching state for refresh button
  const isRefetching = statsFetching || chartLoading || historyLoading;

  return {
    // Data
    statsCards,
    chartData: chartData ?? null,
    history: history ?? null,

    // Loading States
    statsLoading,
    chartLoading,
    historyLoading,
    isRefetching,

    // Error
    error: statsError ? "Failed to load stats" : null,

    // Filters & Controls
    range,
    setRange,
    chartMetric,
    setChartMetric,

    // Actions
    refetchAll,
  };
}
