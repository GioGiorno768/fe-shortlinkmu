// src/services/linkService.ts
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
  FilterByType,
  SortByType,
} from "@/types/type";

// --- MOCK DB ---
const MOCK_DB: Shortlink[] = Array.from({ length: 50 }, (_, i) => ({
  id: `link-${i}`,
  title: `Link Project ${i}`,
  shortUrl: `short.link/proj-${i}`,
  originalUrl: "https://google.com",
  dateCreated: new Date(Date.now() - i * 10000000).toISOString(),
  validViews: Math.floor(Math.random() * 5000),
  totalEarning: Math.floor(Math.random() * 50),
  totalClicks: Math.floor(Math.random() * 10000),
  averageCPM: 4.5,
  adsLevel: "level1",
  passwordProtected: i % 5 === 0,
  status: "active",
}));

interface GetLinksParams {
  page?: number;
  search?: string;
  filterBy?: FilterByType;
  sortBy?: SortByType;
}

export const getLinks = async (
  params: GetLinksParams
): Promise<{ data: Shortlink[]; totalPages: number }> => {
  await new Promise((r) => setTimeout(r, 600));

  let result = [...MOCK_DB];

  // 1. Search
  if (params.search) {
    const s = params.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(s) ||
        l.shortUrl.toLowerCase().includes(s) ||
        l.originalUrl.toLowerCase().includes(s)
    );
  }

  // 2. Filter
  if (params.filterBy) {
    if (params.filterBy === "linkEnabled")
      result = result.filter((l) => l.status === "active");
    if (params.filterBy === "linkDisabled")
      result = result.filter((l) => l.status === "disabled");
    if (params.filterBy === "linkPassword")
      result = result.filter((l) => l.passwordProtected);
    if (params.filterBy === "dateExpired")
      result = result.filter((l) => !!l.dateExpired);
  }

  // 3. Sort
  const sortKey = params.sortBy || "highest";
  result.sort((a, b) => {
    let valA: any = new Date(a.dateCreated).getTime();
    let valB: any = new Date(b.dateCreated).getTime();

    if (params.filterBy === "validViews") {
      valA = a.validViews;
      valB = b.validViews;
    }
    if (params.filterBy === "totalEarning") {
      valA = a.totalEarning;
      valB = b.totalEarning;
    }
    if (params.filterBy === "avgCPM") {
      valA = a.averageCPM;
      valB = b.averageCPM;
    }

    return sortKey === "highest" ? valB - valA : valA - valB;
  });

  // 4. Pagination
  const itemsPerPage = 10;
  const page = params.page || 1;
  const totalPages = Math.ceil(result.length / itemsPerPage);
  const paginated = result.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return { data: paginated, totalPages: totalPages || 1 };
};

export const createLink = async (
  data: CreateLinkFormData
): Promise<Shortlink> => {
  await new Promise((r) => setTimeout(r, 1000));

  const newLink: Shortlink = {
    id: `new-${Date.now()}`,
    title: data.title || "Untitled Link",
    shortUrl: `short.link/${
      data.alias || Math.random().toString(36).substring(7)
    }`,
    originalUrl: data.url,
    dateCreated: new Date().toISOString(),
    validViews: 0,
    totalEarning: 0,
    totalClicks: 0,
    averageCPM: 0,
    adsLevel: data.adsLevel,
    passwordProtected: !!data.password,
    password: data.password,
    status: "active",
    dateExpired: data.expiresAt,
  };

  MOCK_DB.unshift(newLink);
  return newLink;
};

export const updateLink = async (
  id: string,
  data: EditableLinkData
): Promise<Shortlink> => {
  await new Promise((r) => setTimeout(r, 800));
  const idx = MOCK_DB.findIndex((l) => l.id === id);

  if (idx !== -1) {
    // FIX: Mapping data form (alias, expiresAt) ke struktur DB (shortUrl, dateExpired)
    const updatedLink: Shortlink = {
      ...MOCK_DB[idx],
      shortUrl: `short.link/${data.alias}`, // Update Alias
      dateExpired: data.expiresAt, // Update Expired
      adsLevel: data.adsLevel, // Update Ads
      password: data.password,
      passwordProtected: !!data.password,
    };
    MOCK_DB[idx] = updatedLink;
    return updatedLink;
  }
  throw new Error("Link not found");
};

export const toggleLinkStatus = async (
  id: string,
  status: "active" | "disabled"
): Promise<Shortlink> => {
  await new Promise((r) => setTimeout(r, 600));
  const idx = MOCK_DB.findIndex((l) => l.id === id);
  if (idx !== -1) {
    MOCK_DB[idx].status = status === "active" ? "disabled" : "active";
    return MOCK_DB[idx];
  }
  throw new Error("Link not found");
};
