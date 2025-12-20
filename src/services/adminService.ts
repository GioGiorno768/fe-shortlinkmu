import type { Admin, AdminStats } from "@/types/type";

// --- MOCK DATA ---
const MOCK_ADMINS: Admin[] = Array.from({ length: 10 }, (_, i) => ({
  id: `admin-${i}`,
  name: `Admin ${
    i === 0 ? "Kevin" : i === 1 ? "Budi" : i === 2 ? "Sarah" : `User ${i}`
  }`,
  username: `admin_${i}`,
  email: `admin${i}@shortlink.com`,
  avatarUrl:
    i % 3 === 0 ? `/avatars/avatar-1.webp` : "",
  role: i === 0 ? "super-admin" : "admin",
  status: i % 7 === 0 ? "suspended" : "active",
  joinedAt: new Date(Date.now() - i * 50000000).toISOString(),
  lastLogin: new Date(
    Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)
  ).toISOString(),
  stats: {
    usersManaged: Math.floor(Math.random() * 500),
    withdrawalsProcessed: Math.floor(Math.random() * 200),
    linksBlocked: Math.floor(Math.random() * 100),
  },
}));

interface GetAdminsParams {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
}

export async function getAdmins(
  params: GetAdminsParams
): Promise<{ data: Admin[]; totalPages: number; totalCount: number }> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_ADMINS];

  // Search
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.username.toLowerCase().includes(s)
    );
  }

  // Filter by status
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((a) => a.status === params.status);
  }

  // Filter by role
  if (params.role && params.role !== "all") {
    filtered = filtered.filter((a) => a.role === params.role);
  }

  const itemsPerPage = 8;
  const page = params.page || 1;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return { data, totalPages, totalCount: filtered.length };
}

export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((r) => setTimeout(r, 500));

  return {
    totalAdmins: { count: MOCK_ADMINS.length, trend: 5.2 },
    activeToday: { count: Math.floor(MOCK_ADMINS.length * 0.9), trend: 3.1 },
    suspendedAdmins: {
      count: MOCK_ADMINS.filter((a) => a.status === "suspended").length,
      trend: -1.2,
    },
  };
}

export async function createAdmin(data: {
  username: string;
  email: string;
  password: string;
  name?: string;
}): Promise<Admin> {
  await new Promise((r) => setTimeout(r, 1000));

  const newAdmin: Admin = {
    id: `admin-${Date.now()}`,
    name: data.name || data.username,
    username: data.username,
    email: data.email,
    avatarUrl: "",
    role: "admin",
    status: "active",
    joinedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    stats: {
      usersManaged: 0,
      withdrawalsProcessed: 0,
      linksBlocked: 0,
    },
  };

  MOCK_ADMINS.unshift(newAdmin);
  return newAdmin;
}

export async function updateAdminStatus(
  id: string,
  status: "active" | "suspended"
): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));

  const admin = MOCK_ADMINS.find((a) => a.id === id);
  if (admin) {
    admin.status = status;
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));

  const idx = MOCK_ADMINS.findIndex((a) => a.id === id);
  if (idx !== -1) {
    MOCK_ADMINS.splice(idx, 1);
  }
}
