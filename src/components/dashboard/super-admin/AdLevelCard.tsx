"use client";

import { motion } from "motion/react";
import { Edit2, Trash2, Crown, ExternalLink, Check, Globe } from "lucide-react";
import clsx from "clsx";
import type { AdLevelConfig, GlobalFeature } from "@/services/adLevelService";
import { calculateCPM, formatCPM } from "@/services/adLevelService";

interface AdLevelCardProps {
  level: AdLevelConfig;
  onEdit: (level: AdLevelConfig) => void;
  onDelete: (level: AdLevelConfig) => void;
  onSetDefault?: (level: AdLevelConfig) => void;
  isDefault?: boolean;
  onSetPopular?: (level: AdLevelConfig) => void;
  isPopular?: boolean;
  index: number;
  globalFeatures: GlobalFeature[]; // Pass global features to display enabled ones
}

const getThemeStyles = (theme: string) => {
  switch (theme) {
    case "green":
      return {
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-800",
      };
    case "orange":
      return {
        border: "border-orange-200",
        bg: "bg-orange-50",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-800",
      };
    case "red":
      return {
        border: "border-red-200",
        bg: "bg-red-50",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800",
      };
    default: // blue
      return {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-800",
      };
  }
};

export default function AdLevelCard({
  level,
  onEdit,
  onDelete,
  onSetDefault,
  isDefault = false,
  onSetPopular,
  isPopular = false,
  index,
  globalFeatures,
}: AdLevelCardProps) {
  const theme = getThemeStyles(level.colorTheme);
  const cpm = formatCPM(level.cpcRate);

  // Check if a feature is enabled
  const isFeatureEnabled = (featureId: string) => {
    return level.enabledFeatures?.includes(featureId) || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={clsx(
        "relative bg-white rounded-3xl p-6 flex flex-col border-2 transition-all duration-300",
        isPopular
          ? "border-bluelight shadow-xl shadow-blue-100 scale-105 z-10"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bluelight text-white px-4 py-1 rounded-full text-[1.1em] font-semibold shadow-md flex items-center gap-1">
          <Crown className="w-3.5 h-3.5" />
          <span>POPULAR</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div
          className={clsx(
            "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3",
            theme.bg
          )}
        >
          <span className={clsx("text-[2em] font-bold", theme.text)}>
            {level.levelNumber}
          </span>
        </div>
        <h3 className="text-[2em] font-bold text-shortblack mb-1">
          {level.name}
        </h3>
        <p className="text-[1.2em] text-grays leading-snug min-h-[2.5em]">
          {level.description}
        </p>
      </div>

      {/* Revenue & CPC Info */}
      <div className="mb-4 p-4 bg-slate-50 rounded-xl text-center space-y-2">
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-[2.5em] font-bold text-shortblack">
            {level.revenueShare}%
          </span>
          <span className="text-[1.2em] text-grays font-medium">Revenue</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[1.1em] text-bluelight font-medium">CPM: {cpm}</p>
          <p className="text-[1em] text-grays">
            CPC: ${level.cpcRate.toFixed(4)}
          </p>
          {/* Country Rates Badge */}
          {level.countryRates && level.countryRates.length > 0 && (
            <p className="text-[1em] text-purple-600 font-medium flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" />
              {level.countryRates.length}{" "}
              {level.countryRates.length === 1 ? "country" : "countries"}
            </p>
          )}
        </div>
      </div>

      {/* Features Preview */}
      <div className="mb-4 flex-1">
        <p className="text-[1.1em] font-semibold text-shortblack mb-2">
          Features ({level.enabledFeatures?.length || 0})
        </p>
        <div className="space-y-1">
          {globalFeatures.length > 0 ? (
            globalFeatures.map((feature) => {
              const enabled = isFeatureEnabled(feature.id);
              return (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 text-[1.1em]"
                >
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      enabled ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                  <span
                    className={enabled ? "text-shortblack" : "text-gray-400"}
                  >
                    {feature.name}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-[1.1em] text-gray-400 italic">
              No features available
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(level)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-bluelight text-white font-semibold text-[1.2em] hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(level)}
          className="py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-semibold text-[1.2em] hover:bg-red-100 transition-all border border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Demo Link */}
      {level.demoUrl && (
        <a
          href={level.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-center text-[1.1em] text-bluelight hover:underline flex items-center justify-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Demo
        </a>
      )}

      {/* Set as Default Button */}
      <button
        onClick={() => onSetDefault?.(level)}
        disabled={isDefault}
        className={clsx(
          "mt-2 w-full py-2 rounded-xl font-semibold text-[1.2em] transition-all border flex items-center justify-center gap-2",
          isDefault
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border-green-200"
        )}
      >
        <Check className="w-4 h-4" />
        {isDefault ? "Current Default" : "Set as Default"}
      </button>

      {/* Set as Popular Button */}
      <button
        onClick={() => onSetPopular?.(level)}
        disabled={isPopular}
        className={clsx(
          "mt-2 w-full py-2 rounded-xl font-semibold text-[1.2em] transition-all border flex items-center justify-center gap-2",
          isPopular
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border-purple-200"
        )}
      >
        <Crown className="w-4 h-4" />
        {isPopular ? "Current Popular" : "Set as Popular"}
      </button>
    </motion.div>
  );
}
