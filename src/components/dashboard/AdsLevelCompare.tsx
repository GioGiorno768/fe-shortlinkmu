// src/components/dashboard/AdsLevelCompare.tsx
"use client";

import { useTranslations } from "next-intl";
import { Check, Minus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  AdLevel,
  AdsComparisonData,
  ApiAdFeature,
  ApiAdLevel,
  PrefixedStringValue,
} from "@/types/type"; // Impor tipe baru
import { useEffect, useState } from "react";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================

// API 1: (Tetap ada) Buat ngambil setelan default user
async function fetchUserDefaultAdLevel(): Promise<AdLevel> {
  console.log("MANGGIL API: /api/user/settings/default-ad-level (GET)");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return "level2"; // Mock: Default awal user adalah level2
}

// API 2: (Tetap ada) Buat nyimpen setelan default baru
async function saveDefaultAdLevel(level: AdLevel): Promise<boolean> {
  console.log(`MANGGIL API: /api/user/settings/default-ad-level (PUT)`, {
    defaultLevel: level,
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
  return true; // Mock: Anggap aja sukses
}

// API 3: (BARU) Buat ngambil data tabel perbandingan
async function fetchAdsComparisonData(): Promise<AdsComparisonData> {
  console.log("MANGGIL API: /api/ads/comparison (GET)");
  /* // --- CONTOH API CALL BENERAN ---
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/ads/comparison`
  // );
  // if (!response.ok) throw new Error("Gagal memuat data perbandingan");
  // const data: AdsComparisonData = await response.json();
  // return data;
  */

  // --- DATA DUMMY (SESUAI DESAIN API BARU) ---
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    levels: [
      { key: "level1", nameKey: "adsLevel1", isRecommended: false },
      { key: "level2", nameKey: "adsLevel2", isRecommended: true },
      { key: "level3", nameKey: "adsLevel3", isRecommended: false },
      { key: "level4", nameKey: "adsLevel4", isRecommended: false },
    ],
    features: [
      {
        nameKey: "cpmRate",
        displayType: "prefixed_string",
        values: {
          level1: { prefixKey: "upto", value: "$10" },
          level2: { prefixKey: "fixed", value: "$15" },
          level3: { prefixKey: "fixed", value: "$20" },
          level4: { prefixKey: "fixed", value: "$30" },
        },
      },
      {
        nameKey: "numberOfPages",
        displayType: "string",
        values: {
          level1: "2",
          level2: "3",
          level3: "3",
          level4: "3",
        },
      },
      {
        nameKey: "banners",
        displayType: "boolean",
        values: {
          level1: true,
          level2: true,
          level3: true,
          level4: true,
        },
      },
      {
        nameKey: "popUps",
        displayType: "string",
        values: {
          level1: "dash",
          level2: "intensityLow",
          level3: "intensityMedium",
          level4: "intensityHigh",
        },
      },
      {
        nameKey: "viewsPerIP",
        displayType: "string",
        values: {
          level1: "oneView",
          level2: "twoViews",
          level3: "threeViews",
          level4: "threeViews",
        },
      },
      {
        nameKey: "inPageNotifications",
        displayType: "boolean",
        values: {
          level1: false,
          level2: false,
          level3: true,
          level4: true,
        },
      },
      {
        nameKey: "invisibleAds",
        displayType: "string",
        values: {
          level1: "dash",
          level2: "dash",
          level3: "intensityLow",
          level4: "intensityHigh",
        },
      },
    ],
  };
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

// Helper component biar rapi
const FeatureCheck = () => (
  <Check className="w-5 h-5 text-greenlight mx-auto" />
);
const FeatureDash = () => <Minus className="w-5 h-5 text-grays/70 mx-auto" />;

const FeatureDemo = () => (
  <Link
    href="/demo"
    className="px-6 py-2 rounded-md bg-blue-dashboard text-bluelight 
               hover:bg-bluelight hover:text-white transition-colors 
               duration-200 text-[14px] font-medium"
  >
    Demo
  </Link>
);

export default function AdsLevelCompare() {
  const t = useTranslations("Dashboard");

  // State buat nampung default level
  const [currentDefault, setCurrentDefault] = useState<AdLevel | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State baru buat nampung data dinamis
  const [comparisonData, setComparisonData] =
    useState<AdsComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load semua data pas komponen mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        // Panggil 2 API sekaligus
        const [defaultLevel, comparison] = await Promise.all([
          fetchUserDefaultAdLevel(),
          fetchAdsComparisonData(),
        ]);
        setCurrentDefault(defaultLevel);
        setComparisonData(comparison);
      } catch (err) {
        setError("Gagal memuat data perbandingan iklan");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handler buat ganti default
  const handleSetDefault = async (level: AdLevel) => {
    setIsSaving(true);
    const success = await saveDefaultAdLevel(level);
    if (success) {
      setCurrentDefault(level);
    } else {
      alert("Failed to save setting");
    }
    setIsSaving(false);
  };

  // ==================================================
  // === HELPER RENDER DINAMIS (INTI LOGIKA BARU) ===
  // ==================================================
  const renderFeatureValue = (feature: ApiAdFeature, levelKey: AdLevel) => {
    const value = feature.values[levelKey];

    switch (feature.displayType) {
      case "boolean":
        return value ? <FeatureCheck /> : <FeatureDash />;

      case "prefixed_string":
        const { prefixKey, value: val } = value as PrefixedStringValue;
        // Kalo ada prefixKey, pake terjemahan. Kalo gak, pake val aja.
        return (
          <span className="font-semibold">
            {prefixKey ? t.rich(prefixKey) : ""}
            {prefixKey ? " " : ""}
            {val}
          </span>
        );

      case "string":
      default:
        const strValue = value as string;
        // --- INI PERBAIKANNYA ---
        // 1. Cek kalo stringnya itu "dash"
        if (strValue === "dash") {
          return <FeatureDash />;
        }

        // 2. Cek kalo stringnya ITU BUKAN ANGKA, baru kita terjemahin
        if (isNaN(Number(strValue))) {
          // Ini bakal nerjemahin "intensityLow", "oneView", dll.
          return t(strValue);
        }

        // 3. Kalo itu angka (kayak "2", "3"), balikin apa adanya
        return strValue;
      // --- AKHIR PERBAIKAN ---
    }
  };

  // Render Loading
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  // Render Error
  if (error || !comparisonData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 h-[400px] flex items-center justify-center text-redshortlink">
        {error || "Data tidak ditemukan"}
      </div>
    );
  }

  // Render Tabel Dinamis
  const { levels, features } = comparisonData;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50">
      <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight mb-6">
        {t("compareAdsLevels")}
      </h3>

      <div className="overflow-x-auto custom-scrollbar-minimal">
        <div className="min-w-[700px]">
          {/* Header Grid (Dinamis) */}
          <div
            className="grid gap-4 px-4 pb-4 border-b border-gray-200"
            style={{
              gridTemplateColumns: `1.5fr repeat(${levels.length}, 1fr)`,
            }}
          >
            <div className="text-[1.4em] font-semibold text-grays uppercase tracking-wider">
              {t("feature")}
            </div>
            {levels.map((level) => (
              <div
                key={level.key}
                className="text-[1.4em] font-semibold text-shortblack text-center"
              >
                {t(level.nameKey)}
                {level.isRecommended && (
                  <span
                    className="ml-2 text-[1em] font-medium bg-blue-dashboard text-bluelight
                                 px-2 py-0.5 rounded-full"
                  >
                    {t("recommended")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Body Grid (Dinamis) */}
          <div className="divide-y divide-gray-100">
            {features.map((feature, fIndex) => (
              <motion.div
                key={feature.nameKey}
                className="grid gap-4 items-center px-4 py-4"
                style={{
                  gridTemplateColumns: `1.5fr repeat(${levels.length}, 1fr)`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: fIndex * 0.05 }}
              >
                {/* Nama Fitur */}
                <div className="flex items-center gap-2">
                  <span className="text-[1.5em] font-medium text-shortblack">
                    {t(feature.nameKey)}
                  </span>
                </div>
                {/* Nilai Level (Dinamis) */}
                {levels.map((level) => (
                  <div
                    key={level.key}
                    className="text-[1.5em] font-medium text-grays text-center"
                  >
                    {renderFeatureValue(feature, level.key)}
                  </div>
                ))}
              </motion.div>
            ))}

            {/* Baris Tombol Demo (Dinamis) */}
            <motion.div
              className="grid gap-4 items-center px-4 py-4"
              style={{
                gridTemplateColumns: `1.5fr repeat(${levels.length}, 1fr)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: features.length * 0.05 }}
            >
              <div /> {/* Kolom fitur kosong */}
              {levels.map((level) => (
                <div key={level.key} className="text-center">
                  <FeatureDemo />
                </div>
              ))}
            </motion.div>

            {/* Baris Tombol Set Default (Dinamis) */}
            <motion.div
              className="grid gap-4 items-center px-4 pt-5"
              style={{
                gridTemplateColumns: `1.5fr repeat(${levels.length}, 1fr)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: (features.length + 1) * 0.05,
              }}
            >
              <div /> {/* Kolom fitur kosong */}
              {levels.map((level) => (
                <div key={level.key} className="text-center">
                  <button
                    onClick={() => handleSetDefault(level.key)}
                    disabled={isSaving || currentDefault === level.key}
                    className=" text-[1.4em] font-semibold py-2 px-3 rounded-md transition-all duration-200
                               bg-blue-dashboard text-bluelight 
                               hover:bg-opacity-80
                               disabled:bg-bluelight disabled:text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                    ) : currentDefault === level.key ? (
                      t("default")
                    ) : (
                      t("setDefault")
                    )}
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
