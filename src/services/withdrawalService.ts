import type {
  RecentWithdrawal,
  WithdrawalStats,
  AdminWithdrawalStats,
  AdminWithdrawalFilters,
  WithdrawalDetail,
} from "@/types/type";

// MOCK DATA
const LEVEL_WEIGHTS: Record<string, number> = {
  beginner: 1,
  rookie: 2,
  elite: 3,
  pro: 4,
  master: 5,
  mythic: 6,
};

const MOCK_WITHDRAWALS: RecentWithdrawal[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: `WTH-${1000 + i}`,
    user: {
      id: `usr-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      avatar: `https://avatar.iran.liara.run/public/${i + 1}`,
      level: i % 5 === 0 ? "mythic" : "beginner",
    },
    amount: (i + 1) * 10.5,
    method: i % 2 === 0 ? "PayPal" : "Bank Transfer",
    accountNumber: i % 2 === 0 ? "kevin***@gmail.com" : "1234567890",
    status:
      i === 0 ? "pending" : i === 1 ? "paid" : i === 2 ? "rejected" : "pending",
    date: new Date(Date.now() - i * 86400000).toISOString(),
    proofUrl: i === 1 ? "https://example.com/proof.jpg" : undefined,
    rejectionReason: i === 2 ? "Invalid account details provided." : undefined,
    riskScore: i % 10 === 0 ? "high" : "safe",
    processed_by: i !== 0 ? "Admin Kevin" : undefined,
  })
);

export async function getWithdrawals(
  page: number = 1,
  filters?: AdminWithdrawalFilters
): Promise<{ data: RecentWithdrawal[]; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let data = [...MOCK_WITHDRAWALS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (w) =>
        w.user.name.toLowerCase().includes(q) ||
        w.user.email.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== "all") {
    data = data.filter((w) => w.status === filters.status);
  }

  // Filter Level (Strict match removed, handled in sort)
  // if (filters?.level && filters.level !== "all") { ... }

  data.sort((a, b) => {
    // 1. Primary Sort: Level (if selected)
    if (filters?.level === "highest" || filters?.level === "lowest") {
      const weightA = LEVEL_WEIGHTS[a.user.level.toLowerCase()] || 0;
      const weightB = LEVEL_WEIGHTS[b.user.level.toLowerCase()] || 0;

      if (weightA !== weightB) {
        return filters.level === "highest"
          ? weightB - weightA
          : weightA - weightB;
      }
    }

    // 2. Secondary Sort: Date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (filters?.sort === "oldest") {
      return dateA - dateB;
    } else {
      return dateB - dateA; // newest
    }
  });

  // Pagination Logic
  const limit = 10;
  const totalPages = Math.ceil(data.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = data.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    totalPages,
  };
}

export async function getWithdrawalStats(): Promise<AdminWithdrawalStats> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    paidToday: { amount: 1250.0, count: 15 },
    highestWithdrawal: { amount: 500.0, user: "Sultan01" },
    totalUsersPaid: { count: 120, trend: 12 },
  };
}

export async function saveProofLink(id: string, url: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Saving proof for ${id}: ${url}`);
  return true;
}

export async function updateTransactionStatus(
  id: string,
  status: "approved" | "rejected" | "paid",
  reasonOrProof?: string
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Updating ${id} to ${status}`, reasonOrProof);
  return true;
}

export async function getWithdrawalDetail(
  id: string
): Promise<WithdrawalDetail> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock detail data
  const base = MOCK_WITHDRAWALS.find((w) => w.id === id) || MOCK_WITHDRAWALS[0];

  return {
    ...base,
    user: {
      ...base.user,
      walletBalance: 150.25,
    },
    fee: 0.5,
    netAmount: base.amount - 0.5,
    history: [
      {
        id: "WTH-005",
        date: new Date(Date.now() - 100000000).toISOString(),
        amount: 12.5,
        method: "PayPal",
        account: "kevin***@gmail.com",
        status: "paid",
      },
      {
        id: "WTH-004",
        date: new Date(Date.now() - 200000000).toISOString(),
        amount: 50.0,
        method: "Bank BCA",
        account: "1234****",
        status: "paid",
        txId: "TRX123",
      },
      {
        id: "WTH-003",
        date: new Date(Date.now() - 300000000).toISOString(),
        amount: 25.0,
        method: "PayPal",
        account: "kevin***@gmail.com",
        status: "rejected",
      },
    ],
    fraudInfo: {
      ipAddress: "192.168.1.10",
      device: "Chrome on Windows 10",
      location: "Jakarta, Indonesia",
      riskScore: base.riskScore,
      riskFactors:
        base.riskScore === "high"
          ? ["Multiple accounts detected", "Suspicious IP range"]
          : [],
    },
  };
}

export async function getTransactionHistory(
  params: string | { page: number; search: string }
): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Handle Admin/User overload (simplified for mock)
  if (typeof params === "string") {
    // Admin usage: params is userId
    return [
      {
        id: "TX-101",
        date: "2024-02-20T10:00:00Z",
        amount: 50.0,
        method: "PayPal",
        account: "user@example.com",
        status: "paid",
      },
      {
        id: "TX-102",
        date: "2024-01-15T14:30:00Z",
        amount: 120.5,
        method: "Bank Transfer",
        account: "1234567890",
        status: "paid",
      },
    ];
  } else {
    // User usage: params is { page, search }
    return {
      data: [
        {
          id: "TX-201",
          date: new Date().toISOString(),
          amount: 25.0,
          method: "PayPal",
          account: "user@example.com",
          status: "pending",
        },
        {
          id: "TX-202",
          date: new Date(Date.now() - 86400000).toISOString(),
          amount: 100.0,
          method: "Bank BCA",
          account: "1234567890",
          status: "paid",
        },
      ],
      totalPages: 1,
    };
  }
}

// --- USER FACING FUNCTIONS ---

export async function getUserWithdrawalStats(): Promise<WithdrawalStats> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    availableBalance: 150.75,
    pendingWithdrawn: 25.0,
    totalWithdrawn: 1250.0,
  };
}

export async function getPrimaryPaymentMethod() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    id: "pm-1",
    provider: "PayPal",
    accountNumber: "user@example.com",
    accountName: "User Name",
  };
}

export async function requestWithdrawal(
  amount: number,
  method: any
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Requested withdrawal:", amount, method);
  return true;
}

export async function cancelWithdrawal(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Cancelled withdrawal:", id);
  return true;
}
