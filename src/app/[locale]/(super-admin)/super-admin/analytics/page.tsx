"use client";

import { Users, UserCheck, Link2, MousePointerClick } from "lucide-react";
import SharedStatsGrid, {
  type StatCardData,
} from "@/components/dashboard/SharedStatsGrid";
import { usePlatformAnalytics } from "@/hooks/usePlatformAnalytics";
import ActiveUsersDetailCard from "@/components/dashboard/super-admin/ActiveUsersDetailCard";
import PlatformActivityDetailCard from "@/components/dashboard/super-admin/PlatformActivityDetailCard";

export default function PlatformAnalyticsPage() {
  const { stats, isLoading } = usePlatformAnalytics();

  // Format number dengan comma
  const formatNumber = (num: number) => num.toLocaleString("en-US");

  // Convert stats data ke format SharedStatsGrid
  const statsCards: StatCardData[] = [
    {
      id: "total-users",
      title: "Total Users",
      value: stats ? formatNumber(stats.totalUsers) : "0",
      subLabel: "All registered users",
      trend: stats?.totalUsersGrowth,
      icon: Users,
      color: "blue",
    },
    {
      id: "active-users",
      title: "Active Users",
      value: stats ? formatNumber(stats.activeUsers) : "0",
      subLabel: "Last 30 days",
      trend: stats?.activeUsersGrowth,
      icon: UserCheck,
      color: "green",
    },
    {
      id: "total-links",
      title: "Total Links",
      value: stats ? formatNumber(stats.totalLinks) : "0",
      subLabel: "All created links",
      trend: stats?.totalLinksGrowth,
      icon: Link2,
      color: "purple",
    },
    {
      id: "total-clicks",
      title: "Total Clicks/Views",
      value: stats ? formatNumber(stats.totalClicks) : "0",
      subLabel: "Platform-wide",
      trend: stats?.totalClicksGrowth,
      icon: MousePointerClick,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header */}
      <div>
        <h1 className="text-[2.4em] font-bold text-shortblack">
          Platform Analytics
        </h1>
        <p className="text-gray-400 text-[1.4em]">
          Comprehensive overview of platform performance and metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div>
        <SharedStatsGrid cards={statsCards} isLoading={isLoading} columns={4} />
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveUsersDetailCard />
        <PlatformActivityDetailCard />
      </div>
    </div>
  );
}
