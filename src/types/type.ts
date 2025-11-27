export type NavItem = {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: NavItem[];
};
export type AdLevel = "noAds" | "level1" | "level2" | "level3" | "level4";

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
  adsLevel?: AdLevel;
  passwordProtected: boolean;
};

// Tipe data untuk form di modal
export type EditableLinkData = {
  alias: string;
  password?: string;
  expiresAt?: string; // Bisa pake string (date) atau Date object
  adsLevel: AdLevel;
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

export interface AdFeature {
  label: string; // cth: "Popunder"
  value: string | boolean; // cth: "1 per 24h" atau true
  included: boolean; // Buat nampilin icon Check atau Silang
}

export interface AdLevelConfig {
  id: string;
  name: string; // Low, Medium, High, Aggressive
  slug: string; // low, medium, high, aggressive
  description: string;
  cpmRate: string; // cth: "$3.50"
  revenueShare: number; // cth: 50 (persen)
  isPopular?: boolean; // Buat highlight card
  demoUrl: string; // Link redirect ke demo
  features: AdFeature[];
  colorTheme: string; // Buat styling border/badge (green, blue, orange, red)
}

export interface ReferralStats {
  totalEarnings: number;
  totalReferred: number;
  activeReferred: number;
  commissionRate: number; // dalam persen (misal 20)
}

export interface ReferredUser {
  id: string;
  name: string; // cth: "Udin Petot"
  emailHidden: string; // cth: "ud***@gmail.com"
  dateJoined: string;
  totalEarningsForMe: number; // Berapa yang dihasilkan user ini buat kita
  status: "active" | "inactive";
}

export interface WithdrawalStats {
  availableBalance: number;
  pendingWithdrawn: number;
  totalWithdrawn: number;
}

export interface PaymentMethod {
  provider: string; // cth: "PayPal", "Bank Transfer"
  accountName: string; // cth: "Kevin Ragil"
  accountNumber: string; // cth: "1234567890" (masked)
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string; // cth: "PayPal"
  account: string; // cth: "kevin***@gmail.com"
  status: "pending" | "approved" | "completed" | "rejected" | "cancelled";
  txId?: string; // ID referensi transfer
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  username: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string; // tgl terakhir ganti
  isSocialLogin: boolean; // <--- TAMBAHIN INI BROK
}

export interface NotificationSettings {
  emailLogin: boolean;
  emailWithdrawal: boolean;
  emailMarketing: boolean;
}

// ... tipe data lain

export type ActivityType = "login" | "security" | "link" | "payment" | "system";

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string; // cth: "Login Berhasil"
  description: string; // cth: "Login dari Chrome di Windows (192.168.1.1)"
  timestamp: string; // ISO Date
  ipAddress?: string;
  device?: string;
  status: "success" | "warning" | "failed";
}

export type NotificationType = "info" | "warning" | "success" | "alert";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: string; // ISO String
}

export interface LevelConfig {
  no: number;
  id: UserLevel;
  name: string;
  minEarnings: number; // <--- GANTI INI (Dulu minViews)
  cpmBonus: number;
  benefits: string[];
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

export interface UserLevelProgress {
  currentLevel: UserLevel;
  currentEarnings: number; // <--- GANTI INI
  nextLevelEarnings: number; // <--- GANTI INI
  progressPercent: number;
}

export interface SavedPaymentMethod {
  id: string; // ID unik dari database (uuid/id)
  provider: string; // DANA, PayPal, BCA, dll
  accountName: string; // Nama pemilik
  accountNumber: string; // Nomor rekening/HP/Email
  isDefault: boolean; // Penanda kalo ini metode utama
  category: "wallet" | "bank" | "crypto"; // Opsional, buat grouping icon
}

export interface PrivacySettings {
  loginAlert: boolean;
  cookieConsent: boolean;
  saveLoginInfo: boolean;
}

export interface UserPreferences {
  language: "en" | "id";
  currency: "USD" | "IDR" | "MYR" | "SGD";
  timezone: string;
  // 👇 GANTI KEY JADI 'privacy'
  privacy: PrivacySettings;
}

