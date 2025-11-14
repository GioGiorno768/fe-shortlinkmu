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
