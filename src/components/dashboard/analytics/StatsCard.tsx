// src/components/dashboard/StatsCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import clsx from "clsx";

// Definisikan tipe untuk props
interface StatsCardProps {
  icon: LucideIcon;
  color: Array<string>;
  label: string;
  apiEndpoint: string;
}

// 1. UPDATE TIPE DATA: Tambah "allTime"
type TimeRange = "allTime" | "perWeek" | "perMonth" | "perYear";

// --- FUNGSI API SETUP (MOCK) ---
async function fetchStats(endpoint: string, range: TimeRange) {
  console.log(`MANGGIL API: ${endpoint}?range=${range}`);

  await new Promise((resolve) => setTimeout(resolve, 500));

  // 2. LOGIC DATA "allTime"
  if (endpoint.includes("earnings")) {
    switch (range) {
      case "allTime":
        return { value: "$1,540,205", subtitleKey: "allTime" }; // Total Gede
      case "perWeek":
        return { value: "$1,234", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "$700,678", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "$45,231", subtitleKey: "perYear" };
    }
  } else if (endpoint.includes("referral")) {
    switch (range) {
      case "allTime":
        return { value: "12,500", subtitleKey: "allTime" };
      case "perWeek":
        return { value: "50", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "240", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "3,500", subtitleKey: "perYear" };
    }
  } else if (endpoint.includes("clicks") || endpoint.includes("totalClicks")) {
    switch (range) {
      case "allTime":
        return { value: "5.2M", subtitleKey: "allTime" };
      case "perWeek":
        return { value: "120K", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "600K", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "2.8M", subtitleKey: "perYear" };
    }
  } else {
    // Default / Views / CPM
    switch (range) {
      case "allTime":
        return { value: "15.4M", subtitleKey: "allTime" };
      case "perWeek":
        return { value: "500K", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "2.5M", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "10M", subtitleKey: "perYear" };
    }
  }

  return { value: "0", subtitleKey: "perMonth" };
}

export default function StatsCard({
  icon: Icon,
  color,
  label,
  apiEndpoint,
}: StatsCardProps) {
  const t = useTranslations("Dashboard");
  const [textColor, bgColor, borderColor] = color;

  const [isLoading, setIsLoading] = useState(true);
  const [displayValue, setDisplayValue] = useState("...");

  // Default subtitle ambil dari translation key "allTime"
  const [subtitle, setSubtitle] = useState(t("allTime"));

  // Default Selected: "allTime"
  const [selectedRange, setSelectedRange] = useState<TimeRange>("allTime");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. LIST OPSI BARU (Semua Waktu di Paling Atas)
  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "allTime", label: t("allTime") }, // <--- Paling Atas
    { key: "perWeek", label: t("perWeek") },
    { key: "perMonth", label: t("perMonth") },
    { key: "perYear", label: t("perYear") },
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchStats(apiEndpoint, selectedRange);
      setDisplayValue(data.value);
      setSubtitle(t(data.subtitleKey));
      setIsLoading(false);
    }
    loadData();
  }, [selectedRange, apiEndpoint, t]);

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {label}
        </p>

        {/* Tombol Dropdown (Hamburger Style Original) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-[3.2em] h-[3.2em] flex items-center justify-center rounded-lg hover:bg-blue-dashboard transition-colors duration-300"
          >
            <span className="solar--hamburger-menu-broken w-[2.5em] h-[2.5em] bg-shortblack hover:bg-bluelight transition-colors duration-300" />
          </button>

          {/* Menu Dropdown */}
          <div
            className={`absolute top-[4em] p-[1em] transition-all duration-300 origin-top-right w-max right-0 bg-white rounded-lg shadow-lg shadow-slate-500/50 grid grid-cols-1 z-10 ${
              isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => handleRangeChange(range.key)}
                className={`text-[1.4em] px-[1.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300 text-start ${
                  selectedRange === range.key
                    ? "text-bluelight font-semibold bg-blue-dashboard"
                    : "text-shortblack"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body: Value & Icon */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-[6em] flex items-center">
            {isLoading ? (
              <Loader2 className="w-[3em] h-[3em] text-bluelight animate-spin" />
            ) : (
              <h3 className="text-[3em] font-semibold text-bluelight font-manrope line-clamp-1">
                {displayValue}
              </h3>
            )}
          </div>
          {/* Subtitle bakal berubah sesuai pilihan: Total Semua Waktu / Minggu Ini / dll */}
          <p className="text-[1.4em] text-grays">Total {subtitle}</p>
        </div>

        <div
          className={`w-[5em] h-[5em] rounded-full flex justify-center items-center ${bgColor} border-2 ${borderColor}`}
        >
          <Icon className={`w-[2.5em] h-[2.5em] ${textColor}`}></Icon>
        </div>
      </div>
    </div>
  );
}
