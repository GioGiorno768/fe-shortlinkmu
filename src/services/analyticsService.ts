// src/services/analyticsService.ts
import type {
  AnalyticsData,
  CountryStat,
  ReferrerStat,
  MonthlyStat,
  TimeRange,
  StatType,
} from "@/types/type";

// --- MOCK API CALLS (Nanti ganti fetch ke Laravel di sini) ---

export async function getAnalyticsData(
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> {
  // Simulasi delay
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

  // Modifikasi angka dikit biar variatif
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

export async function getTopCountries(): Promise<CountryStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulasi loading
  return [
    { isoCode: "id", name: "Indonesia", views: 40500, percentage: 45.5 },
    { isoCode: "us", name: "United States", views: 22000, percentage: 24.7 },
    { isoCode: "in", name: "India", views: 8000, percentage: 9.0 },
    { isoCode: "my", name: "Malaysia", views: 5500, percentage: 6.2 },
    { isoCode: "sg", name: "Singapore", views: 3000, percentage: 3.4 },
    { isoCode: "gb", name: "United Kingdom", views: 2000, percentage: 2.2 },
    { isoCode: "au", name: "Australia", views: 1500, percentage: 1.7 },
    { isoCode: "de", name: "Germany", views: 1000, percentage: 1.1 },
  ];
}

export async function getTopReferrers(): Promise<ReferrerStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi loading
  return [
    { name: "Google", views: 35000, percentage: 40.2 },
    { name: "Direct", views: 22000, percentage: 25.3 },
    { name: "Facebook", views: 15000, percentage: 17.2 },
    { name: "Twitter / X.com", views: 8000, percentage: 9.2 },
    { name: "detik.com", views: 4000, percentage: 4.6 },
    { name: "github.com", views: 3000, percentage: 3.5 },
  ];
}

export async function getTrafficHistory(): Promise<MonthlyStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

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
    {
      month: "Dec",
      year: 2024,
      views: 342100,
      cpm: 3.5,
      earnings: 1197.35,
      level: "Pro",
      growth: -2.1,
    },
    {
      month: "Nov",
      year: 2024,
      views: 350000,
      cpm: 3.5,
      earnings: 1225.0,
      level: "Pro",
      growth: 8.4,
    },
    {
      month: "Oct",
      year: 2024,
      views: 322500,
      cpm: 3.2,
      earnings: 1032.0,
      level: "Elite",
      growth: 1.5,
    },
  ];
}
