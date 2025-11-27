// src/components/dashboard/TopReferrersCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Globe, Facebook, Twitter, User, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReferrerStat } from "@/types/type";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini pake API call beneran
async function fetchTopReferrers(): Promise<ReferrerStat[]> {
  console.log("MANGGIL API: /api/analytics/top-referrers");
  /* // --- CONTOH API CALL BENERAN ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/top-referrers`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error("Gagal memuat data referrer");
  // }
  // const data: ReferrerStat[] = await response.json();
  // return data; // Asumsi API ngembaliin array [{ name: "Google", views: 5000, percentage: 45.5 }]
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi loading
  return [
    { name: "Google", views: 35000, percentage: 40.2 },
    { name: "Direct", views: 22000, percentage: 25.3 },
    { name: "Facebook", views: 15000, percentage: 17.2 },
    { name: "Twitter / X.com", views: 8000, percentage: 9.2 },
    { name: "detik.com", views: 4000, percentage: 4.6 },
    { name: "github.com", views: 3000, percentage: 3.5 },
  ];
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

// Helper buat milih ikon berdasarkan nama referrer
const getReferrerIcon = (
  referrer: string,
  t: (key: string) => string
): { icon: React.ReactNode; color: string } => {
  const lower = referrer.toLowerCase();

  if (lower.includes("google")) {
    // Kita pake icon Google custom dari CSS kalo ada, kalo gak, pake Globe
    // Berhubung di globals.css lu gak ada, kita pake Globe
    return {
      icon: <Globe className="w-5 h-5" />,
      color: "text-red-500",
    };
  }
  if (lower.includes("facebook")) {
    return {
      icon: <Facebook className="w-5 h-5" />,
      color: "text-blue-600",
    };
  }
  if (lower.includes("twitter") || lower.includes("x.com")) {
    return {
      icon: <Twitter className="w-5 h-5" />,
      color: "text-black",
    };
  }
  if (lower.includes("direct")) {
    return { icon: <User className="w-5 h-5" />, color: "text-grays" };
  }

  // Default buat website lain
  return { icon: <Link2 className="w-5 h-5" />, color: "text-shortblack" };
};

export default function TopReferrersCard() {
  const t = useTranslations("Dashboard");

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ReferrerStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTopReferrers();
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
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("topReferrers")}
        </h3>
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
            onWheel={(e) => e.stopPropagation()} // Stop scroll bocor
          >
            {data.map((referrer) => {
              const { icon, color } = getReferrerIcon(referrer.name, t);
              // Ganti nama 'Direct' pake terjemahan
              const displayName =
                referrer.name.toLowerCase() === "direct"
                  ? t("direct")
                  : referrer.name;

              return (
                <div key={referrer.name} className="flex items-center gap-4">
                  {/* Ikon */}
                  <div
                    className={`w-8 h-8 rounded-full bg-blues flex items-center justify-center ${color}`}
                  >
                    {icon}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[1.5em] font-medium text-shortblack truncate">
                        {displayName}
                      </span>
                      <span className="text-[1.4em] font-semibold text-bluelight">
                        {formatViews(referrer.views)}
                      </span>
                    </div>
                    {/* Progress Bar Interaktif */}
                    <div className="h-1.5 w-full bg-blues rounded-full">
                      <motion.div
                        className="h-1.5 bg-bluelight rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${referrer.percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  {/* Persentase */}
                  <span className="text-[1.4em] font-medium text-grays w-10 text-right mr-5">
                    {referrer.percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
