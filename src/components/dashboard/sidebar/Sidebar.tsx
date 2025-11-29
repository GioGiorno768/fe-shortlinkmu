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
import SidebarItem from "./SidebarItem";
import { NavItem } from "@/types/type";
import Image from "next/image"; // Import Image
import { useUser } from "@/hooks/useUser"; // Import Hook User

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
  menuItems: NavItem[];
  role?: "member" | "admin";
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  toggleSidebar,
  menuItems,
  role = "member",
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  // --- 1. PANGGIL HOOK USER (Data Dinamis) ---
  const { user, isLoading } = useUser();

  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const userPopupRef = useRef<HTMLDivElement>(null);

  const userMenuItems = [
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

  // --- 2. FIX TYPE ERROR (Pisahin Render) ---
  const UserPopupContent = () => (
    <>
      {userMenuItems.map((item) => {
        const isChildActive =
          pathname === item.href || pathname === `/id${item.href}`;
        const isLogout = item.label === t("logOut");

        // Class yang sama buat kedua elemen biar DRY
        const itemClass = `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-[1.4em] w-full
          ${
            isChildActive
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
          }`;

        return (
          <div key={item.label}>
            {isLogout && <div className="h-px bg-slate-700 my-1 mx-3" />}

            {/* LOGIC FIX: Render Button ATAU Link secara eksplisit */}
            {isLogout ? (
              <button
                onClick={() => {
                  setIsUserPopupOpen(false);
                  onClose();
                }}
                className={itemClass}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href!}
                onClick={() => {
                  setIsUserPopupOpen(false);
                  onClose();
                }}
                className={itemClass}
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
        {/* === BAGIAN USER PROFILE (DINAMIS) === */}
        {/* ===================================== */}
        <div
          ref={userPopupRef}
          className="sticky bottom-0 p-[1em] border-t border-slate-800"
        >
          {/* Popup Mode Expanded */}
          <div
            className={`
              absolute bottom-full left-0 right-0 p-2 mx-[1em] mb-1
              bg-[#10052C] shadow-lg rounded-md
              transition-all duration-150 ease-out transform outline-2 outline-[#1f2545]
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

          {/* Popup Mode Collapsed */}
          <div
            className={`
              absolute bottom-[9em] left-[1em] z-50
              bg-[#10052C] shadow-lg rounded-md p-2 w-max
              transition-all duration-150 ease-out transform outline-2 outline-[#1f2545]
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

          {/* Tombol Trigger Profile */}
          <button
            onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
            className={`
              flex items-center gap-3 hover:bg-[#1f2545] p-[1.5em] rounded-xl 
              transition-all duration-200 w-full group overflow-hidden
              ${isCollapsed ? "justify-center" : ""}
              ${isUserPopupOpen ? "bg-[#1f2545]" : ""} 
            `}
          >
            {isLoading ? (
              // === LOADING STATE (Skeleton) ===
              <>
                <div className="w-[3em] h-[3em] rounded-full bg-slate-700/50 animate-pulse flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 space-y-2 text-left min-w-0">
                    <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-slate-700/50 rounded animate-pulse" />
                  </div>
                )}
              </>
            ) : (
              // === USER DATA LOADED ===
              <>
                <div className="flex-shrink-0 relative">
                  <div className="w-[2.5em] h-[2.5em] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-[1.6em] overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all">
                    {/* AVATAR IMAGE */}
                    <Image
                      src={
                        user?.avatarUrl ||
                        "https://avatar.iran.liara.run/public/35"
                      }
                      alt="User"
                      width={35}
                      height={35}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium truncate text-white text-[1.5em] group-hover:text-blue-100 transition-colors">
                      {user?.username || "Guest"}
                    </p>
                    <p className="text-xs text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                      {user?.email || "No Email"}
                    </p>
                  </div>
                )}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
