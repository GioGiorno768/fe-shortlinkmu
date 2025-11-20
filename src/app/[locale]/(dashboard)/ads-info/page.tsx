// src/app/[locale]/(dashboard)/ads-info/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Check,
  X as XIcon,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Zap,
  Flame,
  Bomb,
  Info,
} from "lucide-react";
import { Link } from "@/i18n/routing"; // Pake Link dari i18n
import type { AdLevelConfig } from "@/types/type";
import clsx from "clsx";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini buat fetch ke Laravel
// Endpoint: GET /api/ads-levels
async function fetchAdLevels(): Promise<AdLevelConfig[]> {
  console.log("MANGGIL API: /api/ads-levels");

  // Simulasi loading
  await new Promise((resolve) => setTimeout(resolve, 800));

  // --- MOCK DATA ---
  // Data ini nanti bisa di-setting dari Admin Panel Laravel lu
  return [
    {
      id: "1",
      name: "Low",
      slug: "low",
      description: "User-friendly, minimal ads focused on retention.",
      cpmRate: "Variable",
      revenueShare: 30,
      demoUrl: "https://demo.shortlinkmu.com/low",
      colorTheme: "green",
      features: [
        { label: "Banner Ads", value: true, included: true },
        { label: "Interstitial", value: false, included: false },
        { label: "Popunder", value: "1 / 24h", included: true },
        { label: "Push Notif", value: false, included: false },
        { label: "Captcha", value: "Simple", included: true },
      ],
    },
    {
      id: "2",
      name: "Medium",
      slug: "medium",
      description: "Balanced experience between earnings and comfort.",
      cpmRate: "Variable",
      revenueShare: 50,
      isPopular: true, // Highlight card ini
      demoUrl: "https://demo.shortlinkmu.com/medium",
      colorTheme: "blue",
      features: [
        { label: "Banner Ads", value: true, included: true },
        { label: "Interstitial", value: "On Page Load", included: true },
        { label: "Popunder", value: "2 / 24h", included: true },
        { label: "Push Notif", value: false, included: false },
        { label: "Captcha", value: "Standard", included: true },
      ],
    },
    {
      id: "3",
      name: "High",
      slug: "high",
      description: "Maximized for earnings with more ad formats.",
      cpmRate: "Variable",
      revenueShare: 75,
      demoUrl: "https://demo.shortlinkmu.com/high",
      colorTheme: "orange",
      features: [
        { label: "Banner Ads", value: "Aggressive", included: true },
        { label: "Interstitial", value: "Every Page", included: true },
        { label: "Popunder", value: "3 / 24h", included: true },
        { label: "Push Notif", value: true, included: true },
        { label: "Captcha", value: "Double", included: true },
      ],
    },
    {
      id: "4",
      name: "Aggressive",
      slug: "aggressive",
      description: "Highest possible revenue. Not for sensitive traffic.",
      cpmRate: "Variable",
      revenueShare: 100,
      demoUrl: "https://demo.shortlinkmu.com/aggressive",
      colorTheme: "red",
      features: [
        { label: "Banner Ads", value: "Max", included: true },
        { label: "Interstitial", value: "Multipoint", included: true },
        { label: "Popunder", value: "Unlimited", included: true },
        { label: "Push Notif", value: "High Freq", included: true },
        { label: "Captcha", value: "Triple", included: true },
      ],
    },
  ];
  // --- AKHIR MOCK DATA ---
}

// Helper buat dapetin warna & icon berdasarkan theme
const getThemeStyles = (theme: string) => {
  switch (theme) {
    case "green":
      return {
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-800",
        button: "bg-green-600 hover:bg-green-700",
        icon: ShieldCheck,
      };
    case "orange":
      return {
        border: "border-orange-200",
        bg: "bg-orange-50",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-800",
        button: "bg-orange-600 hover:bg-orange-700",
        icon: Flame,
      };
    case "red":
      return {
        border: "border-red-200",
        bg: "bg-red-50",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800",
        button: "bg-red-600 hover:bg-red-700",
        icon: Bomb,
      };
    default: // Blue (Medium)
      return {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-800",
        button: "bg-blue-600 hover:bg-blue-700",
        icon: Zap,
      };
  }
};

export default function AdsInfoPage() {
  // const t = useTranslations("AdsInfo"); // Kalau mau pake i18n nanti
  const [levels, setLevels] = useState<AdLevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdLevels();
        setLevels(data);
      } catch (err) {
        setError("Gagal memuat data level iklan.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-redshortlink text-[1.6em]">
        {error}
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Header Page */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-[3em] font-bold text-shortblack">
          Konfigurasi Level Iklan
        </h1>
        <p className="text-[1.6em] text-grays max-w-2xl mx-auto">
          Pilih level iklan yang sesuai dengan strategi traffic Anda. Sesuaikan
          keseimbangan antara kenyamanan pengunjung dan pendapatan maksimal.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {levels.map((level, index) => {
          const theme = getThemeStyles(level.colorTheme);
          const LevelIcon = theme.icon;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={clsx(
                "relative bg-white rounded-3xl p-8 flex flex-col border-2 transition-all duration-300",
                level.isPopular
                  ? "border-bluelight shadow-xl shadow-blue-100 scale-105 z-10"
                  : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
              )}
            >
              {/* Badge Popular */}
              {level.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bluelight text-white px-4 py-1 rounded-full text-[1.2em] font-semibold shadow-md tracking-wide">
                  MOST POPULAR
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6 text-center">
                <div
                  className={clsx(
                    "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
                    theme.bg
                  )}
                >
                  <LevelIcon className={clsx("w-8 h-8", theme.text)} />
                </div>
                <h2 className="text-[2.4em] font-bold text-shortblack mb-2">
                  {level.name}
                </h2>
                <p className="text-[1.4em] text-grays leading-snug min-h-[3em]">
                  {level.description}
                </p>
              </div>

              {/* Revenue Info */}
              <div className="mb-8 p-4 bg-slate-50 rounded-xl text-center space-y-2">
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-[3em] font-bold text-shortblack">
                    {level.revenueShare}%
                  </span>
                  <span className="text-[1.4em] text-grays font-medium">
                    Revenue
                  </span>
                </div>
                <p className="text-[1.2em] text-bluelight font-medium">
                  CPM Rate: {level.cpmRate}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-1">
                {level.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[1.4em]">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XIcon className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col">
                      <span
                        className={
                          feature.included ? "text-shortblack" : "text-gray-400"
                        }
                      >
                        {feature.label}
                      </span>
                      {feature.value !== false && feature.value !== true && (
                        <span className="text-[0.85em] text-grays font-medium">
                          {feature.value}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Demo Button */}
              <a
                href={level.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "w-full py-4 rounded-xl font-semibold text-[1.6em] flex items-center justify-center gap-2 transition-all",
                  level.isPopular
                    ? "bg-bluelight text-white hover:bg-opacity-90 shadow-lg shadow-blue-200"
                    : "bg-white border-2 border-gray-200 text-shortblack hover:border-bluelight hover:text-bluelight"
                )}
              >
                <span>Lihat Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Info Section Bawah */}
      <div className="mt-16 bg-blue-dashboard p-8 rounded-2xl flex items-start gap-4 border border-bluelight/20">
        <Info className="w-8 h-8 text-bluelight flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-[1.6em] font-bold text-shortblack mb-2">
            Info Penting buat Admin
          </h3>
          <p className="text-[1.4em] text-grays">
            Fitur dan persentase revenue di atas diambil dari API. Nanti di
            halaman admin, lu bisa atur:
          </p>
          <ul className="list-disc list-inside mt-2 text-[1.4em] text-grays ml-2 space-y-1">
            <li>Persentase Revenue Share untuk tiap level.</li>
            <li>Jumlah popups per 24 jam.</li>
            <li>
              Mengaktifkan/menonaktifkan jenis iklan tertentu (Interstitial,
              Banner, dll).
            </li>
            <li>Link demo untuk masing-masing level.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
