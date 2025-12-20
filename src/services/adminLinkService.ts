import type {
  AdminLink,
  AdminLinkFilters,
  AdminLinkStats,
  LinkStatus,
} from "@/types/type";

// --- MOCK DATA (Diperkaya) ---
const MOCK_LINKS: AdminLink[] = Array.from({ length: 50 }, (_, i) => {
  const isExpired = i % 15 === 0;
  const isDisabled = i % 20 === 0;
  return {
    id: `link-${i}`,
    title: i % 3 === 0 ? `Tutorial Cara Cepat Kaya #${i}` : undefined,
    shortUrl: `short.link/xYz${i}`,
    originalUrl: `https://www.example.com/very/long/url/that/needs/shortening/${i}`,
    alias: i % 5 === 0 ? `promo-${i}` : undefined,
    owner: {
      id: `user-${i}`,
      name: i % 2 === 0 ? `Budi Santoso ${i}` : `Siti Aminah ${i}`,
      username: `user_${i}`,
      email: `user${i}@gmail.com`,
      avatarUrl: `/avatars/avatar-1.webp`,
    },
    views: Math.floor(Math.random() * 10000),
    earnings: parseFloat((Math.random() * 50).toFixed(2)),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    expiredAt: isExpired
      ? new Date(Date.now() - 100000000).toISOString()
      : undefined,
    status: isDisabled ? "disabled" : isExpired ? "expired" : "active",
    adsLevel: i % 4 === 0 ? "level4" : i % 3 === 0 ? "noAds" : "level1",
  };
});

export async function getLinks(
  page: number = 1,
  filters: AdminLinkFilters
): Promise<{ data: AdminLink[]; totalPages: number; totalCount: number }> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_LINKS];

  // 1. Search (Owner Name, ShortLink, Original Link)
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.shortUrl.toLowerCase().includes(s) ||
        l.originalUrl.toLowerCase().includes(s) ||
        l.alias?.toLowerCase().includes(s) ||
        l.title?.toLowerCase().includes(s)
    );
  }

  // 2. Filter Status
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((l) => l.status === filters.status);
  }

  // 3. Filter Ads Level
  if (filters.adsLevel && filters.adsLevel !== "all") {
    filtered = filtered.filter((l) => l.adsLevel === filters.adsLevel);
  }

  // 4. Sorting Complex
  if (filters.sort) {
    switch (filters.sort) {
      case "default":
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "most_views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "least_views":
        filtered.sort((a, b) => a.views - b.views);
        break;
      case "most_earnings":
        filtered.sort((a, b) => b.earnings - a.earnings);
        break;
      case "least_earnings":
        filtered.sort((a, b) => a.earnings - b.earnings);
        break;
    }
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return { data, totalPages, totalCount: filtered.length };
}

// Bulk Action
export async function bulkUpdateLinkStatus(params: {
  ids: string[];
  selectAll: boolean;
  filters?: AdminLinkFilters;
  status: "active" | "disabled";
  reason?: string;
}): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  const { ids, selectAll, filters, status, reason } = params;

  if (selectAll) {
    console.log(
      `Bulk update ALL links matching filters to ${status}. Reason: ${
        reason || "N/A"
      }`,
      filters
    );
  } else {
    console.log(
      `Bulk update ${ids.length} links to ${status}. Reason: ${reason || "N/A"}`
    );
  }
  return true;
}

export async function getLinkStats(): Promise<AdminLinkStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    totalLinks: MOCK_LINKS.length,
    newToday: Math.floor(MOCK_LINKS.length * 0.1), // 10% new
    disabledLinks: MOCK_LINKS.filter((l) => l.status === "disabled").length,
  };
}

export async function updateLinkStatus(
  id: string,
  status: LinkStatus
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  console.log(`Updating link ${id} status to ${status}`);
  const link = MOCK_LINKS.find((l) => l.id === id);
  if (link) {
    link.status = status;
    return true;
  }
  return false;
}

export async function deleteLinks(ids: string[]): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  console.log(`Deleting links: ${ids.join(", ")}`);
  return true;
}

export async function sendMessageToUser(
  linkId: string,
  message: string,
  type: "warning" | "announcement"
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 1000));
  console.log(`Sending ${type} message for link ${linkId}: ${message}`);
  return true;
}
