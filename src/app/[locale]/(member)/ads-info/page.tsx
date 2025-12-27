// src/app/[locale]/(member)/ads-info/page.tsx
"use client";

import { motion } from "motion/react";
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
import clsx from "clsx";
import { useAdsInfo } from "@/hooks/useAdsInfo";

// Helper Styles (UI Logic)
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
  // Panggil Logic dari Hook
  const { levels, isLoading, error } = useAdsInfo();

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
              <div className="mb-8 p-4 bg-slate-50 rounded-xl text-center">
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-[3em] font-bold text-shortblack">
                    {level.revenueShare}%
                  </span>
                  <span className="text-[1.4em] text-grays font-medium">
                    Revenue
                  </span>
                </div>
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
