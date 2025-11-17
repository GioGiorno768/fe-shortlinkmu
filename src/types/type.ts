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

// Tipe data dari API untuk satu level (kolom)
export interface ApiAdLevel {
  key: AdLevel; // "noAds" | "level1" | "level2" | "level3" | "level4"
  nameKey: string; // Ini adalah i18n key, cth: "adsLevel1"
  isRecommended: boolean;
}

// Tipe data untuk value prefixed_string
export interface PrefixedStringValue {
  prefixKey?: string; // i18n key for prefix (cth: "upto10")
  value: string; // "10", "$15", dll
}

// Tipe data dari API untuk satu fitur (baris)
export interface ApiAdFeature {
  nameKey: string; // i18n key, cth: "cpmRate"
  displayType: "boolean" | "string" | "prefixed_string";
  values: Record<
    string,
    boolean | string | PrefixedStringValue
  >; // cth: { level1: true, level2: "Low", level3: { prefixKey: "upto10", value: "10" } }
}

// Tipe data response API utama
export interface AdsComparisonData {
  levels: ApiAdLevel[];
  features: ApiAdFeature[];
}