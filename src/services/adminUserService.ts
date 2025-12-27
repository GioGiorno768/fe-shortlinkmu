import type {
  AdminUser,
  AdminUserStats,
  UserDetailData,
  UserStatus,
} from "@/types/type";
import apiClient from "./apiClient";

// --- API Response Types ---
interface GetUsersParams {
  page?: number;
  search?: string;
  status?: string;
}

interface ApiUserResponse {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  is_banned: boolean;
  created_at: string;
  last_active_at: string | null;
  links_count?: number;
  total_earnings?: number;
  total_valid_views?: number;
  balance?: number;
}

interface ApiUserDetailResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  status: "active" | "suspended";
  joined_at: string;
  last_login: string | null;
  stats: {
    total_links: number;
    total_views: number;
    wallet_balance: number;
    total_earnings: number;
    avg_cpm: number;
  };
  current_level: unknown;
  payment_methods: Array<{
    id: number;
    provider: string;
    account_name: string;
    account_number: string;
    is_default: boolean;
    category: string;
    fee: number;
  }>;
  withdrawal_history: Array<{
    id: number;
    tx_id: string;
    date: string;
    amount: number;
    fee: number;
    method: string;
    account: string;
    status: string;
  }>;
}

interface ApiStatsResponse {
  total_users: { count: number; trend: number };
  active_today: { count: number; trend: number };
  suspended_users: { count: number; trend: number };
}

// --- Helper: Transform API user to frontend format ---
function transformUser(apiUser: ApiUserResponse): AdminUser {
  // Calculate avg CPM same as backend: (total_earnings / total_valid_views) * 1000
  const totalValidViews = Number(apiUser.total_valid_views || 0);
  const totalEarnings = Number(apiUser.total_earnings || 0);
  const avgCpm =
    totalValidViews > 0 ? (totalEarnings / totalValidViews) * 1000 : 0;

  return {
    id: String(apiUser.id),
    name: apiUser.name,
    username: apiUser.email.split("@")[0],
    email: apiUser.email,
    avatarUrl: apiUser.avatar ? `/avatars/${apiUser.avatar}.webp` : "",
    status: apiUser.is_banned ? "suspended" : "active",
    joinedAt: apiUser.created_at,
    lastLogin: apiUser.last_active_at || apiUser.created_at,
    stats: {
      totalLinks: Number(apiUser.links_count || 0),
      totalViews: totalValidViews,
      walletBalance: Number(apiUser.balance || 0),
      totalEarnings: totalEarnings,
      avgCpm: avgCpm,
    },
  };
}

// --- API Functions ---

export async function getUsers(
  params: GetUsersParams
): Promise<{ data: AdminUser[]; totalPages: number; totalCount: number }> {
  const response = await apiClient.get<{
    data: {
      users: {
        data: ApiUserResponse[];
        last_page: number;
        total: number;
      };
    };
  }>("/admin/users", {
    params: {
      page: params.page || 1,
      per_page: 8,
      search: params.search || undefined,
      is_banned:
        params.status === "suspended"
          ? true
          : params.status === "active"
          ? false
          : undefined,
    },
  });

  const { users } = response.data.data;

  return {
    data: users.data.map(transformUser),
    totalPages: users.last_page,
    totalCount: users.total,
  };
}

export async function getAllUserIds(params: GetUsersParams): Promise<string[]> {
  // For "Select All" mode, we don't need actual IDs
  // The backend handles it with filters
  // This function is kept for compatibility but returns empty array
  // since the notify endpoint accepts select_all: true with filters
  return [];
}

export async function getUserStats(): Promise<AdminUserStats> {
  const response = await apiClient.get<{ data: ApiStatsResponse }>(
    "/admin/users/stats"
  );

  const stats = response.data.data;

  return {
    totalUsers: {
      count: stats.total_users.count,
      trend: stats.total_users.trend,
    },
    activeToday: {
      count: stats.active_today.count,
      trend: stats.active_today.trend,
    },
    suspendedUsers: {
      count: stats.suspended_users.count,
      trend: stats.suspended_users.trend,
    },
  };
}

export async function getUserDetail(
  id: string
): Promise<UserDetailData | null> {
  try {
    const response = await apiClient.get<{ data: ApiUserDetailResponse }>(
      `/admin/users/${id}`
    );

    const user = response.data.data;

    return {
      id: String(user.id),
      name: user.name,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatar_url || "",
      status: user.status,
      joinedAt: user.joined_at,
      lastLogin: user.last_login || user.joined_at,
      phoneNumber: "", // Not available from API
      bio: "", // Not available from API
      stats: {
        totalLinks: user.stats.total_links,
        totalViews: user.stats.total_views,
        walletBalance: user.stats.wallet_balance,
        totalEarnings: user.stats.total_earnings,
        avgCpm: user.stats.avg_cpm,
      },
      paymentMethods: user.payment_methods.map((pm) => ({
        id: String(pm.id),
        provider: pm.provider,
        accountName: pm.account_name,
        accountNumber: pm.account_number,
        isDefault: pm.is_default,
        category: pm.category as "wallet" | "bank" | "crypto",
        fee: pm.fee,
      })),
      withdrawalHistory: user.withdrawal_history.map((wh) => ({
        id: String(wh.id),
        txId: wh.tx_id,
        date: wh.date,
        amount: wh.amount,
        fee: wh.fee,
        method: wh.method,
        account: wh.account,
        status: wh.status as
          | "pending"
          | "approved"
          | "rejected"
          | "paid"
          | "cancelled",
      })),
      // Empty arrays for hidden tabs
      loginHistory: [],
      messageHistory: [],
    };
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return null;
  }
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
  reason?: string
): Promise<void> {
  if (status === "suspended") {
    // Ban requires reason
    await apiClient.patch(`/admin/users/${id}/ban`, {
      reason: reason || "Pelanggaran Terms of Service",
    });
  } else {
    // Unban doesn't need reason
    await apiClient.patch(`/admin/users/${id}/unban`);
  }
}

export async function sendNotification(params: {
  userIds: string[];
  selectAll: boolean;
  filters?: { search: string; status: string };
  subject: string;
  message: string;
  type: "warning" | "info";
}): Promise<void> {
  await apiClient.post("/admin/users/notify", {
    user_ids: params.selectAll ? [] : params.userIds.map((id) => parseInt(id)),
    select_all: params.selectAll,
    filters: params.filters
      ? {
          search: params.filters.search || undefined,
          status: params.filters.status || "all",
        }
      : undefined,
    subject: params.subject,
    message: params.message,
    type: params.type,
  });
}
