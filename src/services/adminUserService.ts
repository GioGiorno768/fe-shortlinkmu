import type {
  AdminUser,
  AdminUserStats,
  UserDetailData,
  UserStatus,
} from "@/types/type";

// --- MOCK DATA (UPDATED) ---
const MOCK_USERS: AdminUser[] = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i}`,
  name: i % 3 === 0 ? `Budi Santoso ${i}` : `Kevin Ragil ${i}`,
  username: `user_${i}`,
  email: `user${i}@example.com`,
  // Simulasi: User genap punya avatar, ganjil kosong (biar kita tes inisial)
  avatarUrl:
    i % 2 === 0 ? `/avatars/avatar-1.webp` : "",
  status: i % 10 === 0 ? "suspended" : "active",
  joinedAt: new Date(Date.now() - i * 100000000).toISOString(),
  // Random last login (antara sekarang sampai 7 hari lalu)
  lastLogin: new Date(
    Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
  ).toISOString(),
  stats: {
    totalLinks: Math.floor(Math.random() * 100),
    totalViews: Math.floor(Math.random() * 5000),
    walletBalance: parseFloat((Math.random() * 50).toFixed(2)),
  },
}));

// ... (Sisa fungsi getUsers dan updateUserStatus TETAP SAMA)
interface GetUsersParams {
  page?: number;
  search?: string;
  status?: string;
}

export async function getUsers(
  params: GetUsersParams
): Promise<{ data: AdminUser[]; totalPages: number; totalCount: number }> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_USERS];

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.username.toLowerCase().includes(s)
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const itemsPerPage = 8;
  const page = params.page || 1;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return { data, totalPages, totalCount: filtered.length };
}

export async function getAllUserIds(params: GetUsersParams): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_USERS];

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.username.toLowerCase().includes(s)
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  return filtered.map((u) => u.id);
}

export async function getUserStats(): Promise<AdminUserStats> {
  // NANTI GANTI: fetch('/api/admin/users/stats')
  await new Promise((r) => setTimeout(r, 500));

  return {
    totalUsers: { count: MOCK_USERS.length, trend: 12.5 }, // +12.5% user baru
    activeToday: { count: Math.floor(MOCK_USERS.length * 0.8), trend: 5.2 }, // User aktif naik
    suspendedUsers: {
      count: MOCK_USERS.filter((u) => u.status === "suspended").length,
      trend: -2.4,
    }, // Suspended user turun (bagus)
  };
}

export async function getUserDetail(
  id: string
): Promise<UserDetailData | null> {
  // NANTI GANTI: fetch(`/api/admin/users/${id}`)
  console.log("Fetching detail for:", id);
  await new Promise((r) => setTimeout(r, 800)); // Simulasi loading

  // Cari user dari mock list (atau balikin dummy full)
  const baseUser = MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];

  return {
    ...baseUser,
    phoneNumber: "0812-3456-7890",
    bio: "Content Creator di TikTok & Youtube",
    paymentMethods: [
      {
        id: "pm-1",
        provider: "DANA",
        accountName: baseUser.name,
        accountNumber: "0812****7890",
        isDefault: true,
        category: "wallet",
      },
      {
        id: "pm-2",
        provider: "BCA",
        accountName: baseUser.name,
        accountNumber: "123****888",
        isDefault: false,
        category: "bank",
      },
    ],
    withdrawalHistory: [
      {
        id: "wd-1",
        date: new Date().toISOString(),
        amount: 25.5,
        method: "DANA",
        account: "0812****7890",
        status: "paid",
      },
      {
        id: "wd-2",
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        amount: 50.0,
        method: "BCA",
        account: "123****888",
        status: "rejected",
      },
    ],
    loginHistory: [
      {
        id: "log-1",
        ip: "192.168.1.10",
        device: "Chrome / Windows",
        location: "Jakarta, ID",
        timestamp: new Date().toISOString(),
        status: "success",
      },
      {
        id: "log-2",
        ip: "10.0.0.55",
        device: "Safari / iPhone",
        location: "Bandung, ID",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: "success",
      },
      {
        id: "log-3",
        ip: "45.12.33.1",
        device: "Firefox / Linux",
        location: "Moscow, RU",
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: "failed", // Suspicious login
      },
    ],
    messageHistory: [
      {
        id: "msg-1",
        subject: "Peringatan Pelanggaran TOS",
        message:
          "Kami mendeteksi aktivitas mencurigakan pada akun Anda. Mohon segera verifikasi identitas Anda untuk menghindari penangguhan akun.",
        type: "warning",
        category: "account",
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-2",
        subject: "Fitur Baru: Withdrawal Otomatis",
        message:
          "Halo! Kami baru saja merilis fitur withdrawal otomatis. Sekarang Anda bisa menarik dana kapan saja tanpa menunggu persetujuan manual.",
        type: "info",
        category: "payment",
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        isRead: false,
      },
      {
        id: "msg-3",
        subject: "Bonus Referral Bulan Ini",
        message:
          "Selamat! Anda mendapatkan bonus referral sebesar $5.00 karena telah mengundang 10 teman aktif bulan ini.",
        type: "info",
        category: "event",
        sentAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        isRead: true,
      },
    ],
  };
}

export async function updateUserStatus(
  id: string,
  status: UserStatus
): Promise<void> {
  // NANTI GANTI: fetch('/api/admin/users/status', { method: 'PATCH', ... })
  await new Promise((r) => setTimeout(r, 500));

  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) {
    user.status = status;
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
  // NANTI GANTI: fetch('/api/admin/users/notify', { method: 'POST', body: ... })
  const { userIds, selectAll, filters, subject, message, type } = params;

  if (selectAll) {
    console.log(
      `Sending [${type.toUpperCase()}] notification to ALL USERS matching filters:`,
      filters
    );
  } else {
    console.log(
      `Sending [${type.toUpperCase()}] notification to ${userIds.length} users.`
    );
  }

  console.log("Content:", { subject, message });
  await new Promise((r) => setTimeout(r, 1000)); // Simulasi loading
}
