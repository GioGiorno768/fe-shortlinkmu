// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  X,
  FileText,
  Package,
  Menu,
  Link2,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Link2, label: "My Links", href: "/mylinks" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();

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
          {/* Header */}
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
                <div className="flex items-center gap-2">
                  <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
                  <span className="font-semibold text-[1.6em] lg:hidden block">
                    ShortLinkMu
                  </span>
                </div>

                {/* Close button mobile */}
                {/* <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button> */}
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
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                  flex items-center gap-3 px-[3em] py-3 rounded-md mb-1
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                >
                  <Icon
                    className={`${
                      isCollapsed ? "w-6 h-6" : "w-5 h-5"
                    } flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium text-[1.6em] line-clamp-1">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}

        {!isCollapsed ? (
          <div className=" p-[1.5em] border-t border-slate-800">
            <div className="flex items-center gap-3 hover:bg-[#1f2545] p-[1.5em] rounded-md transition-all duration-200 cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-[2em] h-[2em] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-[1.6em]"></div>
                {/* <span className="font-semibold text-[1.6em]">ShortLinkMu</span> */}
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
                {/* <span className="font-semibold text-[1.6em]">ShortLinkMu</span> */}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
