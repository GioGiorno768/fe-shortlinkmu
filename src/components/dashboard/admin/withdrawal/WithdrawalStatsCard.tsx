"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, Trophy, TrendingUp, Loader2 } from "lucide-react";
import clsx from "clsx";
import type { AdminWithdrawalStats } from "@/types/type";

interface Props {
  stats: AdminWithdrawalStats | null;
  isLoading: boolean;
}

export default function WithdrawalStatsCard({ stats, isLoading }: Props) {
  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const cards = [
    {
      title: "Paid Today",
      value: stats ? formatCurrency(stats.paidToday.amount) : "...",
      sub: `${stats?.paidToday.count} Transactions`,
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Users Paid",
      value: stats ? stats.totalUsersPaid.count.toString() : "...",
      sub: "Unique Users",
      trend: stats?.totalUsersPaid.trend,
      icon: Users,
      color: "blue",
    },
    {
      title: "Highest Withdrawal",
      value: stats ? formatCurrency(stats.highestWithdrawal.amount) : "...",
      sub: `by ${stats?.highestWithdrawal.user}`,
      icon: Trophy,
      color: "amber",
    },
  ];

  const getStyles = (color: string) => {
    switch (color) {
      case "blue":
        return {
          text: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
          iconBg: "bg-blue-100",
        };
      case "emerald":
        return {
          text: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          iconBg: "bg-emerald-100",
        };
      case "amber":
        return {
          text: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          iconBg: "bg-amber-100",
        };
      default:
        return {
          text: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-100",
          iconBg: "bg-gray-100",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[120px] bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center"
          >
            <Loader2 className="w-6 h-6 animate-spin text-bluelight/30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-figtree">
      {cards.map((card, idx) => {
        const style = getStyles(card.color);

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={clsx(
              "relative p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group",
              style.border
            )}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={clsx("p-3 rounded-xl", style.iconBg, style.text)}>
                <card.icon className="w-6 h-6" />
              </div>
              {/* Trend Badge if needed */}
              {card.trend && (
                <div className="flex items-center gap-1 text-[1.1em] font-bold px-2 py-1 rounded-lg bg-white/80 border border-gray-100 shadow-sm text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  {card.trend}%
                </div>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-[2.8em] font-bold text-shortblack leading-none mb-1 font-manrope">
                {card.value}
              </h3>
              <p className="text-[1.3em] text-grays font-medium">
                {card.title}
              </p>
              <p className="text-[0.9em] text-gray-400 mt-1">{card.sub}</p>
            </div>

            {/* Decorative Circle */}
            <div
              className={clsx(
                "absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 pointer-events-none transition-transform duration-500 group-hover:scale-125",
                style.bg.replace("bg-", "bg-") // Hacky way to get color, better to use style.text color mapping if needed, but style.bg is bg-color-50. Let's use inline style for bg color to be safe or map it.
              )}
              style={{
                backgroundColor:
                  card.color === "emerald"
                    ? "#10b981"
                    : card.color === "blue"
                    ? "#3b82f6"
                    : "#f59e0b",
              }}
            ></div>
          </motion.div>
        );
      })}
    </div>
  );
}
