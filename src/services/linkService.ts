// src/services/linkService.ts
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
} from "@/types/type";

// --- MOCK DATA (Simulasi Database Sementara) ---
let MOCK_DB: Shortlink[] = Array.from({ length: 10 }, (_, i) => ({
  id: `link-${i}`,
  title: `Link ${i}`,
  shortUrl: `short.link/${i}`,
  originalUrl: "https://google.com",
  dateCreated: new Date().toISOString(),
  validViews: 100 * i,
  totalEarning: 5 * i,
  totalClicks: 200 * i,
  averageCPM: 4.5,
  adsLevel: "level1",
  passwordProtected: false,
  status: "active",
}));

// --- API METHODS ---

export const getLinks = async (): Promise<Shortlink[]> => {
  // NANTI GANTI JADI: const res = await fetch('/api/links'); return res.json();
  await new Promise((r) => setTimeout(r, 800)); // Simulasi delay network
  return [...MOCK_DB]; // Return copy biar aman
};

export const createLink = async (
  data: CreateLinkFormData
): Promise<Shortlink> => {
  // NANTI GANTI JADI: fetch POST ke Laravel
  await new Promise((r) => setTimeout(r, 1000));

  const newLink: Shortlink = {
    id: `new-${Date.now()}`,
    title: data.title || "Untitled",
    shortUrl: `short.link/${
      data.alias || Math.random().toString(36).substr(7)
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

  MOCK_DB.unshift(newLink); // Tambah ke depan
  return newLink;
};

export const updateLink = async (
  id: string,
  data: EditableLinkData
): Promise<Shortlink> => {
  // NANTI GANTI JADI: fetch PUT ke Laravel
  await new Promise((r) => setTimeout(r, 800));

  const index = MOCK_DB.findIndex((l) => l.id === id);
  if (index === -1) throw new Error("Link not found");

  const updatedLink = {
    ...MOCK_DB[index],
    ...data,
    passwordProtected: !!data.password,
    shortUrl: `short.link/${data.alias}`, // Simulasi update alias
  };

  MOCK_DB[index] = updatedLink;
  return updatedLink;
};

export const toggleLinkStatus = async (
  id: string,
  currentStatus: "active" | "disabled"
): Promise<Shortlink> => {
  // NANTI GANTI JADI: fetch PATCH ke Laravel
  await new Promise((r) => setTimeout(r, 600));

  const index = MOCK_DB.findIndex((l) => l.id === id);
  if (index === -1) throw new Error("Link not found");

  const newStatus = currentStatus === "active" ? "disabled" : "active";
  MOCK_DB[index].status = newStatus;

  return MOCK_DB[index];
};
