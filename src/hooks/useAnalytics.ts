// src/hooks/useAnalytics.ts
"use client";

import { useState, useEffect } from "react";
import * as analyticsService from "@/services/analyticsService";
import type {
  AnalyticsData,
  CountryStat,
  ReferrerStat,
  MonthlyStat,
  TimeRange,
  StatType,
} from "@/types/type";

export function useAnalytics() {
  // Chart States
  const [chartData, setChartData] = useState<AnalyticsData | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("perWeek");
  const [stat, setStat] = useState<StatType>("totalViews");

  // Static Data States
  const [countries, setCountries] = useState<CountryStat[] | null>(null);
  const [referrers, setReferrers] = useState<ReferrerStat[] | null>(null);
  const [history, setHistory] = useState<MonthlyStat[] | null>(null);

  // Loading awal buat card bawah (opsional, tapi bagus buat UX)
  const [initialLoading, setInitialLoading] = useState(true);

  // 1. Fetch Data Awal (Sekali jalan pas mount)
  useEffect(() => {
    async function loadAll() {
      try {
        const [countriesData, referrersData, historyData] = await Promise.all([
          analyticsService.getTopCountries(),
          analyticsService.getTopReferrers(),
          analyticsService.getTrafficHistory(),
        ]);

        setCountries(countriesData);
        setReferrers(referrersData);
        setHistory(historyData);
      } catch (error) {
        console.error("Gagal load data analytics awal:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    loadAll();
  }, []);

  // 2. Fetch Chart Data (Jalan setiap filter range/stat berubah)
  useEffect(() => {
    async function loadChart() {
      setChartLoading(true);
      try {
        const res = await analyticsService.getAnalyticsData(range, stat);
        setChartData(res);
      } catch (error) {
        console.error("Gagal load chart:", error);
      } finally {
        setChartLoading(false);
      }
    }
    loadChart();
  }, [range, stat]);

  return {
    // Data
    chartData,
    countries,
    referrers,
    history,

    // Status Loading
    chartLoading,
    initialLoading,

    // Controls
    range,
    stat,
    setRange,
    setStat,
  };
}
