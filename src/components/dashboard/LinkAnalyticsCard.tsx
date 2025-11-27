// src/components/dashboard/LinkAnalyticsCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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

// WAJIB: Import dinamis buat ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
    </div>
  ),
});

// Tipe data buat state
type TimeRange = "perWeek" | "perMonth" | "perYear";
// 1. UPDATE TIPE STAT: Tambahin 'totalReferral'
type StatType =
  | "totalEarnings"
  | "totalViews"
  | "totalClicks"
  | "totalReferral";

// Tipe data yang kita harapin dari API
interface AnalyticsData {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

// --- FUNGSI API SETUP (MOCK) ---
async function fetchAnalyticsData(
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> {
  console.log(`MANGGIL API: /api/analytics?range=${range}&stat=${stat}`);

  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulasi loading

  let data: AnalyticsData = {
    series: [{ name: "Data", data: [] }],
    categories: [],
  };

  // 2. LOGIC LABEL CHART
  let statName = "Total Views";
  if (stat === "totalEarnings") statName = "Earnings";
  if (stat === "totalReferral") statName = "New Referrals";

  // --- DATA DUMMY ---
  if (range === "perWeek") {
    data = {
      series: [{ name: statName, data: [10, 41, 35, 51, 49, 62, 69] }],
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  } else if (range === "perMonth") {
    data = {
      series: [
        {
          name: statName,
          data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 100, 80, 110],
        },
      ],
      categories: [
        "Wk1",
        "Wk2",
        "Wk3",
        "Wk4",
        "Wk5",
        "Wk6",
        "Wk7",
        "Wk8",
        "Wk9",
        "Wk10",
        "Wk11",
        "Wk12",
      ],
    };
  } else {
    // perYear
    data = {
      series: [
        {
          name: statName,
          data: [300, 400, 250, 500, 490, 600, 700, 910, 1250, 1000, 800, 1100],
        },
      ],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  }

  // 3. LOGIC DATA DUMMY KHUSUS TIPE STAT
  // Biar grafiknya kelihatan beda-beda dikit angkanya
  if (stat === "totalEarnings") {
    data.series[0].data = data.series[0].data.map((n) =>
      parseFloat((n / 10).toFixed(2))
    );
  } else if (stat === "totalViews") {
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n * 0.8));
  } else if (stat === "totalReferral") {
    // Data referral biasanya lebih kecil angkanya
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n / 15));
  }

  return data;
}

// Helper buat nentuin warna chart
const getChartColor = (stat: StatType) => {
  switch (stat) {
    case "totalEarnings":
      return ["#22c499"]; // Hijau (Duit)
    case "totalReferral":
      return ["#f59e0b"]; // Orange/Kuning (Mirip icon user referral)
    default:
      return ["#350e8f"]; // Ungu (Klik/Default)
  }
};

const getChartGradient = (stat: StatType) => {
  switch (stat) {
    case "totalEarnings":
      return ["#e7fffc"];
    case "totalReferral":
      return ["#fef3c7"];
    default:
      return ["#ffffff"];
  }
};

export default function LinkAnalyticsCard() {
  const t = useTranslations("Dashboard");
  const path = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRange, setSelectedRange] = useState<TimeRange>("perWeek");
  const [selectedStat, setSelectedStat] = useState<StatType>("totalViews");

  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isStatOpen, setIsStatOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  const [chartSeries, setChartSeries] = useState<ApexAxisChartSeries>([]);
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({});

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "perWeek", label: t("perWeek") },
    { key: "perMonth", label: t("perMonth") },
    { key: "perYear", label: t("perYear") },
  ];

  // 4. UPDATE OPSI DROPDOWN
  const statOptions: { key: StatType; label: string }[] = [
    { key: "totalViews", label: t("totalViews") },
    { key: "totalEarnings", label: t("totalEarnings") },
    { key: "totalReferral", label: t("referral") }, // <-- Opsi Baru
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAnalyticsData(selectedRange, selectedStat);

        setChartSeries(data.series);
        setChartOptions({
          ...baseChartOptions,
          xaxis: {
            ...baseChartOptions.xaxis,
            categories: data.categories,
          },
          tooltip: {
            ...baseChartOptions.tooltip,
            x: {
              format:
                rangeRef.current?.textContent === "perMonth"
                  ? "Week"
                  : undefined,
            },
          },
          // 5. UPDATE WARNA CHART DINAMIS
          colors: getChartColor(selectedStat),
          fill: {
            ...baseChartOptions.fill,
            gradient: {
              ...baseChartOptions.fill?.gradient,
              gradientToColors: getChartGradient(selectedStat),
            },
          },
        });
      } catch (err: any) {
        setError(err.message);
        setChartSeries([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedRange, selectedStat]);

  const baseChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#350e8f"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.1,
        gradientToColors: ["#ffffff"],
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
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      x: {
        show: true,
      },
    },
    xaxis: {
      type: "category",
      categories: [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(0),
      },
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rangeRef.current &&
        !rangeRef.current.contains(event.target as Node)
      ) {
        setIsRangeOpen(false);
      }
      if (statRef.current && !statRef.current.contains(event.target as Node)) {
        setIsStatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
                  {statOptions.find((o) => o.key === selectedStat)?.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isStatOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 transition-all ${
                    isStatOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  {statOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSelectedStat(opt.key);
                        setIsStatOpen(false);
                      }}
                      className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                        selectedStat === opt.key
                          ? "text-bluelight font-semibold bg-blue-dashboard"
                          : "text-shortblack hover:bg-blues"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdown 2: Range Waktu */}
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setIsRangeOpen(!isRangeOpen)}
                  className="flex items-center gap-2 text-[1.4em] font-medium text-shortblack bg-blues px-[1.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300 "
                >
                  {timeRanges.find((o) => o.key === selectedRange)?.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isRangeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 transition-all ${
                    isRangeOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  {timeRanges.map((range) => (
                    <button
                      key={range.key}
                      onClick={() => {
                        setSelectedRange(range.key);
                        setIsRangeOpen(false);
                      }}
                      className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                        selectedRange === range.key
                          ? "text-bluelight font-semibold bg-blue-dashboard"
                          : "text-shortblack hover:bg-blues"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
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
            series={chartSeries}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
