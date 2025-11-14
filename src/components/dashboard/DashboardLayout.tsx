// src/components/DashboardLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./Header";
import { Link, usePathname } from "@/i18n/routing";
import Breadcrumb from "./Breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openMobileSidebar = () => {
    setIsMobileOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={closeMobileSidebar}
        toggleSidebar={toggleSidebar}
      />
      <Header
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        openMobileSidebar={openMobileSidebar}
      />

      <main
        className={`
          ${isCollapsed ? "custom:ml-20" : "custom:ml-64"}
          pt-[9.2em] px-4 custom:px-8 py-2
          transition-all duration-300 ease-in-out
          min-h-screen
        `}
      >
        <div className="bg-white w-full py-[1em] lg:px-[2.5em] px-[1.5em] mb-[1.5em] rounded-xl shadow-sm shadow-slate-500/50" >
          <Breadcrumb />
        </div>
        {children}
      </main>
    </div>
  );
}
