import type { AdminAnnouncement, AdminAnnouncementStats } from "@/types/type";

// --- MOCK DATA ---
let MOCK_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: "ann-1",
    title: "Selamat Datang, Kevin! 👋",
    desc: "Semoga harimu menyenangkan. Yuk cek performa link kamu dan tingkatkan trafik hari ini!",
    cta: "Buat Link Baru",
    link: "/new-link",
    icon: "Sparkles",
    theme: "blue",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ann-2",
    title: "Bonus CPM Weekend! 🚀",
    desc: "Dapatkan kenaikan CPM +15% untuk semua traffic dari Indonesia khusus Sabtu & Minggu ini.",
    cta: "Lihat Info",
    link: "/ads-info",
    icon: "Megaphone",
    theme: "purple",
    status: "active",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ann-3",
    title: "Withdraw via Crypto 💎",
    desc: "Kabar gembira! Sekarang kamu bisa menarik saldo ke wallet USDT (TRC20) dengan fee rendah.",
    cta: "Atur Payment",
    link: "/settings?tab=payment",
    icon: "Wallet",
    theme: "orange",
    status: "inactive",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "ann-4",
    title: "Maintenance Notice 🛠️",
    desc: "Sistem akan maintenance pada tanggal 10 Desember jam 23:00 WIB.",
    cta: "Baca Detail",
    link: "/maintenance",
    icon: "Zap",
    theme: "orange",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    scheduledFor: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
  },
];

export async function getAnnouncements(): Promise<AdminAnnouncement[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [...MOCK_ANNOUNCEMENTS];
}

export async function getAnnouncementStats(): Promise<AdminAnnouncementStats> {
  await new Promise((r) => setTimeout(r, 500));
  const activeCount = MOCK_ANNOUNCEMENTS.filter(
    (a) => a.status === "active"
  ).length;
  const scheduledCount = MOCK_ANNOUNCEMENTS.filter(
    (a) => a.status === "scheduled"
  ).length;

  return {
    activeCount,
    totalCount: MOCK_ANNOUNCEMENTS.length,
    scheduledCount,
  };
}

export async function createAnnouncement(
  data: Omit<AdminAnnouncement, "id" | "createdAt">
): Promise<AdminAnnouncement> {
  await new Promise((r) => setTimeout(r, 800));
  const newAnnouncement: AdminAnnouncement = {
    ...data,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_ANNOUNCEMENTS = [newAnnouncement, ...MOCK_ANNOUNCEMENTS];
  return newAnnouncement;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<AdminAnnouncement>
): Promise<AdminAnnouncement> {
  await new Promise((r) => setTimeout(r, 800));
  const index = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Announcement not found");

  MOCK_ANNOUNCEMENTS[index] = { ...MOCK_ANNOUNCEMENTS[index], ...data };
  return MOCK_ANNOUNCEMENTS[index];
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  MOCK_ANNOUNCEMENTS = MOCK_ANNOUNCEMENTS.filter((a) => a.id !== id);
}
