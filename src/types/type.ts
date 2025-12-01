import type { LucideIcon } from "lucide-react";

export type NavItem = {
  icon?: React.ElementType;
  label: string;
  href?: string;
  children?: NavItem[];
  isHeader?: boolean; // <--- PENTING BUAT PEMISAH
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

export type NotificationCategory =
  | "link"
  | "payment"
  | "account"
  | "event"
  | "system";

export type Role = "member" | "admin" | "super-admin";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  category: NotificationCategory; // <--- Wajib ada sekarang
  isRead: boolean;
  timestamp: string;
  actionUrl?: string; // (Opsional) Kalo diklik lari kemana
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

export interface DashboardSlide {
  id: string;
  title: string;
  desc: string;
  cta: string;
  link: string;
  icon: LucideIcon;
  theme: "blue" | "purple" | "orange"; // Batasin string biar sesuai tema css
}

export interface MilestoneData {
  icon: React.ElementType; // Ganti 'any' jadi ini biar lebih aman
  currentLevel: string;
  nextLevel: string;
  currentEarnings: number;
  nextTarget: number;
  currentBonus: number;
  nextBonus: number;
  progress: number;
}

export interface ReferralCardData {
  referralLink: string;
  totalUsers: number;
}

export interface TopPerformingLink {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  validViews: number;
  totalEarnings: number;
  cpm: number;
  adsLevel: AdLevel;
}

export type TimeRange = "perWeek" | "perMonth" | "perYear";

export type StatType = "totalEarnings" | "totalViews" | "totalReferral"; // totalClicks kita hapus aja biar konsisten sama opsi yg ada

export interface AnalyticsData {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

export interface MonthlyStat {
  month: string;
  year: number;
  views: number;
  cpm: number;
  earnings: number;
  level: string;
  growth: number;
}

export interface Shortlink {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  dateCreated: string;
  dateExpired?: string;
  validViews: number;
  totalEarning: number;
  totalClicks: number;
  averageCPM: number;
  adsLevel: AdLevel;
  passwordProtected: boolean;
  password?: string;
  status: "active" | "disabled";
}

// Tipe buat Filter & Sort
export type FilterByType =
  | "date"
  | "topLinks"
  | "dateExpired"
  | "validViews"
  | "totalEarning"
  | "avgCPM"
  | "linkEnabled"
  | "linkDisabled"
  | "linkPassword";

export type SortByType = "highest" | "lowest";

export interface HeaderStats {
  balance: number;
  payout: number;
  cpm: number;
}

export interface AdminHeaderStats {
  pendingWithdrawals: number;
  abuseReports: number;
  newUsers: number;
}

export interface AdminDashboardStats {
  financial: {
    paidToday: number;
    usersPaidToday: number;
    trend: number;
  };
  content: {
    linksCreatedToday: number;
    trend: number;
  };
  security: {
    linksBlockedToday: number;
    trend: number;
  };
}

export type UserStatus = "active" | "suspended" | "process";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  status: UserStatus;
  joinedAt: string;
  lastLogin: string;
  stats: {
    totalLinks: number;
    totalViews: number;
    walletBalance: number;
  };
}

export interface AdminUserStats {
  totalUsers: { count: number; trend: number };
  activeToday: { count: number; trend: number };
  suspendedUsers: { count: number; trend: number };
}

export interface LoginLog {
  id: string;
  ip: string;
  device: string;
  timestamp: string;
  location: string;
  status: "success" | "failed";
}

export interface RecentWithdrawal {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  method: string; // PayPal, Bank Transfer, etc.
  status: "pending" | "approved" | "paid" | "rejected";
  date: string; // ISO Date
  processed_by?: string; // Admin name who approved/paid
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string; // ISO Date
  status: UserStatus;
}

export interface UserDetailData extends AdminUser {
  phoneNumber: string;
  bio?: string;
  paymentMethods: SavedPaymentMethod[];
  withdrawalHistory: Transaction[];
  loginHistory: LoginLog[];
}
