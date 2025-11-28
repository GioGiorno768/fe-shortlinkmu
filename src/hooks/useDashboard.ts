// src/hooks/useDashboard.ts
"use client";

import { useState, useEffect } from "react";
import * as dashboardService from "@/services/dashboardService";
import type {
  DashboardSlide,
  MilestoneData,
  ReferralCardData,
  TopTrafficStats,
  TopPerformingLink,
  AnalyticsData,
  TimeRange,
  StatType,
} from "@/types/type";

export function useDashboard() {
  // State Data Statis (Load sekali pas mount)
  const [slides, setSlides] = useState<DashboardSlide[]>([]);
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);
  const [referralData, setReferralData] = useState<ReferralCardData | null>(
    null
  );
  const [trafficStats, setTrafficStats] = useState<TopTrafficStats | null>(
    null
  );
  const [topLinks, setTopLinks] = useState<TopPerformingLink[] | null>(null);

  // State Analytics (Bisa berubah2 via filter)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsRange, setAnalyticsRange] = useState<TimeRange>("perWeek");
  const [analyticsStat, setAnalyticsStat] = useState<StatType>("totalViews");

  // 1. Fetch Data Awal (Sekali jalan)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [slidesData, milestoneData, refData, trafficData, linksData] =
          await Promise.all([
            dashboardService.getSlides(),
            dashboardService.getMilestone(),
            dashboardService.getReferralData(),
            dashboardService.getTrafficStats(),
            dashboardService.getTopLinks(),
          ]);

        setSlides(slidesData);
        setMilestone(milestoneData);
        setReferralData(refData);
        setTrafficStats(trafficData);
        setTopLinks(linksData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    loadInitialData();
  }, []);

  // 2. Fetch Analytics (Jalan setiap filter berubah)
  useEffect(() => {
    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const data = await dashboardService.getAnalytics(
          analyticsRange,
          analyticsStat
        );
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, [analyticsRange, analyticsStat]);

  return {
    // Data
    slides,
    milestone,
    referralData,
    trafficStats,
    topLinks,
    analyticsData,

    // Analytics Controls
    analyticsLoading,
    analyticsRange,
    analyticsStat,
    setAnalyticsRange,
    setAnalyticsStat,
  };
}
