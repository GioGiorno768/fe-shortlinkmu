// src/services/withdrawalService.ts
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";

interface TransactionParams {
  page?: number;
  search?: string;
}

// --- MOCK API CALLS ---

export async function getWithdrawalStats(): Promise<WithdrawalStats> {
  // NANTI GANTI: fetch('/api/withdrawal/stats')
  await new Promise((r) => setTimeout(r, 600));
  return {
    availableBalance: 154.2055,
    pendingWithdrawn: 12.5,
    totalWithdrawn: 450.0,
  };
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
