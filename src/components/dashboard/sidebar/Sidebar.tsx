// src/components/dashboard/Sidebar.tsx

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Package,
  Link2,
  PlusSquare,
  ChevronDown,
} from "lucide-react";
import { NavItem } from "@/types/type";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
}

// ==================================================================
// === KOMPONEN UTAMA SIDEBAR (TIDAK BANYAK BERUBAH) ===
// ==================================================================

// Ini variabel global, di luar komponen
let menuItems: NavItem[] = [];

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  // Definisikan menuItems (sekarang bisa diakses global di file ini)
  menuItems = [
    { icon: LayoutDashboard, label: t("title"), href: "/dashboard" },
    {
      icon: Link2,
      label: t("myLinks"),
      children: [
        { icon: PlusSquare, label: t("createLink"), href: "/new-link" },
        { icon: Link2, label: t("subs4unlock"), href: "/subs4unlock" },
      ],
    },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-[#10052C] text-shortblack h-screen fixed left-0 top-0 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0 z-50" : "-translate-x-full"}
          lg:translate-x-0 lg:z-40 font-figtree lg:text-[10px] text-[8px] flex flex-col justify-between
        `}
      >
        <div>
          {/* Header Sidebar (Logo & Toggle) */}
          <div
            className={`flex w-full items-center justify-between ${
              isCollapsed ? "px-[2em]" : "px-[3em]"
            } py-[2em] text-white`}
          >
            {isCollapsed ? (
              <div>
                <button
                  onClick={toggleSidebar}
                  className=" hover:bg-white dark:hover:bg-[#1f2545] rounded-lg w-fit transition-colors hidden lg:flex items-center justify-center p-2"
                >
                  <span className="solar--sidebar-minimalistic-broken w-[2.5em] h-[2.5em] bg-slate-600 hover:bg-white dark:bg-slate-400"></span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
                  <span className="font-semibold text-[1.6em] lg:hidden block">
                    ShortLinkMu
                  </span>
                </Link>
                <div>
                  <button
                    onClick={toggleSidebar}
                    className=" hover:bg-slate-100 dark:hover:bg-[#1f2545] rounded-lg w-fit transition-colors hidden lg:flex items-center justify-center p-2"
                  >
                    <span className="solar--sidebar-minimalistic-broken w-[2.5em] h-[2.5em] bg-slate-600 hover:bg-white dark:bg-slate-400"></span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Menu Items */}
          <nav className="mt-[1em] px-[1em]">
            {menuItems.map((item) => {
              const isActive = item.href === pathname;
              const isChildActive =
                item.children?.some((child) => child.href === pathname) ??
                false;

              return (
                <SidebarItem
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  isChildActive={isChildActive}
                  onClose={onClose}
                />
              );
            })}
          </nav>
        </div>

        {/* User Profile (Tetap sama) */}
        {!isCollapsed ? (
          <div className=" p-[1.5em] border-t border-slate-800">
            <div className="flex items-center gap-3 hover:bg-[#1f2545] p-[1.5em] rounded-md transition-all duration-200 cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-white text-[1.5em]">
                  John Doe
                </p>
                <p className="text-xs text-slate-400 truncate">
                  Kevinragil768@gmail.com
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className=" p-[1em] border-t border-slate-800">
            <div className="flex items-center hover:bg-[#1f2545] p-[1.5em] rounded-md transition-all duration-200 cursor-default">
              <div className="flex items-center">
                <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
