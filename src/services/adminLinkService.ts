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
      avatarUrl: `https://avatar.iran.liara.run/public/${i}`,
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
): Promise<{ data: AdminLink[]; totalPages: number }> {
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
        l.owner.name.toLowerCase().includes(s) ||
        l.owner.username.toLowerCase().includes(s)
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

  return { data, totalPages };
}

// Bulk Action
export async function bulkUpdateLinkStatus(
  ids: string[],
  status: "active" | "disabled"
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  console.log(`Bulk update ${ids.length} links to ${status}`);
  return true;
}

export async function getLinkStats(): Promise<AdminLinkStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    totalLinks: 15420,
    newToday: 125,
    disabledLinks: 45,
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
