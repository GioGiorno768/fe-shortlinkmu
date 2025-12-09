"use client";

import { Users, UserCheck, Ban, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import type { AdminStats } from "@/types/type";

interface AdminStatsCardsProps {
  stats: AdminStats | null;
  isLoading: boolean;
}

export default function AdminStatsCards({
  stats,
  isLoading,
}: AdminStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-12 bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Admins",
      value: stats.totalAdmins.count,
      trend: stats.totalAdmins.trend,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trendLabel: "vs last month",
    },
    {
      title: "Active Today",
      value: stats.activeToday.count,
      trend: stats.activeToday.trend,
      icon: UserCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      trendLabel: "active now",
    },
    {
      title: "Suspended",
      value: stats.suspendedAdmins.count,
      trend: stats.suspendedAdmins.trend,
      icon: Ban,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      trendLabel: "inactive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={clsx("p-3 rounded-xl", stat.bgColor)}>
                <Icon className={clsx("w-6 h-6", stat.iconColor)} />
              </div>
              <div
                className={clsx(
                  "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
                  isPositive
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                )}
              >
                <TrendIcon className="w-4 h-4" />
                {Math.abs(stat.trend)}%
              </div>
            </div>

            <h3 className="text-3xl font-bold text-shortblack mb-1">
              {stat.value}
            </h3>
            <p className="text-grays text-sm">{stat.title}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.trendLabel}</p>
          </div>
        );
      })}
    </div>
  );
}
