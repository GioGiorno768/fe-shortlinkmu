// src/components/dashboard/LinkAnalyticsCard.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import {
  Loader2,
  OctagonAlert,
  ChevronDown,
  ArrowRightIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { AnalyticsData, TimeRange, StatType } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

// WAJIB: Import dinamis buat ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
    </div>
  ),
});

// Props yang diterima dari Parent
interface LinkAnalyticsCardProps {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  // State Filter dikontrol Parent
  range?: TimeRange;
  stat: StatType;
  // Callback buat minta Parent ganti data
  onChangeRange?: (range: TimeRange) => void;
  onChangeStat: (stat: StatType) => void;
  // Optional: Hide range filter if controlled externally
  hideRangeFilter?: boolean;
}

export default function LinkAnalyticsCard({
  data,
  isLoading,
  error,
  range = "perMonth",
  stat,
  onChangeRange,
  onChangeStat,
  hideRangeFilter = false,
}: LinkAnalyticsCardProps) {
  const t = useTranslations("Dashboard");
  const path = usePathname();
  const { format: formatCurrency } = useCurrency();

  // State UI lokal (Dropdown Open/Close)
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isStatOpen, setIsStatOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  // Opsi dropdown
  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "perWeek", label: t("perWeek") },
    { key: "perMonth", label: t("perMonth") },
    { key: "perYear", label: t("perYear") },
  ];

  // 🔧 Note: Only showing options that backend analytics endpoint supports
  // Backend supports: clicks, earnings, valid_clicks (no referrals)
  const statOptions: { key: StatType; label: string }[] = [
    { key: "totalViews", label: t("totalViews") },
    { key: "totalEarnings", label: t("totalEarnings") },
  ];

  // Helper Warna Chart Dinamis
  const getColors = (type: StatType) => {
    switch (type) {
      case "totalEarnings":
        return ["#22c499"]; // Hijau
      case "totalReferral":
        return ["#f59e0b"]; // Orange
      default:
        return ["#350e8f"]; // Ungu (Views)
    }
  };

  const getGradient = (type: StatType) => {
    switch (type) {
      case "totalEarnings":
        return ["#e7fffc"];
      case "totalReferral":
        return ["#fef3c7"];
      default:
        return ["#ffffff"];
    }
  };

  // Konfigurasi Chart (Re-calculate pas props berubah)
  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 300,
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      colors: getColors(stat),
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: getGradient(stat),
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      dataLabels: { enabled: false },
      markers: {
        size: 4,
        hover: { size: 6 },
      },
      tooltip: {
        enabled: true,
        theme: "light",
        x: {
          show: true,
          format: range === "perMonth" ? "Week" : undefined,
        },
        y: {
          // 🔧 FIX: Format tooltip value with currency for earnings
          formatter: (val) =>
            stat === "totalEarnings" ? formatCurrency(val) : val.toFixed(0),
        },
      },
      xaxis: {
        type: "category",
        categories: data?.categories || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          // 🔧 FIX: Show currency format for earnings, integers for views
          formatter: (val) =>
            stat === "totalEarnings" ? formatCurrency(val) : val.toFixed(0),
        },
      },
      grid: {
        show: true,
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
      },
    }),
    [data, stat, range, formatCurrency]
  ); // Dependency array: update kalo data/stat/range ganti

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(event.target as Node))
        setIsRangeOpen(false);
      if (statRef.current && !statRef.current.contains(event.target as Node))
        setIsStatOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("clickAnalytics")}
        </h3>

        {/* Grup Dropdown */}
        <div className="flex items-center gap-2 z-10">
          {path.includes("/dashboard") ? (
            <Link
              href="/analytics"
              className="text-[1.4em] font-medium text-shortblack px-4 group hover:underline transition-all duration-300"
            >
              <span>Detail</span>
              <ArrowRightIcon className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          ) : (
            <>
              {/* Dropdown 1: Tipe Stat */}
              <div className="relative" ref={statRef}>
                <button
                  onClick={() => setIsStatOpen(!isStatOpen)}
                  className="flex items-center gap-2 text-[1.4em] font-medium text-shortblack bg-blues px-[1.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300"
                >
                  {statOptions.find((o) => o.key === stat)?.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isStatOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isStatOpen && (
                  <div className="absolute top-full right-0 mt-2 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {statOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          onChangeStat(opt.key); // Panggil Parent
                          setIsStatOpen(false);
                        }}
                        className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                          stat === opt.key
                            ? "text-bluelight font-semibold bg-blue-dashboard"
                            : "text-shortblack hover:bg-blues"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown 2: Range Waktu - Only show if not hidden */}
              {!hideRangeFilter && onChangeRange && (
                <div className="relative" ref={rangeRef}>
                  <button
                    onClick={() => setIsRangeOpen(!isRangeOpen)}
                    className="flex items-center gap-2 text-[1.4em] font-medium text-shortblack bg-blues px-[1.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300 "
                  >
                    {timeRanges.find((o) => o.key === range)?.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isRangeOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isRangeOpen && (
                    <div className="absolute top-full right-0 mt-2 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {timeRanges.map((r) => (
                        <button
                          key={r.key}
                          onClick={() => {
                            onChangeRange(r.key); // Panggil Parent
                            setIsRangeOpen(false);
                          }}
                          className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                            range === r.key
                              ? "text-bluelight font-semibold bg-blue-dashboard"
                              : "text-shortblack hover:bg-blues"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Body (Chart) */}
      <div className="h-[300px] -ml-[1em]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-redshortlink p-4">
            <OctagonAlert className="w-8 h-8 mx-auto mb-2" />
            <p className="text-[1.4em] font-medium">{error}</p>
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={data?.series || []}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
