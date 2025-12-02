// src/services/withdrawalService.ts
import type {
  WithdrawalStats,
  AdminWithdrawalStats,
  RecentWithdrawal,
  PaymentMethod,
  Transaction,
  AdminWithdrawalFilters,
  WithdrawalDetail,
} from "@/types/type";

interface TransactionParams {
  page?: number;
  search?: string;
}

// MOCK DATA
const MOCK_TRANSACTIONS: RecentWithdrawal[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: `trx-${i}`,
    user: {
      id: `user-${i}`,
      name: i % 2 === 0 ? `Agus Setiawan ${i}` : `Siti Nurhaliza ${i}`,
      email: `user${i}@gmail.com`,
      avatar: `https://avatar.iran.liara.run/public/${i + 20}`,
      level: i % 5 === 0 ? "mythic" : "beginner",
    },
    amount: parseFloat((Math.random() * 100 + 10).toFixed(2)),
    method: i % 3 === 0 ? "BCA" : "PayPal",
    accountNumber: i % 3 === 0 ? "1234567890" : "user@paypal.com",
    status:
      i === 0
        ? "pending"
        : i === 1
        ? "completed"
        : i === 2
        ? "rejected"
        : "pending",
    date: new Date(Date.now() - i * 3600000).toISOString(),
    riskScore: i === 3 ? "high" : "safe",
    proofUrl: i === 1 ? "https://drive.google.com/file/d/xxxx" : undefined,
    rejectionReason: i === 2 ? "Nomor rekening tidak valid" : undefined,
  })
);

// 👇 UPDATE FUNGSI INI
export async function getWithdrawals(
  page: number = 1,
  filters: AdminWithdrawalFilters
): Promise<{ data: RecentWithdrawal[]; totalPages: number }> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_TRANSACTIONS];

  // 1. Search (ID, Name, Email)
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(s) ||
        t.user.name.toLowerCase().includes(s) ||
        t.user.email.toLowerCase().includes(s)
    );
  }

  // 2. Filter Status
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  // 3. Filter Level User
  if (filters.level && filters.level !== "all") {
    filtered = filtered.filter((t) => t.user.level === filters.level);
  }

  // 4. Sort
  if (filters.sort === "oldest") {
    filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else {
    // Default Newest
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return { data, totalPages };
}

export async function getWithdrawalStats(): Promise<AdminWithdrawalStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    paidToday: { amount: 1250.5, count: 45 },
    totalUsersPaid: { count: 120, trend: 12 },
    highestWithdrawal: { amount: 150.0, user: "Sultan Andara" },
  };
}

export async function getUserWithdrawalStats(): Promise<WithdrawalStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    availableBalance: 154.2,
    pendingWithdrawn: 12.5,
    totalWithdrawn: 450.0,
  };
}

// Action Updates
export async function updateTransactionStatus(
  id: string,
  status: string,
  reason?: string
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  console.log(`Update ${id} to ${status}. Reason: ${reason}`);
  return true;
}

export async function saveProofLink(id: string, url: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  console.log(`Saved proof for ${id}: ${url}`);
  return true;
}

export async function getPrimaryPaymentMethod(): Promise<PaymentMethod | null> {
  // NANTI GANTI: fetch('/api/user/payment-methods/primary')
  await new Promise((r) => setTimeout(r, 500));
  return {
    provider: "PayPal",
    accountName: "Kevin Ragil",
    accountNumber: "kevinragil768@gmail.com",
  };
}

export async function getWithdrawalDetail(
  id: string
): Promise<WithdrawalDetail | null> {
  await new Promise((r) => setTimeout(r, 800));

  // Cari di MOCK_TRANSACTIONS dulu
  const basic =
    MOCK_TRANSACTIONS.find((t) => t.id === id) || MOCK_TRANSACTIONS[0];

  if (!basic) return null;

  return {
    ...basic,
    user: {
      ...basic.user,
      walletBalance: 154.2, // Mock balance
    },
    fee: 0.5,
    netAmount: basic.amount - 0.5,
    history: [
      {
        id: "WTH-005",
        date: "2025-11-18T10:00:00Z",
        amount: 12.5,
        method: "PayPal",
        account: "kevin***@gmail.com",
        status: "completed",
      },
      {
        id: "WTH-004",
        date: "2025-11-15T14:30:00Z",
        amount: 50.0,
        method: "Bank BCA",
        account: "1234****",
        status: "completed",
        txId: "TRX123",
      },
    ],
    fraudInfo: {
      ipAddress: "192.168.1.10",
      device: "Chrome on Windows 10",
      location: "Jakarta, Indonesia",
      riskScore: basic.riskScore,
      riskFactors:
        basic.riskScore === "high"
          ? ["Multiple accounts linked", "Suspicious IP"]
          : [],
    },
  };
}

export async function sendMessageToUser(
  withdrawalId: string,
  message: string,
  type: "warning" | "announcement"
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 1000));
  console.log(
    `Sending ${type} message for withdrawal ${withdrawalId}: ${message}`
  );
  return true;
}

export async function getTransactionHistory(
  params: TransactionParams
): Promise<{ data: Transaction[]; totalPages: number }> {
  // NANTI GANTI:
  // const q = new URLSearchParams({ page: params.page, search: params.search });
  // const res = await fetch(`/api/withdrawal/transactions?${q}`);

  await new Promise((r) => setTimeout(r, 800));

  // Data Dummy Statis
  const allTransactions: Transaction[] = [
    {
      id: "WTH-005",
      date: "2025-11-18T10:00:00Z",
      amount: 12.5,
      method: "PayPal",
      account: "kevin***@gmail.com",
      status: "pending",
    },
    {
      id: "WTH-004",
      date: "2025-11-15T14:30:00Z",
      amount: 50.0,
      method: "Bank BCA",
      account: "1234****",
      status: "completed",
      txId: "TRX123",
    },
    {
      id: "WTH-003",
      date: "2025-11-10T09:15:00Z",
      amount: 25.0,
      method: "PayPal",
      account: "kevin***@gmail.com",
      status: "rejected",
    },
    {
      id: "WTH-002",
      date: "2025-11-05T11:00:00Z",
      amount: 100.0,
      method: "DANA",
      account: "0812****",
      status: "completed",
      txId: "TRX124",
    },
    {
      id: "WTH-001",
      date: "2025-11-01T08:00:00Z",
      amount: 15.0,
      method: "OVO",
      account: "0812****",
      status: "completed",
      txId: "TRX125",
    },
    // ... tambah data dummy lainnya
  ];

  // Simulasi Filter & Pagination di "Backend"
  const searchLower = (params.search || "").toLowerCase();
  const filtered = allTransactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(searchLower) ||
      tx.method.toLowerCase().includes(searchLower)
  );

  const itemsPerPage = 5;
  const page = params.page || 1;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return { data: paginatedData, totalPages: totalPages || 1 };
}

export async function requestWithdrawal(
  amount: number,
  method: PaymentMethod
): Promise<boolean> {
  // NANTI GANTI: fetch POST ke '/api/withdrawal/request'
  await new Promise((r) => setTimeout(r, 1500));
  if (amount < 2) throw new Error("Minimum withdrawal is $2.00");
  return true;
}

export async function cancelWithdrawal(txId: string): Promise<boolean> {
  // NANTI GANTI: fetch POST ke `/api/withdrawal/${txId}/cancel`
  await new Promise((r) => setTimeout(r, 1000));
  return true;
}
