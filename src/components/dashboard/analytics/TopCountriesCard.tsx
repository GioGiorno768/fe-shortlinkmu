// src/components/dashboard/analytics/TopCountriesCard.tsx
"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { CountryStat } from "@/types/type";
import { motion } from "motion/react";

interface TopCountriesCardProps {
  data: CountryStat[] | null;
}

export default function TopCountriesCard({ data }: TopCountriesCardProps) {
  const t = useTranslations("Dashboard");

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("topCountries")}
        </h3>
      </div>

      <div className="flex-1 min-h-0 relative">
        {!data ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto pr-2 space-y-4 custom-scrollbar-minimal"
            onWheel={(e) => e.stopPropagation()}
          >
            {data.map((country) => (
              <div key={country.isoCode} className="flex items-center gap-4">
                <Image
                  src={`https://flagcdn.com/${country.isoCode}.svg`}
                  alt={country.name}
                  width={32}
                  height={24}
                  className="rounded-md object-cover h-[24px]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[1.5em] font-medium text-shortblack truncate">
                      {country.name}
                    </span>
                    <span className="text-[1.4em] font-semibold text-bluelight">
                      {formatViews(country.views)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-blues rounded-full">
                    <motion.div
                      className="h-1.5 bg-bluelight rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <span className="text-[1.4em] font-medium text-grays w-10 text-right mr-5">
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
