// src/components/dashboard/AdsLevelCompare.tsx
"use client";

import { useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

// Helper component biar rapi
const FeatureCheck = () => (
  <Check className="w-5 h-5 text-greenlight mx-auto" />
);
const FeatureDash = () => <Minus className="w-5 h-5 text-grays/70 mx-auto" />;

const FeatureDemo = () => (
  <Link
    href="/demo"
    className="px-6 py-2 rounded-md bg-blue-dashboard text-bluelight hover:bg-bluelight hover:text-white transition-colors duration-200 text-[14px]"
  >
    Demo
  </Link>
);

export default function AdsLevelCompare() {
  const t = useTranslations("Dashboard");

  // Data buat tabel perbandingan
  const featureData = [
    {
      name: t("cpmRate"),
      values: [
        <span className="font-semibold">{t("upto10")}</span>,
        <span className="font-semibold">{t("fixed15")}</span>,
        <span className="font-semibold text-bluelight">{t("fixed20")}</span>,
        <span className="font-semibold text-bluelight">Fixed $30</span>,
      ],
    },
    {
      name: t("numberOfPages"),
      values: ["2", "3", "3", "3"],
    },
    {
      name: t("banners"),
      values: [
        <FeatureCheck />,
        <FeatureCheck />,
        <FeatureCheck />,
        <FeatureCheck />,
      ],
    },
    {
      name: t("popUps"),
      values: [<FeatureDash />, "Low", "Low", "High"],
    },
    {
      name: t("viewsPerIP"),
      values: [t("oneView"), t("twoViews"), t("threeViews"), t("threeViews")],
    },
    {
      name: t("inPageNotifications"),
      values: [
        <FeatureDash />,
        <FeatureDash />,
        <FeatureCheck />,
        <FeatureCheck />,
      ],
    },
    {
      name: "Invisible Ads",
      values: [<FeatureDash />, <FeatureDash />, "Low", "High"],
    },
    {
      name: "",
      values: [
        <FeatureDemo />,
        <FeatureDemo />,
        <FeatureDemo />,
        <FeatureDemo />,
      ],
    },
  ];

  const levels = [
    { name: t("adsLevel1") },
    { name: t("adsLevel2"), recommended: true },
    { name: t("adsLevel3") },
    { name: t("adsLevel4") },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50">
      <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight mb-6">
        {t("compareAdsLevels")}
      </h3>

      {/* Grid Perbandingan (Tabel) */}
      <div className="overflow-x-auto custom-scrollbar-minimal">
        <div className="min-w-[650px]">
          {/* Header Grid */}
          <div className="grid grid-cols-5 gap-4 px-4 pb-4 border-b border-gray-200">
            <div className="text-[1.4em] font-semibold text-grays uppercase tracking-wider">
              {t("feature")}
            </div>
            {levels.map((level, index) => (
              <div
                key={index}
                className="text-[1.4em] font-semibold text-shortblack text-center"
              >
                {level.name}
                {level.recommended && (
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

          {/* Body Grid (Fitur) */}
          <div className="divide-y divide-gray-100">
            {featureData.map((feature, fIndex) => (
              <motion.div
                key={feature.name}
                className="grid grid-cols-5 gap-4 items-center px-4 py-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: fIndex * 0.05 }}
              >
                {/* Nama Fitur */}
                <div className="flex items-center gap-2">
                  <span className="text-[1.5em] font-medium text-shortblack">
                    {feature.name}
                  </span>
                </div>
                {/* Nilai Level */}
                {feature.values.map((value, lIndex) => (
                  <div
                    key={lIndex}
                    className="text-[1.5em] font-medium text-grays text-center"
                  >
                    {value}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
