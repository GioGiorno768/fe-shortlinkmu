import type {
  SuperAdminStats,
  AnalyticsData,
  TimeRange,
  AuditLog,
} from "@/types/type";

export async function getSuperAdminStats(): Promise<SuperAdminStats> {
  await new Promise((r) => setTimeout(r, 600));

  return {
    financial: {
      paidToday: 1540.5, // $1,540.50
      usersPaidToday: 45, // 45 User
      trend: 12.5, // Naik 12.5%
    },
    security: {
      blockedLinksToday: 23, // 23 Link diblokir
      trend: -5.2, // Turun (Bagus)
    },
    system: {
      staffOnline: 3,
      totalStaff: 5,
    },
  };
}

export async function getSuperAdminRevenueChart(
  range: TimeRange
): Promise<AnalyticsData> {
  await new Promise((r) => setTimeout(r, 800)); // Simulasi loading

  let categories: string[] = [];
  let userEarnings: number[] = [];

  // 1. Generate Dummy Data (User Earning)
  if (range === "perWeek") {
    categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    userEarnings = [45, 52, 38, 65, 48, 55, 70]; // Data mingguan
  } else if (range === "perMonth") {
    // 4 Minggu terakhir
    categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
    userEarnings = [350, 420, 380, 450];
  } else {
    // perYear (12 Bulan)
    categories = [
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
    ];
    userEarnings = [
      1200, 1500, 1100, 1800, 2000, 1700, 2100, 2300, 1900, 2500, 2400, 2800,
    ];
  }

  // 2. Reverse Calculation (User Share = 70% atau 0.7)
  // Rumus: Real Revenue = User Earning / 0.7
  const estimatedRevenue = userEarnings.map((val) => Math.round(val / 0.7));

  return {
    categories,
    series: [
      {
        name: "Est. Platform Revenue (100%)",
        data: estimatedRevenue,
      },
      {
        name: "User Earnings (70%)",
        data: userEarnings,
      },
    ],
  };
}

export async function getRecentAuditLogs(): Promise<AuditLog[]> {
  await new Promise((r) => setTimeout(r, 700));

  return [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      adminId: "adm-1",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-1.webp",
      action: "block",
      targetType: "link",
      targetId: "link-123",
      targetName: "short.link/phishing123",
      description: "Detected as phishing site via report #RP-99",
      status: "success",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      adminId: "adm-2",
      adminName: "Budi Santoso",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-2.webp",
      action: "approve",
      targetType: "withdrawal",
      targetId: "wd-8821",
      targetName: "WD-8821 ($50.00)",
      description: "Payment sent via PayPal",
      status: "success",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      adminId: "adm-3",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-3.webp",
      action: "update",
      targetType: "announcement",
      targetId: "ann-123",
      targetName: "Maintenance Notice",
      description: "Posted new announcement about server maintenance",
      status: "success",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      adminId: "adm-1",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-4.webp",
      action: "reject",
      targetType: "withdrawal",
      targetId: "wd-8890",
      targetName: "WD-8890 ($120.00)",
      description: "Invalid payment details (Bank ID not found)",
      status: "failed",
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      adminId: "adm-2",
      adminName: "Budi Santoso",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-2.webp",
      action: "create",
      targetType: "user",
      targetId: "user-spam01",
      targetName: "User: spammer01",
      description: "Sent warning about traffic quality",
      status: "success",
    },
  ];
}
