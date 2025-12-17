// src/app/[locale]/(member)/analytics/page.tsx
"use client";

import { useTranslations } from "next-intl";

// Components
import AnalyticsHeader from "@/components/dashboard/analytics/AnalyticsHeader";
import SharedStatsGrid from "@/components/dashboard/SharedStatsGrid";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
// TODO: Enable when visitor tracking is implemented
// import TopCountriesCard from "@/components/dashboard/analytics/TopCountriesCard";
// import TopReferrersCard from "@/components/dashboard/analytics/TopReferrersCard";
import TrafficHistory from "@/components/dashboard/analytics/TrafficHistory";

// Hook
import { useAnalytics, type AnalyticsRange } from "@/hooks/useAnalytics";
import type { StatType } from "@/types/type";

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard");

  const {
    statsCards,
    chartData,
    history,
    statsLoading,
    chartLoading,
    isRefetching,
    range,
    setRange,
    chartMetric,
    setChartMetric,
    refetchAll,
  } = useAnalytics();

  // Map chartMetric to StatType for LinkAnalyticsCard
  const metricToStatType: Record<string, StatType> = {
    clicks: "totalViews",
    earnings: "totalEarnings",
    valid_clicks: "totalViews",
  };

  const handleStatChange = (newStat: StatType) => {
    const map: Record<StatType, "clicks" | "earnings" | "valid_clicks"> = {
      totalViews: "clicks",
      totalEarnings: "earnings",
      totalReferral: "clicks", // fallback
    };
    setChartMetric(map[newStat] || "clicks");
  };

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <div className="space-y-6">
        {/* 0. Header with Title & Range Filter */}
        <AnalyticsHeader
          range={range}
          onRangeChange={setRange}
          onRefresh={refetchAll}
          isRefetching={isRefetching}
        />

        {/* 1. Stats Cards - Now using SharedStatsGrid */}
        <SharedStatsGrid
          cards={statsCards}
          isLoading={statsLoading}
          columns={4}
        />

        {/* 2. Main Chart - Range controlled by header, only stat selector here */}
        <div className="w-full">
          <LinkAnalyticsCard
            data={chartData}
            isLoading={chartLoading}
            error={null}
            stat={metricToStatType[chartMetric]}
            onChangeStat={handleStatChange}
            hideRangeFilter // Hide range filter since it's in header now
          />
        </div>

        {/* 3. Top Countries & Referrers - TODO: Enable when visitor tracking is implemented */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[380px]">
            <TopCountriesCard data={countries} />
          </div>
          <div className="h-[380px]">
            <TopReferrersCard data={referrers} />
          </div>
        </div> */}

        {/* 4. Traffic History */}
        <div id="monthly-performance" className="w-full scroll-mt-32">
          <TrafficHistory data={history} />
        </div>
      </div>
    </div>
  );
}
