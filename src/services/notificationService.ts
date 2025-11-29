// src/services/notificationService.ts
import type { NotificationItem } from "@/types/type";

// Extend Type khusus buat service ini (atau bisa dipindah ke types.ts global)
export interface ExtendedNotificationItem extends NotificationItem {
  category: "link" | "payment" | "account" | "event" | "system";
}

// --- MOCK DATA (Data lama lu) ---
const MOCK_NOTIFS: ExtendedNotificationItem[] = [
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

export async function getNotifications(): Promise<ExtendedNotificationItem[]> {
  // NANTI GANTI: fetch('/api/user/notifications')
  await new Promise((r) => setTimeout(r, 600));
  return [...MOCK_NOTIFS];
}

export async function markAsRead(id: string): Promise<boolean> {
  // NANTI GANTI: fetch logic
  await new Promise((r) => setTimeout(r, 300));
  return true;
}

export async function markAllAsRead(): Promise<boolean> {
  // NANTI GANTI: fetch logic
  await new Promise((r) => setTimeout(r, 500));
  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  // NANTI GANTI: fetch logic delete
  await new Promise((r) => setTimeout(r, 400));
  return true;
}
