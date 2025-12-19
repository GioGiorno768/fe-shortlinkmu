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

// --- API BASE URL ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper: Get auth token (matches withdrawalService.ts pattern)
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // First check sessionStorage
  let token = sessionStorage.getItem("auth_token");

  // If not in sessionStorage, try to get from cookie
  if (!token) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token" && value) {
        token = value;
        break;
      }
    }
  }

  return token;
}

// Helper: Auth headers
function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper untuk API call
const apiCall = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: authHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
};

// --- SLIDES: HARDCODED (Static, no fetch needed) ---
export const DASHBOARD_SLIDES: DashboardSlide[] = [
  {
    id: "welcome",
    title: "Selamat Datang! 👋",
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
    link: "/levels",
    icon: Megaphone,
    theme: "purple",
  },
  {
    id: "feature",
    title: "Withdraw via Crypto 💎",
    desc: "Kabar gembira! Sekarang kamu bisa menarik saldo ke wallet USDT (TRC20) dengan fee rendah.",
    cta: "Atur Payment",
    link: "/settings#payment",
    icon: Wallet,
    theme: "orange",
  },
];

// --- MILESTONE: Connect to /api/user/levels ---
export const getMilestone = async (): Promise<MilestoneData> => {
  try {
    const data = await apiCall<{
      card: {
        current_level: string;
        current_level_name: string;
        current_earnings: number;
        current_level_cpm: number;
        next_level_name: string | null;
        next_level_min: number;
        next_level_cpm: number;
        progress_percent: number;
      };
    }>("/user/levels");

    return {
      icon: Star,
      currentLevel: data.card.current_level_name,
      nextLevel: data.card.next_level_name || "Max Level",
      currentEarnings: data.card.current_earnings,
      nextTarget: data.card.next_level_min,
      currentBonus: data.card.current_level_cpm,
      nextBonus: data.card.next_level_cpm,
      progress: data.card.progress_percent,
    };
  } catch (error) {
    console.error("Failed to fetch milestone data:", error);
    // Fallback data
    return {
      icon: Star,
      currentLevel: "Beginner",
      nextLevel: "Rookie",
      currentEarnings: 0,
      nextTarget: 50,
      currentBonus: 0,
      nextBonus: 5,
      progress: 0,
    };
  }
};

// --- REFERRAL: Connect to /api/dashboard/overview ---
export const getReferralData = async (): Promise<ReferralCardData> => {
  try {
    const data = await apiCall<{
      referral: {
        code: string;
        users: number;
      };
    }>("/dashboard/overview");

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://shortlinkmu.com";

    return {
      referralLink: `${baseUrl}/register?ref=${data.referral.code}`,
      totalUsers: data.referral.users,
    };
  } catch (error) {
    console.error("Failed to fetch referral data:", error);
    return {
      referralLink: "",
      totalUsers: 0,
    };
  }
};

export const getTrafficStats = async (): Promise<TopTrafficStats> => {
  try {
    const data = await apiCall<{
      items: {
        month: string;
        label: string;
        valid_clicks: number;
        earnings: number;
        average_cpm: number;
        user_level: string;
        level_cpm_bonus: number;
      }[];
    }>("/analytics/monthly-performance?range=12months");

    // Find the month with highest activity
    // Priority: earnings > valid_clicks (earnings is more reliable indicator)
    // Edge case: if all months have 0 data, use current month (last in array)
    const hasAnyActivity = data.items.some(
      (item) => item.earnings > 0 || item.valid_clicks > 0
    );

    let topMonth;
    if (!hasAnyActivity) {
      // If no activity at all, show current month instead of defaulting to January
      topMonth = data.items[data.items.length - 1];
    } else {
      topMonth = data.items.reduce((max, item) => {
        // If current item has higher earnings, it's the top
        if (item.earnings > (max?.earnings || 0)) {
          return item;
        }
        // If earnings are equal, compare valid_clicks
        if (
          item.earnings === (max?.earnings || 0) &&
          item.valid_clicks > (max?.valid_clicks || 0)
        ) {
          return item;
        }
        return max;
      }, data.items[0]);
    }

    // Get current month's level (last item in array)
    const currentMonth = data.items[data.items.length - 1];

    // Calculate total views this year
    const totalViewsYear = data.items.reduce(
      (sum, item) => sum + item.valid_clicks,
      0
    );

    // Extract month name only (remove year from "December 2025" -> "December")
    const monthLabel = topMonth?.label || "N/A";
    const monthNameOnly = monthLabel.split(" ")[0]; // Get first word (month name)

    return {
      topMonth: {
        month: monthNameOnly,
        views: topMonth?.valid_clicks || 0,
      },
      topYear: {
        year: new Date().getFullYear().toString(),
        views: totalViewsYear,
      },
      topLevel: {
        level: (currentMonth?.user_level?.toLowerCase() || "beginner") as any,
        cpmBonusPercent: currentMonth?.level_cpm_bonus || 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch traffic stats:", error);
    return {
      topMonth: { month: "N/A", views: 0 },
      topYear: { year: new Date().getFullYear().toString(), views: 0 },
      topLevel: { level: "beginner", cpmBonusPercent: 0 },
    };
  }
};

// --- TOP LINKS: Connect to /api/dashboard/overview (limit 10) ---
export const getTopLinks = async (): Promise<TopPerformingLink[]> => {
  try {
    const data = await apiCall<{
      top_links: {
        id: number;
        title: string | null;
        short_url: string;
        original_url: string;
        views: number;
        valid_views: number;
        earnings: number;
        cpm: number;
      }[];
    }>("/dashboard/overview");

    // Viewer app base URL (shortlink redirector)
    const viewerBaseUrl =
      process.env.NEXT_PUBLIC_VIEWER_URL || "http://localhost:3000";

    let untitledCounter = 0;
    return data.top_links.slice(0, 10).map((link) => {
      // Extract code from backend URL: "http://localhost:8000/links/{code}" -> "{code}"
      const urlParts = link.short_url.split("/");
      const code = urlParts[urlParts.length - 1]; // Get last segment as code
      const cleanShortUrl = `${viewerBaseUrl}/${code}`;

      // Use title from backend, or "Untitled" with counter if no title
      let displayTitle = link.title;
      if (!displayTitle || displayTitle.trim() === "") {
        untitledCounter++;
        displayTitle = `Untitled ${untitledCounter}`;
      }

      return {
        id: link.id.toString(),
        title: displayTitle,
        shortUrl: cleanShortUrl,
        originalUrl: link.original_url,
        validViews: link.valid_views,
        totalEarnings: link.earnings,
        cpm: link.cpm,
        adsLevel: "level1", // Default
      };
    });
  } catch (error) {
    console.error("Failed to fetch top links:", error);
    return [];
  }
};

// --- ANALYTICS: Connect to /api/dashboard/analytics (Weekly Only) ---
export const getAnalytics = async (
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> => {
  try {
    // Map stat type to backend metric
    const metricMap: Record<StatType, string> = {
      totalViews: "valid_clicks",
      totalEarnings: "earnings",
      totalReferral: "valid_clicks", // Referral uses same metric for now
    };

    const metric = metricMap[stat];

    // Always fetch weekly data for dashboard (Mon-Sun)
    const data = await apiCall<{
      metric: string;
      points: { label: string; value: number; date: string }[];
      total: number;
    }>(`/dashboard/analytics?range=week&metric=${metric}&group_by=day`);

    // Extract labels and values
    const categories = data.points.map((p) => p.label);
    const values = data.points.map((p) => p.value);

    // Get stat name for chart legend
    let statName = "Valid Clicks";
    if (stat === "totalEarnings") statName = "Earnings";
    if (stat === "totalReferral") statName = "Referrals";

    return {
      series: [{ name: statName, data: values }],
      categories,
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    // Return empty data
    return {
      series: [{ name: "Data", data: [] }],
      categories: [],
    };
  }
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
  links: import("@/types/type").AdminLink[];
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
    links: Array.from({ length: 10 }, (_, i) => ({
      id: `link-${i}`,
      title: `Link ${i}`,
      shortUrl: `short.link/xyz${i}`,
      originalUrl: `https://example.com/long/url/${i}`,
      owner: {
        id: `user-${i}`,
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      },
      views: Math.floor(Math.random() * 1000),
      earnings: parseFloat((Math.random() * 10).toFixed(2)),
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      status: i % 5 === 0 ? "disabled" : "active",
      adsLevel: "level1",
    })),
  };
};
