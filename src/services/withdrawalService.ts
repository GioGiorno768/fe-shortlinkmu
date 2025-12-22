// src/services/withdrawalService.ts
// Withdrawal Service - Connected to Real API

import type {
  WithdrawalStats,
  PaymentMethod,
  Transaction,
  RecentWithdrawal,
  AdminWithdrawalStats,
  AdminWithdrawalFilters,
  WithdrawalDetail,
} from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper: Get auth token (matches authService.ts pattern)
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

// ============================
// 🧑‍💻 USER FACING FUNCTIONS
// ============================

/**
 * Get withdrawal data: stats + paginated history with filters
 * Endpoint: GET /withdrawals
 * @param page - current page
 * @param search - search by transaction_id
 * @param sort - 'newest' or 'oldest'
 * @param method - payment method filter (e.g., 'OVO', 'BCA', 'all')
 */
export async function getWithdrawalData(
  page: number = 1,
  search: string = "",
  sort: "newest" | "oldest" = "newest",
  method: string = "all"
): Promise<{
  stats: WithdrawalStats;
  transactions: Transaction[];
  totalPages: number;
  settings: {
    minWithdrawal: number;
    maxWithdrawal: number;
    limitCount: number;
    limitDays: number;
  };
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "8",
    sort,
    ...(search ? { search } : {}),
    ...(method && method !== "all" ? { method } : {}),
  });

  const res = await fetch(`${API_URL}/withdrawals?${params}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Withdrawal API Error:", res.status, errorData);
    throw new Error(
      errorData.message || `Failed to fetch withdrawal data (${res.status})`
    );
  }

  const json = await res.json();
  const data = json.data;

  // Transform backend response to frontend format
  const stats: WithdrawalStats = {
    availableBalance: data.balance || 0,
    pendingWithdrawn: 0, // Calculated from pending payouts
    totalWithdrawn: 0, // Calculated from paid payouts
  };

  // Transform payouts to transactions
  const payouts = data.payouts?.data || [];
  const transactions: Transaction[] = payouts.map((p: any) => ({
    id: p.id.toString(),
    txId: p.transaction_id || null, // Transaction ID untuk display
    date: p.created_at,
    amount: p.amount,
    fee: p.fee || 0,
    method:
      p.payment_method?.bank_name || p.payment_method?.provider || "Unknown",
    account: p.payment_method?.account_number || "",
    status: p.status,
    note: p.note,
  }));

  // Calculate pending & total from transactions
  payouts.forEach((p: any) => {
    const amount = parseFloat(p.amount) || 0;
    const fee = parseFloat(p.fee) || 0;
    if (p.status === "pending") {
      stats.pendingWithdrawn += amount + fee;
    } else if (p.status === "paid") {
      stats.totalWithdrawn += amount;
    }
  });

  return {
    stats,
    transactions,
    totalPages: data.payouts?.last_page || 1,
    settings: {
      minWithdrawal: data.min_withdrawal || 10000,
      maxWithdrawal: data.max_withdrawal || 0,
      limitCount: data.limit_count || 0,
      limitDays: data.limit_days || 1,
    },
  };
}

/**
 * Get user withdrawal stats only (lightweight)
 */
export async function getUserWithdrawalStats(): Promise<WithdrawalStats> {
  const { stats } = await getWithdrawalData(1, "");
  return stats;
}

/**
 * Get transaction history with pagination
 */
export async function getTransactionHistory(params: {
  page: number;
  search: string;
}): Promise<{ data: Transaction[]; totalPages: number }> {
  const result = await getWithdrawalData(params.page, params.search);
  return {
    data: result.transactions,
    totalPages: result.totalPages,
  };
}

/**
 * Get primary/default payment method
 * Endpoint: GET /payment-methods
 */
export async function getPrimaryPaymentMethod(): Promise<PaymentMethod | null> {
  const res = await fetch(`${API_URL}/payment-methods`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  const methods = json.data || [];

  // Find default method or return first one
  const defaultMethod = methods.find((m: any) => m.is_default) || methods[0];

  if (!defaultMethod) return null;

  return {
    id: defaultMethod.id.toString(),
    provider: defaultMethod.bank_name || defaultMethod.provider, // bank_name is the field used by settingsService
    accountNumber: defaultMethod.account_number,
    accountName: defaultMethod.account_name,
    fee: defaultMethod.fee || 0,
    isDefault: defaultMethod.is_default || false,
  };
}

/**
 * Request new withdrawal
 * Endpoint: POST /withdrawals
 */
export async function requestWithdrawal(
  amount: number,
  method: PaymentMethod
): Promise<boolean> {
  const res = await fetch(`${API_URL}/withdrawals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      payment_method_id: method.id,
      amount: amount,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal memproses penarikan");
  }

  return true;
}

/**
 * Cancel pending withdrawal
 * Endpoint: DELETE /withdrawals/{id}
 */
export async function cancelWithdrawal(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/withdrawals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membatalkan penarikan");
  }

  return true;
}

/**
 * Delete withdrawal history record (only for paid/rejected)
 * Endpoint: DELETE /withdrawals/delete/{id}
 */
export async function deleteWithdrawalHistory(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/withdrawals/delete/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus riwayat");
  }

  return true;
}

// ============================
// 🔧 ADMIN FUNCTIONS
// ============================

/**
 * Get all withdrawals (admin)
 */
export async function getWithdrawals(
  page: number = 1,
  filters?: AdminWithdrawalFilters
): Promise<{ data: RecentWithdrawal[]; totalPages: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "10",
    ...(filters?.search ? { search: filters.search } : {}),
    ...(filters?.status && filters.status !== "all"
      ? { status: filters.status }
      : {}),
  });

  const res = await fetch(`${API_URL}/admin/withdrawals?${params}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch withdrawals");
  }

  const json = await res.json();
  // Backend paginatedResponse returns: { data: [...items], meta: { last_page, ... } }
  const items = Array.isArray(json.data) ? json.data : [];
  const lastPage = json.meta?.last_page || 1;

  const withdrawals: RecentWithdrawal[] = items.map((w: any) => {
    // Ensure avatar is a valid URL or path
    let avatar = w.user?.avatar;
    if (!avatar || (!avatar.startsWith("/") && !avatar.startsWith("http"))) {
      // Use simple fallback avatar with user ID - PNG format for Next.js Image compatibility
      const userId = w.user?.id || 1;
      avatar = `https://api.dicebear.com/7.x/avataaars/png?seed=user${userId}&size=64`;
    }

    return {
      id: w.id.toString(),
      user: {
        id: w.user?.id?.toString() || "",
        name: w.user?.name || "Unknown",
        email: w.user?.email || "",
        avatar,
        level: w.user?.level || "beginner",
      },
      amount: w.amount,
      method:
        w.payment_method?.bank_name ||
        w.payment_method?.method_type ||
        "Unknown",
      accountNumber: w.payment_method?.account_number || "",
      status: w.status,
      date: w.created_at,
      proofUrl: w.proof_url,
      rejectionReason: w.notes,
      riskScore: "safe",
      processed_by: w.processed_by,
    };
  });

  return {
    data: withdrawals,
    totalPages: lastPage,
  };
}

/**
 * Get admin withdrawal stats
 */
export async function getWithdrawalStats(): Promise<AdminWithdrawalStats> {
  const res = await fetch(`${API_URL}/admin/withdrawals/daily-stats`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch withdrawal stats");
  }

  const json = await res.json();
  const data = json.data;

  return {
    paidToday: {
      amount: data.paid_today?.amount || 0,
      count: data.paid_today?.count || 0,
    },
    highestWithdrawal: {
      amount: data.highest_withdrawal?.amount || 0,
      user: data.highest_withdrawal?.user || "N/A",
    },
    totalUsersPaid: {
      count: data.total_users_paid?.count || 0,
      trend: data.total_users_paid?.trend || 0,
    },
  };
}

/**
 * Update withdrawal status (admin)
 */
export async function updateTransactionStatus(
  id: string,
  status: "approved" | "rejected" | "paid",
  reasonOrProof?: string
): Promise<boolean> {
  const res = await fetch(`${API_URL}/admin/withdrawals/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      status,
      note: reasonOrProof,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update status");
  }

  return true;
}

/**
 * Get withdrawal detail (admin)
 */
export async function getWithdrawalDetail(
  id: string
): Promise<WithdrawalDetail | null> {
  // For now, fetch from admin list and find by id
  const { data } = await getWithdrawals(1, { search: id });
  const withdrawal = data.find((w) => w.id === id);

  if (!withdrawal) return null;

  return {
    ...withdrawal,
    user: {
      ...withdrawal.user,
      walletBalance: 0, // Would need separate endpoint
    },
    fee: 0,
    netAmount: withdrawal.amount,
    history: [],
    fraudInfo: {
      ipAddress: "N/A",
      device: "N/A",
      location: "N/A",
      riskScore: withdrawal.riskScore,
      riskFactors: [],
    },
  };
}

/**
 * Save proof link (admin)
 */
export async function saveProofLink(id: string, url: string): Promise<boolean> {
  // This would typically be part of updateTransactionStatus
  return updateTransactionStatus(id, "paid", url);
}
