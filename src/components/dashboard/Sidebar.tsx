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
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
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
          bg-slate-900 text-white h-screen fixed left-0 top-0 
          transition-all duration-300 ease-in-out
          border-r border-slate-800
          
          ${isCollapsed ? "w-20" : "w-64"}
          
          ${isMobileOpen ? "translate-x-0 z-50" : "-translate-x-full"}
          lg:translate-x-0 lg:z-40
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className={`mt-6 px-3`}>
            <button
              onClick={toggleSidebar}
              className=" hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg w-fit transition-colors hidden lg:flex items-center justify-center p-2"
            >
              <span className="solar--sidebar-minimalistic-broken w-[1.5em] h-[1.5em] bg-slate-600 dark:bg-slate-300"></span>
            </button>
          </div>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl mx-auto">
              D
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl">
                  D
                </div>
                <span className="font-bold text-xl">Dashboard</span>
              </div>

              {/* Close button mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg mb-1
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}

        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-semibold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">John Doe</p>
                <p className="text-xs text-slate-400 truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
