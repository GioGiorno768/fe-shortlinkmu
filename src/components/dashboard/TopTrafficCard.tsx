// src/components/dashboard/TopTrafficCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Crown,
  Gem,
  Loader2,
  Rocket,
  Shield,
  Star,
  Trophy,
} from "lucide-react";
import type { TopTrafficStats, UserLevel } from "@/types/type";
import type { LucideIcon } from "lucide-react";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini pake API call beneran
async function fetchTopTrafficStats(): Promise<TopTrafficStats> {
  console.log("MANGGIL API: /api/stats/top-traffic");
  /* // --- CONTOH API CALL BENERAN ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/stats/top-traffic`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error("Gagal memuat data traffic");
  // }
  // const data: TopTrafficStats = await response.json();
  // return data;
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi loading
  return {
    topMonth: {
      month: "February",
      views: 405123,
    },
    topYear: {
      year: "2025",
      views: 805678,
    },
    topLevel: {
      level: "mythic",
      cpmBonusPercent: 20,
    },
  };
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

// Helper buat mapping level ke ikon dan label
type LevelConfig = {
  [key in UserLevel]: {
    labelKey: string;
    icon: LucideIcon;
    iconColor: string;
  };
};

const levelConfig: LevelConfig = {
  beginner: {
    labelKey: "levelBeginner",
    icon: Shield,
    iconColor: "text-grays",
  },
  rookie: { labelKey: "levelRookie", icon: Star, iconColor: "text-yellow-500" },
  elite: { labelKey: "levelElite", icon: Trophy, iconColor: "text-blue-500" },
  pro: { labelKey: "levelPro", icon: Gem, iconColor: "text-purple-500" },
  master: {
    labelKey: "levelMaster",
    icon: Rocket,
    iconColor: "text-red-500",
  },
  mythic: {
    labelKey: "levelMythic",
    icon: Crown,
    iconColor: "text-bluelight", // Pake warna bluelight (ungu)
  },
};

// Helper buat format angka (405123 -> "405K")
function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${Math.floor(views / 1000)}K`;
  }
  return views.toString();
}

export default function TopTrafficCard() {
  const t = useTranslations("Dashboard");

  const [stats, setStats] = useState<TopTrafficStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTopTrafficStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-[150px] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
        </div>
      );
    }

    if (error || !stats) {
      return (
        <div className="flex h-[150px] items-center justify-center text-redshortlink">
          {error || "Data tidak ditemukan"}
        </div>
      );
    }

    const currentLevel = levelConfig[stats.topLevel.level];
    const LevelIcon = currentLevel.icon;

    return (
      <div className="flex justify-between items-center gap-[2em] flex-wrap">
        {/* Card 1: Top Month */}
        <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
          <p className="text-[1.4em] font-medium text-grays">{t("topMonth")}</p>
          <div>
            <p className="text-[2.8em] font-semibold text-bluelight my-1">
              {stats.topMonth.month}
            </p>
            <p className="text-[1.6em] font-medium text-grays">
              {formatViews(stats.topMonth.views)} Views
            </p>
          </div>
        </div>

        {/* Card 2: Top Year */}
        <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
          <p className="text-[1.4em] font-medium text-grays">{t("topYear")}</p>
          <div>
            <div>
              <p className="text-[2.8em] font-semibold text-bluelight my-1">
                {stats.topYear.year}
              </p>
              <p className="text-[1.6em] font-medium text-grays">
                {formatViews(stats.topYear.views)} Views
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Top Level */}
        <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[1.4em] font-medium text-grays">
              {t("topLevel")}
            </p>
            <LevelIcon
              className={`w-5 h-5 ${currentLevel.iconColor}`}
              strokeWidth={2.5}
            />
          </div>
          <div>
            <p className="text-[2.8em] font-semibold text-bluelight my-1">
              {t(currentLevel.labelKey)}
            </p>
            <p className="text-[1.6em] font-medium text-grays">
              +{stats.topLevel.cpmBonusPercent}% CPM
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    // Card Wrapper
    <div className=" p-4 rounded-xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("topTraffic")}
        </h3>
        <Link
          href="/analytics/traffic-source" // Ganti ke rute detail traffic lu
          className="flex items-center gap-1 text-[1.4em] font-medium text-bluelight hover:underline"
        >
          <span>{t("detail")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Konten (3 Card) */}
      <div className="rounded-xl ">{renderContent()}</div>
    </div>
  );
}
