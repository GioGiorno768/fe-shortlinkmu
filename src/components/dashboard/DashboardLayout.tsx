// src/components/DashboardLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 ">
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
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
          pt-[8.5em] px-4 lg:px-8 py-2
          transition-all duration-300 ease-in-out
          min-h-screen
        `}
      >
        {children}
      </main>
    </div>
  );
}
