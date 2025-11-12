// src/components/dashboard/AchievementCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// WAJIB: ApexCharts crash di sisi server, jadi kita import dinamis
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  // Tampilkan loader sederhana pas chart-nya lagi di-load
  loading: () => (
    <div className="h-[160px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
    </div>
  ),
});

// Tipe untuk stat yang dipilih di dropdown
type StatType = "overall" | "totalEarnings" | "totalClicks" | "validClicks";

// Tipe data yang kita harapin dari API
interface AchievementData {
  currentValue: number;
  targetValue: number;
  levelName: string;
  percentage: number;
}

// --- INI FUNGSI API SETUP (MOCK/DUMMY) ---
// Ganti ini pake API backend lu
async function fetchAchievementStats(
  statType: StatType
): Promise<AchievementData> {
  console.log(`MANGGIL API: /api/achievements?type=${statType}`);
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulasi loading

  //   // Ganti URL ini pake API URL lu. (Bisa pake .env)
  //   const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/achievements?type=${statType}`;

  //   // Ambil token (kalo lu pake, misal dari localStorage)
  //   // const token = localStorage.getItem("authToken");

  //   try {
  //     const response = await fetch(API_URL, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // 'Authorization': `Bearer ${token}` // <-- Aktifin kalo API lu butuh auth
  //       },
  //     });

  //     if (!response.ok) {
  //       // Kalo server error (404, 500, dll)
  //       throw new Error(`Gagal memuat data: ${response.statusText}`);
  //     }

  //     const data: AchievementData = await response.json();

  //     // Pastikan backend ngirim format yang bener
  //     if (typeof data.percentage === "undefined") {
  //       throw new Error("Format data dari API salah.");
  //     }

  //     return data;

  //   } catch (err: any) {
  //     // Kalo jaringan error, API mati, dll.
  //     console.error("Error di fetchAchievementStats:", err);
  //     throw new Error(err.message || "Gagal terhubung ke server.");
  //   }
  // LOGIKA LEVEL ADA DI SINI (DISIMULASIKAN)
  // Harusnya backend lu yang ngitung ini
  let response: AchievementData = {
    currentValue: 0,
    targetValue: 0,
    levelName: "Newbie",
    percentage: 0,
  };

  if (statType === "totalEarnings") {
    response = {
      currentValue: 80,
      targetValue: 100,
      levelName: "Silver Earner",
      percentage: 80,
    };
  } else if (statType === "totalClicks") {
    // Ini buat contoh yang 90%
    response = {
      currentValue: 4500,
      targetValue: 5000,
      levelName: "Click Beginner",
      percentage: 90,
    };
  } else if (statType === "validClicks") {
    response = {
      currentValue: 1800,
      targetValue: 2000,
      levelName: "Valid Master",
      percentage: 90,
    };
  } else {
    // overall
    response = {
      currentValue: 85,
      targetValue: 100,
      levelName: "All-Star",
      percentage: 85,
    };
  }

  return response;
}
// ---------------------------------------------

export default function AchievementCard() {
  const t = useTranslations("Dashboard");

  const [isLoading, setIsLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState<StatType>("totalClicks"); // Default ke 90%

  // State buat data yang tampil
  const [displayData, setDisplayData] = useState({
    percentage: 0,
    subtitle: "Target...",
  });

  // State buat dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Opsi dropdown
  const statOptions: { key: StatType; label: string }[] = [
    { key: "overall", label: "Overall" }, // Bisa ganti pake t() kalo ada
    { key: "totalEarnings", label: t("totalEarnings") },
    { key: "totalClicks", label: t("totalClicks") },
    { key: "validClicks", label: t("validClicks") },
  ];

  // Efek buat fetch data pas `selectedStat` berubah
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchAchievementStats(selectedStat);

      // Set data buat chart dan subtitle
      setDisplayData({
        percentage: data.percentage,
        subtitle: `${data.levelName} (${data.currentValue}/${data.targetValue})`,
      });
      setIsLoading(false);
    }
    loadData();
  }, [selectedStat]);

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

  // --- Konfigurasi Chart Radial ---
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "60%", // Ukuran lubang tengah
        },
        track: {
          background: "#E7EAFF", // Warna --color-blue-dashboard
          strokeWidth: "98%",
        },
        dataLabels: {
          name: {
            show: false, // Sembunyiin label "Series 1"
          },
          value: {
            offsetY: 8, // Penyesuaian posisi persen
            fontSize: "2em", // Ukuran font persen
            color: "#350e8f", // Warna --color-bluelight
            fontWeight: 700,
            fontFamily: "var(--font-manrope)",
            formatter: (val) => `${val}%`, // Format jadi "90%"
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#9E30D5"], // Warna --color-darkpurple-dashboard
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [""], // Kosongin label
    colors: ["#350e8f"], // Warna --color-bluelight
  };

  const chartSeries = [displayData.percentage];
  // ---------------------------------

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full">
      {/* Header (Title + Dropdown) */}
      <div className="flex items-center justify-end ">
        {/* Tombol dropdown */}
        <div className="relative  z-20" ref={dropdownRef}>
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
            {statOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setSelectedStat(opt.key);
                  setIsDropdownOpen(false);
                }}
                className={`text-[1.4em] px-[1.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300 text-start ${
                  selectedStat === opt.key
                    ? "text-bluelight font-semibold bg-blue-dashboard"
                    : "text-shortblack"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body (Chart & Subtitle) */}
      <div className="flex flex-col items-center justify-center -mt-[4.5em]">
        {isLoading ? (
          <Loader2 className="w-10 h-10 text-bluelight animate-spin mt-[6em]" />
        ) : (
          <div className="translate-y-[.5em] flex flex-col items-center justify-between">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="radialBar"
              height={180} // Sesuaikan tinggi chart
              width="42%"
            />
            {/* Subtitle dinamis dari API */}
            <p className="text-[1.4em] text-grays text-center">
              {displayData.subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
