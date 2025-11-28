// src/app/[locale]/(member)/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BanknoteArrowUp, Eye, DollarSign, UserPlus2 } from "lucide-react";

// Import Types
import type {
  AnalyticsData,
  CountryStat,
  ReferrerStat,
  MonthlyStat,
  TimeRange,
  StatType,
} from "@/types/type";
import StatsCard from "@/components/dashboard/analytics/StatsCard";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopCountriesCard from "@/components/dashboard/analytics/TopCountriesCard";
import TopReferrersCard from "@/components/dashboard/analytics/TopReferrersCard";
import TrafficHistory from "@/components/dashboard/analytics/TrafficHistory";

// --- MOCK FETCH FUNCTIONS ---
// 1. Fetch Main Analytics (Chart)
// --- 6. DATA DUMMY ANALYTICS (Simulasi API) ---
// Logic ini dipindahin dari dalam komponen card
async function fetchAnalyticsData(
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> {
  console.log(`MANGGIL API: /api/analytics?range=${range}&stat=${stat}`);
  await new Promise((resolve) => setTimeout(resolve, 700));

  let data: AnalyticsData = {
    series: [{ name: "Data", data: [] }],
    categories: [],
  };

  // Label Chart
  let statName = "Total Views";
  if (stat === "totalEarnings") statName = "Earnings";
  if (stat === "totalReferral") statName = "New Referrals";

  // Dummy Data berdasarkan Range
  if (range === "perWeek") {
    data = {
      series: [{ name: statName, data: [10, 41, 35, 51, 49, 62, 69] }],
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  } else if (range === "perMonth") {
    data = {
      series: [
        {
          name: statName,
          data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 100, 80, 110],
        },
      ],
      categories: [
        "Wk1",
        "Wk2",
        "Wk3",
        "Wk4",
        "Wk5",
        "Wk6",
        "Wk7",
        "Wk8",
        "Wk9",
        "Wk10",
        "Wk11",
        "Wk12",
      ],
    };
  } else {
    // perYear
    data = {
      series: [
        {
          name: statName,
          data: [300, 400, 250, 500, 490, 600, 700, 910, 1250, 1000, 800, 1100],
        },
      ],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  }

  // Modifikasi angka berdasarkan Stat Type biar kelihatan beda
  if (stat === "totalEarnings") {
    data.series[0].data = data.series[0].data.map((n) =>
      parseFloat((n / 10).toFixed(2))
    );
  } else if (stat === "totalViews") {
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n * 0.8));
  } else if (stat === "totalReferral") {
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n / 15));
  }

  return data;
}

// 2. Fetch Top Countries
async function fetchTopCountries(): Promise<CountryStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { isoCode: "id", name: "Indonesia", views: 40500, percentage: 45.5 },
    { isoCode: "us", name: "United States", views: 22000, percentage: 24.7 },
    { isoCode: "gb", name: "United Kingdom", views: 5000, percentage: 5.5 },
  ];
}

// 3. Fetch Top Referrers
async function fetchTopReferrers(): Promise<ReferrerStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    { name: "Google", views: 35000, percentage: 40.2 },
    { name: "Direct", views: 22000, percentage: 25.3 },
    { name: "Facebook", views: 15000, percentage: 17.2 },
  ];
}

// 4. Fetch Traffic History (Monthly)
async function fetchTrafficHistory(): Promise<MonthlyStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    {
      month: "Feb",
      year: 2025,
      views: 405123,
      cpm: 4.5,
      earnings: 1823.05,
      level: "Mythic",
      growth: 12.5,
    },
    {
      month: "Jan",
      year: 2025,
      views: 360050,
      cpm: 3.8,
      earnings: 1368.19,
      level: "Master",
      growth: 5.2,
    },
    // ... data lain
  ];
}

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard");

  // --- STATE MANAGEMENT ---
  // Chart State
  const [chartData, setChartData] = useState<AnalyticsData | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("perWeek");
  const [stat, setStat] = useState<StatType>("totalViews");

  // Other Cards State
  const [countries, setCountries] = useState<CountryStat[] | null>(null);
  const [referrers, setReferrers] = useState<ReferrerStat[] | null>(null);
  const [history, setHistory] = useState<MonthlyStat[] | null>(null);

  // Fetch Initial Data (Page Load)
  useEffect(() => {
    async function loadAll() {
      // Fetch Paralel
      const [countriesData, referrersData, historyData] = await Promise.all([
        fetchTopCountries(),
        fetchTopReferrers(),
        fetchTrafficHistory(),
      ]);

      setCountries(countriesData);
      setReferrers(referrersData);
      setHistory(historyData);
    }
    loadAll();
  }, []);

  // Fetch Chart Data (Re-fetch pas filter ganti)
  useEffect(() => {
    async function loadChart() {
      setChartLoading(true);
      const res = await fetchAnalyticsData(range, stat);
      setChartData(res);
      setChartLoading(false);
    }
    loadChart();
  }, [range, stat]);

  // Stats Cards (Masih pake internal fetch krn simpel, tp bisa diangkat jg klo mau)
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

        {/* 2. Main Chart (Props Controlled) */}
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

        {/* 3. Top Countries & Referrers (Props Controlled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[380px]">
            <TopCountriesCard data={countries} />
          </div>
          <div className="h-[380px]">
            <TopReferrersCard data={referrers} />
          </div>
        </div>

        {/* 4. Traffic History (Props Controlled) */}
        <div id="monthly-performance" className="w-full scroll-mt-32">
          <TrafficHistory data={history} />
        </div>
      </div>
    </div>
  );
}
