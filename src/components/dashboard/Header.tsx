// src/components/Header.tsx
"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  WalletMinimal,
  MoonStar,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

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
  const t = useTranslations("Dashboard");
  const locale = useLocale(); // 'en' atau 'id'
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (nextLocale: "en" | "id") => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const head = [
    { name: t("balance"), icon: "solar--wallet-linear", value: "$80,210" },
    {
      name: t("payout"),
      icon: "hugeicons--money-send-circle",
      value: "$10,210",
    },
    { name: t("cpc"), icon: "icon-park-outline--click-tap", value: "$0,010" },
  ];
  return (
    <nav
      className={`
        fixed top-0 right-0 
        left-0
        ${isCollapsed ? "lg:left-20" : "lg:left-64"}
        transition-all duration-300 ease-in-out z-30
        px-4 lg:px-8 pt-6
        font-figtree bg-slate-50
      `}
    >
      <div className="shadow-sm shadow-slate-500/50 rounded-xl flex items-center justify-between px-[1em] lg:px-[4em] lg:py-[1.5em] py-[.6em]  text-[10px] bg-white">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={openMobileSidebar}
            className="p-2 hover:text-slate-600 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-shortblack " />
          </button>

          {/* Cash Info */}
          <div className="sm:flex hidden cursor-default ">
            {head.map((item, index) => (
              <div
                key={index}
                title={item.name}
                className={`sm:flex flex-col gap-[.8em] ${
                  index != 2 && "border-r-[.2em] border-gray-dashboard pr-[3em]"
                } ${index != 0 && "pl-[3em]"} `}
              >
                <span className="text-gray-text text-[1.6em] tracking-tight ">
                  {item.name}
                </span>
                <div className="flex gap-[1.8em] justify-start items-center">
                  <span
                    className={`${item.icon} ${
                      index == 1
                        ? "w-[2.3em] h-[2.3em]"
                        : index == 2
                        ? "w-[2.5em] h-[2.5em]"
                        : "w-[2.8em] h-[2.8em]"
                    } bg-bluelight`}
                  ></span>
                  <span className="text-[1.8em] font-manrope font-semibold">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 lg:gap-[2em]">
          {/* bahasa */}
          <div className="flex items-center bg-blues rounded-full p-[0.5em] border border-bluelight/10">
            <button
              onClick={() => switchLanguage("en")}
              disabled={isPending}
              className={`px-[1.2em] py-[0.5em] rounded-full text-[1.4em] font-semibold transition-all ${
                locale === "en"
                  ? "bg-bluelight text-white shadow-md"
                  : "text-grays hover:text-bluelight"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLanguage("id")}
              disabled={isPending}
              className={`px-[1.2em] py-[0.5em] rounded-full text-[1.4em] font-semibold transition-all ${
                locale === "id"
                  ? "bg-bluelight text-white shadow-md"
                  : "text-grays hover:text-bluelight"
              }`}
            >
              ID
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-[5em] h-[5em] flex justify-center items-center rounded-full lg:hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {isDark ? (
              <span className="solar--cloudy-moon-broken w-[3em] h-[3em] bg-bluelight " />
            ) : (
              <span className="solar--sun-broken w-[3em] h-[3em] bg-bluelight " />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 lg:hover:-translate-y-1 translition-all duration-300 ease-in-out relative">
            <Bell className="w-[2.8em] h-[2.8em] text-bluelight stroke-[.15em]" />
            <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
