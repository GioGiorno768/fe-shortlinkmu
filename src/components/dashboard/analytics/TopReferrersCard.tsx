// src/components/dashboard/analytics/TopReferrersCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { Loader2, Globe, Facebook, Twitter, User, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReferrerStat } from "@/types/type";

interface TopReferrersCardProps {
  data: ReferrerStat[] | null;
}

// Helper icon tetap di sini (UI logic)
const getReferrerIcon = (referrer: string) => {
  const lower = referrer.toLowerCase();
  if (lower.includes("google"))
    return { icon: <Globe className="w-5 h-5" />, color: "text-red-500" };
  if (lower.includes("facebook"))
    return { icon: <Facebook className="w-5 h-5" />, color: "text-blue-600" };
  if (lower.includes("twitter") || lower.includes("x.com"))
    return { icon: <Twitter className="w-5 h-5" />, color: "text-black" };
  if (lower.includes("direct"))
    return { icon: <User className="w-5 h-5" />, color: "text-grays" };
  return { icon: <Link2 className="w-5 h-5" />, color: "text-shortblack" };
};

export default function TopReferrersCard({ data }: TopReferrersCardProps) {
  const t = useTranslations("Dashboard");

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
          {t("topReferrers")}
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
            {data.map((referrer) => {
              const { icon, color } = getReferrerIcon(referrer.name);
              const displayName =
                referrer.name.toLowerCase() === "direct"
                  ? t("direct")
                  : referrer.name;

              return (
                <div key={referrer.name} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full bg-blues flex items-center justify-center ${color}`}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[1.5em] font-medium text-shortblack truncate">
                        {displayName}
                      </span>
                      <span className="text-[1.4em] font-semibold text-bluelight">
                        {formatViews(referrer.views)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-blues rounded-full">
                      <motion.div
                        className="h-1.5 bg-bluelight rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${referrer.percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
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
