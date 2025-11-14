// src/components/dashboard/TopCountriesCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image"; // Kita pake Next/Image
import { Loader2, Globe } from "lucide-react";
import type { CountryStat } from "@/types/type";
import { motion } from "framer-motion";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini pake API call beneran
async function fetchTopCountries(): Promise<CountryStat[]> {
  console.log("MANGGIL API: /api/analytics/top-countries");
  /* // --- CONTOH API CALL BENERAN ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/top-countries`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error("Gagal memuat data negara");
  // }
  // const data: CountryStat[] = await response.json();
  // return data; // Asumsi API ngembaliin array [{ isoCode: "id", name: "Indonesia", views: 5000, percentage: 45.5 }]
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulasi loading
  return [
    { isoCode: "id", name: "Indonesia", views: 40500, percentage: 45.5 },
    { isoCode: "us", name: "United States", views: 22000, percentage: 24.7 },
    { isoCode: "in", name: "India", views: 8000, percentage: 9.0 },
    { isoCode: "my", name: "Malaysia", views: 5500, percentage: 6.2 },
    { isoCode: "sg", name: "Singapore", views: 3000, percentage: 3.4 },
    { isoCode: "gb", name: "United Kingdom", views: 2000, percentage: 2.2 },
    { isoCode: "au", name: "Australia", views: 1500, percentage: 1.7 },
    { isoCode: "de", name: "Germany", views: 1000, percentage: 1.1 },
  ];

  // --- AKHIR DATA DUMMY ---
}
// ========================================================

export default function TopCountriesCard() {
  const t = useTranslations("Dashboard");

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CountryStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTopCountries();
        setData(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper buat format angka (40500 -> "40.5K")
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("topCountries")}
        </h3>
        {/* Bisa tambahin dropdown filter di sini nanti kalo mau */}
      </div>

      {/* Konten (List) */}
      <div className="flex-1 min-h-0 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-redshortlink">
            {error}
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto pr-2 space-y-4 custom-scrollbar-minimal"
            onWheel={(e) => e.stopPropagation()} 
          >
            {data.map((country) => (
              <div key={country.isoCode} className="flex items-center gap-4">
                {/* Bendera */}
                <Image
                  src={`https://flagcdn.com/${country.isoCode}.svg`}
                  alt={country.name}
                  width={32}
                  height={24}
                  className="rounded-md object-cover h-[24px]"
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[1.5em] font-medium text-shortblack truncate">
                      {country.name}
                    </span>
                    <span className="text-[1.4em] font-semibold text-bluelight">
                      {formatViews(country.views)}
                    </span>
                  </div>
                  {/* Progress Bar Interaktif */}
                  <div className="h-1.5 w-full bg-blues rounded-full">
                    <motion.div
                      className="h-1.5 bg-bluelight rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                {/* Persentase */}
                <span className="text-[1.4em] font-medium text-grays w-10 text-right">
                  {country.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
