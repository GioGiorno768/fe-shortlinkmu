export type NavItem = {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: NavItem[];
};

// Tipe data untuk list link di card
export type TopLinkItem = {
  id: string;
  shortUrl: string; // cth: short.link/asu12
  originalUrl: string; // cth: https://www.youtube.com/watch...
  totalViews: number; // cth: 5100
  totalEarnings: number; // cth: 22.95
  cpm: number; // cth: 4.50
  alias?: string; // Buat di modal edit
  password?: string; // Buat di modal edit
  expiresAt?: string; // Buat di modal edit (format ISO date string)
};

// Tipe data untuk form di modal
export type EditableLinkData = {
  alias: string;
  password?: string;
  expiresAt?: string; // Bisa pake string (date) atau Date object
};

export type UserLevel =
  | "beginner"
  | "rookie"
  | "elite"
  | "pro"
  | "master"
  | "mythic";

export interface TopTrafficStats {
  topMonth: {
    month: string; // e.g., "February"
    views: number; // e.g., 405000
  };
  topYear: {
    year: string; // e.g., "2025"
    views: number; // e.g., 805000
  };
  topLevel: {
    level: UserLevel;
    cpmBonusPercent: number; // e.g., 20
  };
}

export interface CountryStat {
  isoCode: string; // "us", "id", "gb"
  name: string;
  views: number;
  percentage: number; // 0-100
}

// --- TAMBAHKAN TIPE DI BAWAH INI ---
export interface ReferrerStat {
  name: string; // "Google", "Facebook", "Direct", "blog.example.com"
  views: number;
  percentage: number; // 0-100
}

export type AdLevel = "noAds" |"level1" | "level2" | "level3" | "level4";

export interface CreateLinkFormData {
  url: string;
  alias?: string;
  password?: string;
  title?: string;
  expiresAt?: string;
  adsLevel: AdLevel;
}

export interface GeneratedLinkData {
  shortUrl: string; // cth: short.link/taik112
  originalUrl: string; // cth: https://kevinragil.vercel.app
}
