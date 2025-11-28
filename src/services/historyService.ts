// src/services/historyService.ts
import type { ActivityLog, ActivityType } from "@/types/type";

interface HistoryParams {
  search?: string;
  type?: ActivityType | "all";
  page?: number;
}

// --- MOCK API CALLS ---

// Data dummy statis buat simulasi DB
const ALL_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    type: "login",
    title: "Login Berhasil",
    description: "Login via Email dari Chrome Windows",
    timestamp: new Date().toISOString(), // Hari ini
    ipAddress: "192.168.1.10",
    device: "Windows 11 / Chrome 120",
    status: "success",
  },
  {
    id: "act-2",
    type: "link",
    title: "Link Baru Dibuat",
    description: "Membuat shortlink 'short.link/promo-gacor'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 jam lalu
    status: "success",
  },
  {
    id: "act-3",
    type: "security",
    title: "Password Diubah",
    description: "Password akun berhasil diperbarui",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Kemarin
    ipAddress: "192.168.1.10",
    status: "warning",
  },
  {
    id: "act-4",
    type: "payment",
    title: "Penarikan Dana Request",
    description: "Request withdraw sebesar $50.00 via PayPal",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Kemarin
    status: "success",
  },
  {
    id: "act-5",
    type: "login",
    title: "Percobaan Login Gagal",
    description: "Password salah 3x",
    timestamp: "2025-11-15T08:00:00Z",
    ipAddress: "10.0.0.5",
    device: "Unknown Device",
    status: "failed",
  },
  {
    id: "act-6",
    type: "link",
    title: "Link Diedit",
    description: "Mengubah alias link 'short.link/my-file'",
    timestamp: "2025-11-14T14:30:00Z",
    status: "success",
  },
  {
    id: "act-7",
    type: "system",
    title: "Level Up!",
    description: "Selamat! Akun Anda naik ke level 'Medium'",
    timestamp: "2025-11-10T10:00:00Z",
    status: "success",
  },
];

export async function getActivityLogs(
  params: HistoryParams
): Promise<{ data: ActivityLog[]; totalPages: number }> {
  // NANTI GANTI:
  // const query = new URLSearchParams({
  //    search: params.search || "",
  //    type: params.type !== "all" ? params.type : "",
  //    page: params.page?.toString() || "1"
  // });
  // const res = await fetch(`/api/user/logs?${query}`);
  // return res.json();

  console.log("FETCH API Params:", params);
  await new Promise((resolve) => setTimeout(resolve, 600));

  // --- SIMULASI FILTERING BACKEND ---
  let filtered = ALL_LOGS.filter((item) => {
    const matchType =
      params.type === "all" || !params.type || item.type === params.type;
    const searchLower = (params.search || "").toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower);
    return matchType && matchSearch;
  });

  // Simulasi Pagination (misal 5 item per page)
  const itemsPerPage = 5;
  const page = params.page || 1;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return {
    data: paginatedData,
    totalPages: totalPages || 1,
  };
}
