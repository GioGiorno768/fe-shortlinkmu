// src/components/dashboard/StatsCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Loader2, type LucideIcon } from "lucide-react"; // Import Loader2 buat loading

// Definisikan tipe untuk props
interface StatsCardProps {
  icon: LucideIcon;
  color: Array<string>;
  label: string;
  apiEndpoint: string; // Ini buat endpoint API (cth: "/api/stats/clicks")
}

type TimeRange = "perWeek" | "perMonth" | "perYear";

// --- INI FUNGSI API SETUP (MOCK/DUMMY) ---
// Nanti lu tinggal ganti isi fungsi ini buat manggil API backend lu
async function fetchStats(endpoint: string, range: TimeRange) {
  // GANTI BAGIAN INI DENGAN API LU
  console.log(`MANGGIL API: ${endpoint}?range=${range}`);

  // CONTOH PAKE FETCH BENERAN:
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}?range=${range}`, {
  //   headers: {
  //     // Mungkin butuh token auth
  //     'Authorization': `Bearer ${token}`
  //   }
  // });
  // const data = await response.json();
  //
  // // Pastikan data yang dikembalikan sesuai format
  // return {
  //   value: data.formattedValue, // cth: "$1,234"
  //   subtitleKey: data.rangeKey   // cth: "perWeek"
  // }

  // Simulasi loading
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Data dummy sesuai permintaan lu
  if (endpoint.includes("earnings")) {
    switch (range) {
      case "perWeek":
        return { value: "$1,234", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "$700,678", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "$45,231", subtitleKey: "perYear" };
    }
  } else if (endpoint.includes("referral")) {
    // Asumsi default-nya "clicks"
    switch (range) {
      case "perWeek":
        return { value: "580", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "600.345", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "28,190", subtitleKey: "perYear" };
    }
  } else {
    // Asumsi default-nya "clicks"
    switch (range) {
      case "perWeek":
        return { value: "500", subtitleKey: "perWeek" };
      case "perMonth":
        return { value: "600,000", subtitleKey: "perMonth" };
      case "perYear":
        return { value: "28,000", subtitleKey: "perYear" };
    }
  }

  // Fallback
  return { value: "0", subtitleKey: "perMonth" };
}
// ---------------------------------------------

export default function StatsCard({
  icon: Icon,
  color,
  label,
  apiEndpoint,
}: StatsCardProps) {
  const t = useTranslations("Dashboard");
  const [textColor, bgColor, borderColor] = color;

  // State buat data yang tampil
  const [isLoading, setIsLoading] = useState(true);
  const [displayValue, setDisplayValue] = useState("...");
  const [subtitle, setSubtitle] = useState(t("perMonth"));

  // State buat dropdown
  const [selectedRange, setSelectedRange] = useState<TimeRange>("perMonth");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Opsi dropdown
  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "perWeek", label: t("perWeek") },
    { key: "perMonth", label: t("perMonth") },
    { key: "perYear", label: t("perYear") },
  ];

  // Efek buat fetch data pas `selectedRange` berubah
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const data = await fetchStats(apiEndpoint, selectedRange);

      setDisplayValue(data.value);
      setSubtitle(t(data.subtitleKey)); // Ambil subtitle dari translation
      setIsLoading(false);
    }
    loadData();
  }, [selectedRange, apiEndpoint, t]);

  // Efek buat nutup dropdown pas klik di luar
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handler pas milih range
  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {label} {/* Label dari props (cth: "Total Clicks") */}
        </p>

        {/* Ini tombol dropdown-nya */}
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
                    ? "text-bluelight font-semibold"
                    : "text-shortblack"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {/* Tampilan value (data) */}
          <div className="h-[6em] flex items-center">
            {" "}
            {/* Kasih tinggi biar ga lompat */}
            {isLoading ? (
              <Loader2 className="w-[3em] h-[3em] text-bluelight animate-spin" />
            ) : (
              <h3 className="text-[3em] font-semibold text-bluelight font-manrope line-clamp-1">
                {displayValue}
              </h3>
            )}
          </div>
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
