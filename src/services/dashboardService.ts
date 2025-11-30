// src/services/dashboardService.ts
import type {
  DashboardSlide,
  MilestoneData,
  ReferralCardData,
  TopTrafficStats,
  TopPerformingLink,
  AnalyticsData,
  TimeRange,
  StatType,
  AdminDashboardStats,
} from "@/types/type";
import { Sparkles, Megaphone, Wallet, Star } from "lucide-react";

// --- MOCK API CALLS ---

export const getSlides = async (): Promise<DashboardSlide[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [
    {
      id: "welcome",
      title: "Selamat Datang, Kevin! 👋",
      desc: "Semoga harimu menyenangkan. Yuk cek performa link kamu dan tingkatkan trafik hari ini!",
      cta: "Buat Link Baru",
      link: "/new-link",
      icon: Sparkles,
      theme: "blue",
    },
    {
      id: "event",
      title: "Bonus CPM Weekend! 🚀",
      desc: "Dapatkan kenaikan CPM +15% untuk semua traffic dari Indonesia khusus Sabtu & Minggu ini.",
      cta: "Lihat Info",
      link: "/ads-info",
      icon: Megaphone,
      theme: "purple",
    },
    {
      id: "feature",
      title: "Withdraw via Crypto 💎",
      desc: "Kabar gembira! Sekarang kamu bisa menarik saldo ke wallet USDT (TRC20) dengan fee rendah.",
      cta: "Atur Payment",
      link: "/settings?tab=payment",
      icon: Wallet,
      theme: "orange",
    },
  ];
};

export const getMilestone = async (): Promise<MilestoneData> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    icon: Star,
    currentLevel: "Rookie",
    nextLevel: "Elite",
    currentEarnings: 35.5,
    nextTarget: 50.0,
    currentBonus: 5,
    nextBonus: 10,
    progress: 71,
  };
};

export const getReferralData = async (): Promise<ReferralCardData> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    referralLink: "https://shortlinkmu.com/ref?id=kevin123",
    totalUsers: 25,
  };
};

export const getTrafficStats = async (): Promise<TopTrafficStats> => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    topMonth: { month: "February", views: 405123 },
    topYear: { year: "2025", views: 805678 },
    topLevel: { level: "mythic", cpmBonusPercent: 20 },
  };
};

export const getTopLinks = async (): Promise<TopPerformingLink[]> => {
  await new Promise((r) => setTimeout(r, 1200));
  return Array.from({ length: 5 }, (_, i) => ({
    id: `link-${i}`,
    title: `Link ${i}`,
    shortUrl: `short.link/${i}`,
    originalUrl: "https://example.com",
    validViews: 1000,
    totalEarnings: 50,
    cpm: 5,
    adsLevel: "level1",
  }));
};

export const getAnalytics = async (
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> => {
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
};

// === ADMIN DASHBOARD SERVICE (FINAL) ===
export const getAdminStats = async (): Promise<AdminDashboardStats> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    financial: {
      paidToday: 30.5,
      usersPaidToday: 30,
      trend: 12.0,
    },
    content: {
      linksCreatedToday: 150,
      trend: 8.5,
    },
    security: {
      linksBlockedToday: 5,
      trend: -2.4,
    },
  };
};
