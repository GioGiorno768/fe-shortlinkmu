import type {
  SuperAdminStats,
  AnalyticsData,
  TimeRange,
  AuditLogEntry,
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

export async function getRecentAuditLogs(): Promise<AuditLogEntry[]> {
  await new Promise((r) => setTimeout(r, 700));

  return [
    {
      id: "log-1",
      admin: {
        id: "adm-1",
        name: "Sarah Admin",
        avatar: "https://avatar.iran.liara.run/public/65",
        role: "admin",
      },
      action: "BLOCK_LINK",
      target: "short.link/phishing123",
      details: "Detected as phishing site via report #RP-99",
      timestamp: new Date().toISOString(),
      status: "success",
    },
    {
      id: "log-2",
      admin: {
        id: "adm-2",
        name: "Budi Santoso",
        avatar: "https://avatar.iran.liara.run/public/32",
        role: "admin",
      },
      action: "APPROVE_WITHDRAWAL",
      target: "WD-8821 ($50.00)",
      details: "Payment sent via PayPal",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 jam lalu
      status: "success",
    },
    {
      id: "log-3",
      admin: {
        id: "adm-3",
        name: "Sarah Admin",
        avatar: "https://avatar.iran.liara.run/public/65",
        role: "admin",
      },
      action: "MANAGE_ANNOUNCEMENT",
      target: "Maintenance Notice",
      details: "Posted new announcement about server maintenance",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 jam lalu
      status: "success",
    },
    {
      id: "log-4",
      admin: {
        id: "adm-1",
        name: "Sarah Admin",
        avatar: "https://avatar.iran.liara.run/public/65",
        role: "admin",
      },
      action: "REJECT_WITHDRAWAL",
      target: "WD-8890 ($120.00)",
      details: "Invalid payment details (Bank ID not found)",
      timestamp: new Date(Date.now() - 18000000).toISOString(), // 5 jam lalu
      status: "failed",
    },
    {
      id: "log-5",
      admin: {
        id: "adm-2",
        name: "Budi Santoso",
        avatar: "https://avatar.iran.liara.run/public/32",
        role: "admin",
      },
      action: "SEND_NOTIFICATION",
      target: "User: spammer01",
      details: "Sent warning about traffic quality",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 hari lalu
      status: "success",
    },
  ];
}
