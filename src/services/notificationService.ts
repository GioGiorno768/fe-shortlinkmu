import type { NotificationItem, Role } from "@/types/type";

// --- MOCK DATA USER (Member) ---
const MEMBER_NOTIFS: NotificationItem[] = [
  {
    id: "1",
    type: "warning",
    category: "system",
    title: "Maintenance Scheduled",
    message: "Sistem akan maintenance pada jam 02:00 - 04:00 WIB.",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    type: "success",
    category: "payment",
    title: "Payout Approved",
    message: "Penarikan dana $15.50 berhasil dikirim ke PayPal.",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "3",
    type: "info",
    category: "event",
    title: "Event Double CPM!",
    message: "Nikmati kenaikan CPM 20% khusus weekend ini!",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "4",
    type: "alert",
    category: "account",
    title: "Login Mencurigakan",
    message: "Login dari IP tidak dikenal (Russia). Segera cek akun.",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "5",
    type: "info",
    category: "link",
    title: "Link Populer",
    message: "Link 'short.link/xyz' tembus 1000 view hari ini!",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

// --- MOCK DATA ADMIN (Staff/Super Admin) ---
const ADMIN_NOTIFS: NotificationItem[] = [
  {
    id: "a1",
    type: "warning",
    category: "payment",
    title: "🔥 Withdrawal Request",
    message:
      "User 'Rizky01' minta withdraw $50. Cek mutasi dan approve segera.",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 menit lalu
    actionUrl: "/admin/withdrawals",
  },
  {
    id: "a2",
    type: "alert",
    category: "link",
    title: "🚨 Abuse Report: Phishing",
    message:
      "3 User melaporkan link 'short.link/free-diamond' sebagai Phishing.",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actionUrl: "/admin/reports",
  },
  {
    id: "a3",
    type: "info",
    category: "account",
    title: "New User Registration",
    message: "+15 User baru mendaftar dalam 1 jam terakhir.",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "a4",
    type: "info",
    category: "system",
    title: "📢 Broadcast: Super Admin",
    message:
      "Tolong fokus bersihin tiket pending WD sebelum jam 5 sore. Thanks!",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

// --- LOGIC FETCHING ---
export async function getNotifications(
  role: Role = "member"
): Promise<NotificationItem[]> {
  // NANTI GANTI: fetch(`/api/notifications?role=${role}`)
  await new Promise((r) => setTimeout(r, 600));

  if (role === "admin" || role === "super-admin") {
    return [...ADMIN_NOTIFS];
  }
  return [...MEMBER_NOTIFS];
}

// Action lain tetep sama (bisa di-update nanti buat hit API beneran)
export async function markAsRead(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 300));
  return true;
}

export async function markAllAsRead(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 400));
  return true;
}
