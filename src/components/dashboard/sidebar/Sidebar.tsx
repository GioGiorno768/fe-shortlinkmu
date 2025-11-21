// src/components/dashboard/sidebar/Sidebar.tsx
"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Package,
  Link2,
  PlusSquare,
  User,
  Mail,
  LogOut,
  ChartSpline,
  UserPlus2,
  BanknoteArrowDown,
  History,
  Megaphone,
} from "lucide-react";
import SidebarItem from "./SidebarItem"; // Asumsi ini ada di folder yang sama
import { NavItem } from "@/types/type";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
  menuItems: NavItem[]; // <--- TERIMA PROPS INI
  role?: "member" | "admin"; // Optional buat styling
}

// export const getMenuItems = (t: (key: string) => string): NavItem[] => [
//   { icon: LayoutDashboard, label: t("title"), href: "/dashboard" },
//   { icon: Megaphone, label: t("adsInfo"), href: "/ads-info" },
//   {
//     icon: Link2,
//     label: t("myLinks"),
//     children: [
//       { icon: PlusSquare, label: t("createLink"), href: "/new-link" },
//       { icon: Link2, label: t("subs4unlock"), href: "https://subs4unlock.id" },
//     ],
//   },
//   { icon: ChartSpline, label: t("analytics"), href: "/analytics" },
//   { icon: UserPlus2, label: t("referral"), href: "/referral" },
//   { icon: BanknoteArrowDown, label: t("withdrawal"), href: "/withdrawal" },
//   { icon: History, label: t("history"), href: "/history" },
// ];

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  toggleSidebar,
  menuItems, // <--- PAKE INI
  role = "member",
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  // const menuItems = getMenuItems(t);

  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const userPopupRef = useRef<HTMLDivElement>(null);

  const userMenuItems = [
    // { icon: User, label: t("myProfile"), href: "/profile" },
    { icon: Settings, label: t("settings"), href: "/settings" },
    { icon: LogOut, label: t("logOut"), href: "/logout" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target as Node)
      ) {
        setIsUserPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userPopupRef]);

  useEffect(() => {
    setIsUserPopupOpen(false);
  }, [isCollapsed, isMobileOpen]);

  const UserPopupContent = () => (
    <>
      {userMenuItems.map((item) => {
        const isChildActive =
          pathname === item.href || pathname === `/id${item.href}`;
        return (
          <div key={item.label}>
            {item.label === t("logOut") ? (
              <>
                <div className="h-px bg-slate-700 my-1 mx-3" />
                <button
                  onClick={() => {
                    setIsUserPopupOpen(false);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:bg-[#1f2545] hover:text-white transition-colors duration-200 text-[1.4em] w-full ${
                    isChildActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => {
                  setIsUserPopupOpen(false);
                  onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:bg-[#1f2545] hover:text-white transition-colors duration-200 text-[1.4em] ${
                  isChildActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 custom:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-[#10052C] text-shortblack h-screen fixed left-0 top-0 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0 z-50" : "-translate-x-full z-50"}
          custom:translate-x-0 custom:z-40 font-figtree custom:text-[10px] text-[8px] flex flex-col justify-between
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
                  className=" hover:bg-white dark:hover:bg-[#1f2545] rounded-lg w-fit transition-colors hidden custom:flex items-center justify-center p-2"
                >
                  <span className="solar--sidebar-minimalistic-broken w-[2.5em] h-[2.5em] bg-slate-600 hover:bg-white dark:bg-slate-400"></span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
                  <span className="font-semibold text-[1.6em] custom:hidden block">
                    ShortLinkMu
                  </span>
                </Link>
                <div>
                  <button
                    onClick={toggleSidebar}
                    className=" hover:bg-slate-100 dark:hover:bg-[#1f2545] rounded-lg w-fit transition-colors hidden custom:flex items-center justify-center p-2"
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

        {/* ===================================== */}
        {/* === BAGIAN USER PROFILE (DENGAN TRANSISI) === */}
        {/* ===================================== */}
        <div
          ref={userPopupRef}
          className="relative p-[1em] border-t border-slate-800"
        >
          {/* --- POPUP 1: Mode Expanded (Di atas tombol) --- */}
          <div
            className={`
              absolute bottom-full left-0 right-0 p-2 mx-[1em] mb-1
              bg-[#10052C] shadow-lg rounded-md
              transition-all duration-150 ease-out transform outline-2 outline-[#1f2545]
              ${/* GANTI KELAS INI */ ""}
              ${
                isUserPopupOpen && !isCollapsed
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }
              origin-bottom 
            `}
          >
            <UserPopupContent />
          </div>

          {/* --- POPUP 2: Mode Collapsed (Flyout di samping) --- */}
          <div
            className={`
              absolute bottom-[9em] left-[1em] z-50
              bg-[#10052C] shadow-lg rounded-md p-2 w-max
              transition-all duration-150 ease-out transform outline-2 outline-[#1f2545]
              ${/* GANTI KELAS INI */ ""}
              ${
                isUserPopupOpen && isCollapsed
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }
              origin-left
            `}
          >
            <UserPopupContent />
          </div>

          {/* --- Tombol Trigger (Profil User) --- */}
          <button
            onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
            className={`
              flex items-center gap-3 hover:bg-[#1f2545] p-[1.5em] rounded-md 
              transition-all duration-200 w-full
              ${isCollapsed ? "justify-center" : ""}
              ${isUserPopupOpen ? "bg-[#1f2545]" : ""} 
            `}
          >
            <div className="flex-shrink-0">
              <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium truncate text-white text-[1.5em]">
                  Narancia
                </p>
                <p className="text-xs text-slate-400 truncate">
                  Kevinragil768@gmail.com
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
