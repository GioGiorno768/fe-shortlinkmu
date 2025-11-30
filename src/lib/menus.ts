import {
  LayoutDashboard,
  Users,
  Link as LinkIcon,
  Wallet,
  ShieldAlert,
  FileText,
  Megaphone,
  Settings,
  LineChart,
  UserCog,
  ServerCog,
  ClipboardList,
  Database,
  Link2,
  PlusSquare,
  ChartSpline,
  UserPlus2,
  BanknoteArrowDown,
  History,
  Crown,
} from "lucide-react";
import type { Role, NavItem } from "@/types/type";

// === MENU MEMBER (Gak berubah) ===
export const getMemberMenu = (t: any): NavItem[] => [
  { icon: LayoutDashboard, label: t("title"), href: "/dashboard" },
  { icon: Megaphone, label: t("adsInfo"), href: "/ads-info" },
  {
    icon: Link2,
    label: t("myLinks"),
    children: [
      { icon: PlusSquare, label: t("createLink"), href: "/new-link" },
      { icon: Link2, label: t("subs4unlock"), href: "https://subs4unlock.id" },
    ],
  },
  { icon: ChartSpline, label: t("analytics"), href: "/analytics" },
  { icon: Crown, label: "Levels", href: "/levels" },
  { icon: UserPlus2, label: t("referral"), href: "/referral" },
  { icon: BanknoteArrowDown, label: t("withdrawal"), href: "/withdrawal" },
  { icon: History, label: t("history"), href: "/history" },
];

// === MENU ADMIN & SUPER ADMIN (REVISI FIX) ===
export const getAdminMenu = (role: Role = "admin"): NavItem[] => {
  // 1. OPERATIONAL (Menu Staff Harian)
  // Ads Configuration HILANG dari sini
  const operationalMenu: NavItem[] = [
    { label: "OPERATIONAL", isHeader: true },
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Manage Users", href: "/admin/users" },
    { icon: LinkIcon, label: "Manage Links", href: "/admin/links" },
    {
      icon: Wallet,
      label: "Withdrawals",
      href: "/admin/withdrawals",
    },
    { icon: ShieldAlert, label: "Abuse Reports", href: "/admin/reports" },
    {
      icon: FileText,
      label: "Announcements",
      href: "/admin/announcements",
    },
  ];

  // 2. CORE SYSTEM (Menu Owner / Super Admin)
  // Ads Configuration PINDAH kesini
  const coreSystemMenu: NavItem[] = [
    { label: "CORE SYSTEM", isHeader: true },
    {
      icon: LineChart,
      label: "Total Profit (Platform)",
      href: "/admin/profit",
    },
    { icon: Megaphone, label: "Ads Configuration", href: "/admin/ads-levels" }, // <--- PINDAH SINI
    { icon: UserCog, label: "Manage Admins", href: "/admin/manage-admins" },
    {
      icon: ServerCog,
      label: "System Settings",
      href: "/admin/system-settings",
    },
    { icon: ClipboardList, label: "Audit Logs", href: "/admin/audit" },
    { icon: Database, label: "Database & Backup", href: "/admin/database" },
  ];

  // 3. ACCOUNT (Semua Punya)
  // const accountMenu: NavItem[] = [
  //   { label: "ACCOUNT", isHeader: true },
  //   { icon: Settings, label: "My Profile Settings", href: "/admin/profile" },
  // ];

  // LOGIC PENGGABUNGAN:
  if (role === "super-admin") {
    // Super Admin = Operational + Core System + Account
    return [...operationalMenu, ...coreSystemMenu];
  }

  // Admin Biasa = Operational + Account (GAK ADA Ads Config)
  return [...operationalMenu];
};
