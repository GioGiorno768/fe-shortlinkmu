// src/components/dashboard/TopTrafficCard.tsx
"use client";

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
  type LucideIcon,
} from "lucide-react";
import type { TopTrafficStats, UserLevel } from "@/types/type";

// Terima data lewat props
interface TopTrafficCardProps {
  data: TopTrafficStats | null;
}

// Helper UI (Tetap di sini karena ini bagian dari Tampilan)
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
  master: { labelKey: "levelMaster", icon: Rocket, iconColor: "text-red-500" },
  mythic: { labelKey: "levelMythic", icon: Crown, iconColor: "text-bluelight" },
};

export default function TopTrafficCard({ data }: TopTrafficCardProps) {
  const t = useTranslations("Dashboard");

  // Loading State
  if (!data) {
    return (
      <div className="p-4 bg-white rounded-3xl shadow-sm shadow-slate-500/50 flex items-center justify-center min-h-[220px]">
        <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
      </div>
    );
  }

  const currentLevel = levelConfig[data.topLevel.level];
  const LevelIcon = currentLevel.icon;

  return (
    <div className="p-4 bg-white rounded-3xl flex justify-stretch items-stretch flex-col shadow-sm shadow-slate-500/50 h-full">
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
            {t("topTraffic")}
          </h3>
          <Link
            href="/analytics#monthly-performance"
            className="flex items-center gap-1 text-[1.4em] font-medium text-bluelight hover:underline mr-4 group"
          >
            <span>{t("detail")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Konten (3 Card) */}
        <div className="rounded-xl">
          <div className="flex justify-between items-center gap-[2em] flex-wrap">
            {/* Card 1: Top Month */}
            <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
              <p className="text-[1.4em] font-medium text-grays">
                Month
              </p>
              <div>
                <p className="text-[2.8em] font-semibold text-bluelight my-1">
                  {data.topMonth.month}
                </p>
                <p className="text-[1.6em] font-medium text-grays">
                  All Time
                </p>
              </div>                                                              
            </div>

            {/* Card 2: Top Year */}
            <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
              <p className="text-[1.4em] font-medium text-grays">
                Year
              </p>
              <div>
                <div>
                  <p className="text-[2.8em] font-semibold text-bluelight my-1">
                    {data.topYear.year}
                  </p>
                  <p className="text-[1.6em] font-medium text-grays">
                    All Time
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Top Level */}
            <div className="flex-1 min-w-[17em] bg-white rounded-2xl p-6 shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-300 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-[1.4em] font-medium text-grays">
                  Level
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
                  +{data.topLevel.cpmBonusPercent}% CPM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
