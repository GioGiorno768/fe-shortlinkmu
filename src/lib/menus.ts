import {
  LayoutDashboard,
  Megaphone,
  Link2,
  PlusSquare,
  ChartSpline,
  UserPlus2,
  BanknoteArrowDown,
  History,
  ShieldAlert,
  Users,
  Settings,
  Crown,
} from "lucide-react";

// Menu untuk MEMBER
export const getMemberMenu = (t: any) => [
  { icon: LayoutDashboard, label: t("title"), href: "/dashboard" },
  { icon: Megaphone, label: t("adsInfo"), href: "/ads-info" },
  {
    icon: Link2,
    label: t("myLinks"),
    children: [
      { icon: PlusSquare, label: t("createLink"), href: "/new-link" },
      {
        icon: Link2,
        label: t("subs4unlock"),
        href: "https://subs4unlock.id",
      },
    ],
  },
  { icon: ChartSpline, label: t("analytics"), href: "/analytics" },
  // --- TAMBAHIN INI ---
  { icon: Crown, label: "Levels", href: "/levels" },
  // (Bisa tambahin key 'levels' di en.json/id.json kalo mau translate)
  { icon: UserPlus2, label: t("referral"), href: "/referral" },
  { icon: BanknoteArrowDown, label: t("withdrawal"), href: "/withdrawal" },
  { icon: History, label: t("history"), href: "/history" },
];

// Menu untuk ADMIN (Bisa tambah t() juga nanti)
export const getAdminMenu = () => [
  {
    icon: LayoutDashboard,
    label: "Admin Dashboard",
    href: "/admin/dashboard",
  },
  { icon: Users, label: "Manage Users", href: "/admin/users" },
  { icon: ShieldAlert, label: "Abuse Reports", href: "/admin/reports" },
  { icon: Megaphone, label: "Ads Settings", href: "/admin/ads-levels" },
  { icon: Settings, label: "System Settings", href: "/admin/settings" },
];
