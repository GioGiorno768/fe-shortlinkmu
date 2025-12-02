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

export const getAdminActivities = async (): Promise<{
  withdrawals: import("@/types/type").RecentWithdrawal[];
  users: import("@/types/type").RecentUser[];
}> => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    withdrawals: [
      {
        id: "wd-1",
        user: {
          id: "u-101",
          name: "Budi Santoso",
          email: "budi@gmail.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
          level: "Rookie",
        },
        amount: 50.0,
        method: "PayPal",
        accountNumber: "budi@gmail.com",
        status: "pending",
        date: new Date().toISOString(),
        riskScore: "safe",
      },
      {
        id: "wd-2",
        user: {
          id: "u-102",
          name: "Siti Aminah",
          email: "siti@yahoo.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
          level: "Elite",
        },
        amount: 25.5,
        method: "Bank Transfer",
        accountNumber: "1234567890",
        status: "pending",
        date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        riskScore: "medium",
      },
      {
        id: "wd-3",
        user: {
          id: "u-103",
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          level: "Pro",
        },
        amount: 100.0,
        method: "Crypto (USDT)",
        accountNumber: "TRC20-XYZ123",
        status: "approved",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        processed_by: "Admin A",
        riskScore: "safe",
      },
      {
        id: "wd-4",
        user: {
          id: "u-104",
          name: "Michael Jordan",
          email: "mj@bulls.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
          level: "Mythic",
        },
        amount: 500.0,
        method: "PayPal",
        accountNumber: "mj@bulls.com",
        status: "paid",
        date: new Date(Date.now() - 90000000).toISOString(),
        processed_by: "Super Admin",
        riskScore: "safe",
      },
      {
        id: "wd-5",
        user: {
          id: "u-105",
          name: "Elon Musk",
          email: "elon@x.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elon",
          level: "Master",
        },
        amount: 1200.0,
        method: "Crypto (BTC)",
        accountNumber: "BTC-ABC987",
        status: "pending",
        date: new Date(Date.now() - 95000000).toISOString(),
        riskScore: "high",
      },
      {
        id: "wd-6",
        user: {
          id: "u-106",
          name: "Mark Zuckerberg",
          email: "mark@meta.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
          level: "Elite",
        },
        amount: 350.0,
        method: "Bank Transfer",
        accountNumber: "9876543210",
        status: "rejected",
        date: new Date(Date.now() - 100000000).toISOString(),
        processed_by: "Admin B",
        riskScore: "medium",
      },
      {
        id: "wd-7",
        user: {
          id: "u-107",
          name: "Bill Gates",
          email: "bill@microsoft.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bill",
          level: "Mythic",
        },
        amount: 45.0,
        method: "PayPal",
        accountNumber: "bill@microsoft.com",
        status: "paid",
        date: new Date(Date.now() - 110000000).toISOString(),
        processed_by: "Admin A",
        riskScore: "safe",
      },
      {
        id: "wd-8",
        user: {
          id: "u-108",
          name: "Jeff Bezos",
          email: "jeff@amazon.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff",
          level: "Rookie",
        },
        amount: 99.9,
        method: "Bank Transfer",
        accountNumber: "1122334455",
        status: "pending",
        date: new Date(Date.now() - 120000000).toISOString(),
        riskScore: "safe",
      },
    ],
    users: [
      {
        id: "u-1",
        name: "Asep Knalpot",
        email: "asep@racing.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Asep",
        joinedAt: new Date().toISOString(),
        status: "active",
      },
      {
        id: "u-2",
        name: "Rina Nose",
        email: "rina@tv.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
        joinedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        status: "active",
      },
      {
        id: "u-3",
        name: "Spammer Bot",
        email: "bot@spam.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bot",
        joinedAt: new Date(Date.now() - 10000000).toISOString(),
        status: "suspended",
      },
      {
        id: "u-4",
        name: "User Baru 1",
        email: "user1@test.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1",
        joinedAt: new Date(Date.now() - 15000000).toISOString(),
        status: "active",
      },
      {
        id: "u-5",
        name: "User Baru 2",
        email: "user2@test.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User2",
        joinedAt: new Date(Date.now() - 20000000).toISOString(),
        status: "active",
      },
      {
        id: "u-6",
        name: "User Baru 3",
        email: "user3@test.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User3",
        joinedAt: new Date(Date.now() - 25000000).toISOString(),
        status: "active",
      },
      {
        id: "u-7",
        name: "User Baru 4",
        email: "user4@test.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User4",
        joinedAt: new Date(Date.now() - 30000000).toISOString(),
        status: "active",
      },
      {
        id: "u-8",
        name: "User Baru 5",
        email: "user5@test.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User5",
        joinedAt: new Date(Date.now() - 35000000).toISOString(),
        status: "active",
      },
    ],
  };
};
