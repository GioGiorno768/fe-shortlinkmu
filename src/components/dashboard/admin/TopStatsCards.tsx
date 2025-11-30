"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, // Financial (Paid)
  Link2, // Content
  Ban, // Security (Blocked)
  Users, // Growth (Users Paid)
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import type { AdminDashboardStats } from "@/types/type";

interface TopStatsCardsProps {
  data: AdminDashboardStats | null;
  isLoading: boolean;
}

export default function TopStatsCards({ data, isLoading }: TopStatsCardsProps) {
  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formatNumber = (val: number) => val.toLocaleString("en-US");

  // Config Cards (4 ITEMS)
  const cards = [
    {
      id: "paid",
      title: "Paid Today",
      value: data ? formatCurrency(data.financial.paidToday) : "...",
      subLabel: "Total Payouts",
      trend: data?.financial.trend,
      icon: CheckCircle2,
      // Emerald: Simbol Sukses/Uang
      color: ["text-emerald-600", "bg-emerald-50", "border-emerald-100"],
    },
    {
      id: "users_paid",
      title: "Users Paid",
      value: data ? formatNumber(data.financial.usersPaidToday) : "...",
      subLabel: "Processed Today",
      trend: data?.financial.trend, // Pake trend financial juga
      icon: Users,
      // Blue: Simbol User
      color: ["text-blue-600", "bg-blue-50", "border-blue-100"],
    },
    {
      id: "created",
      title: "Links Created",
      value: data ? formatNumber(data.content.linksCreatedToday) : "...",
      subLabel: "New Links Today",
      trend: data?.content.trend,
      icon: Link2,
      // Indigo: Simbol Konten
      color: ["text-indigo-600", "bg-indigo-50", "border-indigo-100"],
    },
    {
      id: "blocked",
      title: "Blocked Links",
      value: data ? formatNumber(data.security.linksBlockedToday) : "...",
      subLabel: "Blocked Today",
      trend: data?.security.trend,
      icon: Ban,
      // Red: Simbol Bahaya
      color: ["text-red-600", "bg-red-50", "border-red-100"],
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[160px] flex items-center justify-center"
          >
            <Loader2 className="w-10 h-10 text-bluelight/20 animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 font-figtree text-[10px]">
      {cards.map((card, index) => {
        const [textColor, bgColor, borderColor] = card.color;
        const TrendIcon =
          card.trend && card.trend > 0 ? TrendingUp : TrendingDown;
        const trendColor =
          card.trend && card.trend > 0 ? "text-emerald-600" : "text-red-600";
        const trendBg =
          card.trend && card.trend > 0 ? "bg-emerald-50" : "bg-red-50";

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-8 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-gray-100"
          >
            {/* Header: Title */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-[1.6em] font-semibold text-grays tracking-tight">
                {card.title}
              </p>
            </div>

            {/* Body */}
            <div className="flex justify-between items-end relative z-10">
              <div>
                {/* Value Besar */}
                <h3
                  className={clsx(
                    "text-[3.6em] font-bold font-manrope leading-none mb-3",
                    textColor
                  )}
                >
                  {card.value}
                </h3>

                {/* Subtitle / Context */}
                <div className="flex items-center gap-3">
                  {card.trend !== undefined ? (
                    <div
                      className={clsx(
                        "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[1.2em] font-bold",
                        trendBg,
                        trendColor
                      )}
                    >
                      <TrendIcon className="w-3.5 h-3.5" />
                      <span>{Math.abs(card.trend)}%</span>
                    </div>
                  ) : null}

                  <span className="text-[1.3em] text-slate-400 font-medium">
                    {card.subLabel}
                  </span>
                </div>
              </div>

              {/* Icon Circle yang Elegan */}
              <div
                className={clsx(
                  "w-[5.5em] h-[5.5em] rounded-full flex justify-center items-center border-2 transition-transform duration-500 group-hover:rotate-12",
                  bgColor,
                  borderColor
                )}
              >
                <card.icon className={clsx("w-[2.8em] h-[2.8em]", textColor)} />
              </div>
            </div>

            {/* Dekorasi Background Halus */}
            <div
              className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-5 pointer-events-none transition-transform duration-500 group-hover:scale-150 ${
                card.title.includes("Paid")
                  ? "bg-emerald-600"
                  : card.title.includes("Users")
                  ? "bg-blue-600"
                  : card.title.includes("Created")
                  ? "bg-indigo-600"
                  : "bg-red-600"
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
