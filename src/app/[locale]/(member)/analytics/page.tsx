// src/app/[locale]/(member)/analytics/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { BanknoteArrowUp, Eye, DollarSign, UserPlus2 } from "lucide-react";

// Components
import StatsCard from "@/components/dashboard/analytics/StatsCard";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopCountriesCard from "@/components/dashboard/analytics/TopCountriesCard";
import TopReferrersCard from "@/components/dashboard/analytics/TopReferrersCard";
import TrafficHistory from "@/components/dashboard/analytics/TrafficHistory";

// Hook
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard");

  // Panggil semua logic dari custom hook
  const {
    chartData,
    countries,
    referrers,
    history,
    chartLoading,
    range,
    stat,
    setRange,
    setStat,
  } = useAnalytics();

  // Konfigurasi Stats Card (Tetap di sini karena berhubungan sama UI/Icon/Translation)
  const statsCards = [
    {
      icon: BanknoteArrowUp,
      color: ["text-bluelight", "bg-blue-dashboard", "border-bluelight"],
      label: t("totalEarnings"),
      apiEndpoint: "/api/stats/earnings",
    },
    {
      icon: Eye,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("totalViews"),
      apiEndpoint: "/api/stats/totalViews",
    },
    {
      icon: UserPlus2,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("referral"),
      apiEndpoint: "/api/stats/referral",
    },
    {
      icon: DollarSign,
      color: ["text-yellow-600", "bg-yellow-100", "border-yellow-500"],
      label: t("avgCPM"),
      apiEndpoint: "/api/stats/avg-cpm",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <div className="space-y-6">
        {/* 1. Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 custom:grid-cols-4 gap-6">
          {statsCards.map((card) => (
            <StatsCard
              key={card.label}
              icon={card.icon}
              color={card.color}
              label={card.label}
              apiEndpoint={card.apiEndpoint}
            />
          ))}
        </div>

        {/* 2. Main Chart */}
        <div className="w-full">
          <LinkAnalyticsCard
            data={chartData}
            isLoading={chartLoading}
            error={null}
            range={range}
            stat={stat}
            onChangeRange={setRange}
            onChangeStat={setStat}
          />
        </div>

        {/* 3. Top Countries & Referrers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[380px]">
            <TopCountriesCard data={countries} />
          </div>
          <div className="h-[380px]">
            <TopReferrersCard data={referrers} />
          </div>
        </div>

        {/* 4. Traffic History */}
        <div id="monthly-performance" className="w-full scroll-mt-32">
          <TrafficHistory data={history} />
        </div>
      </div>
    </div>
  );
}
