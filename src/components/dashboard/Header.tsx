// src/components/Header.tsx
"use client";

import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
}

export default function Header({
  isCollapsed,
  toggleSidebar,
  openMobileSidebar,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <nav
      className={`
        fixed top-0 right-0 h-16 
        left-0
        ${isCollapsed ? "lg:left-20" : "lg:left-64"}
        bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out z-30
        flex items-center justify-between px-4 lg:px-6
      `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={openMobileSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Desktop collapse button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden lg:block"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white
                     transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Mobile Search Icon */}
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden">
          <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button className="ml-1 lg:ml-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 pr-2 lg:pr-3 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-semibold text-white text-sm">
            JD
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden xl:block">
            John Doe
          </span>
        </button>
      </div>
    </nav>
  );
}
