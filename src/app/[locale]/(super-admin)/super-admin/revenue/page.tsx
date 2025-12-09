// src/app/[locale]/(super-admin)/super-admin/revenue/page.tsx
"use client";

import { Loader2, DollarSign, Wallet, Clock, TrendingUp } from "lucide-react";
import SharedStatsGrid, {
  type StatCardData,
} from "@/components/dashboard/SharedStatsGrid";
import CashflowOverview from "@/components/dashboard/super-admin/CashflowOverview";
import RevenueByLevelChart from "@/components/dashboard/super-admin/RevenueByLevelChart";
import WithdrawalTrendsChart from "@/components/dashboard/super-admin/WithdrawalTrendsChart";
import TopEarnersCard from "@/components/dashboard/super-admin/TopEarnersCard";
import { useRevenue } from "@/hooks/useRevenue";
import { formatCurrency } from "@/services/revenueService";

export default function RevenuePage() {
  const {
    stats,
    topEarners,
    revenueByLevel,
    withdrawalTrends,
    isLoading,
    error,
  } = useRevenue();

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-redshortlink text-[1.6em]">
        {error}
      </div>
    );
  }

  // Stats Cards Configuration
  const statsCards: StatCardData[] = [
    {
      id: "total-revenue",
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      subLabel: `${stats?.totalUsers || 0} total users`,
      trend: 12.5,
      icon: DollarSign,
      color: "emerald",
    },
    {
      id: "paid-withdrawals",
      title: "Paid Withdrawals",
      value: formatCurrency(stats?.paidWithdrawals || 0),
      subLabel: "Successfully processed",
      trend: 8.3,
      icon: Wallet,
      color: "blue",
    },
    {
      id: "pending-withdrawals",
      title: "Pending Withdrawals",
      value: formatCurrency(stats?.pendingWithdrawals || 0),
      subLabel: "Awaiting approval",
      trend: -3.2,
      icon: Clock,
      color: "amber",
    },
    {
      id: "platform-balance",
      title: "Platform Balance",
      value: formatCurrency(stats?.platformBalance || 0),
      subLabel:
        stats && stats.platformBalance > 0 ? "Healthy" : "Needs attention",
      trend: stats && stats.platformBalance > 0 ? 5.7 : -15.2,
      icon: TrendingUp,
      color: stats && stats.platformBalance > 0 ? "green" : "red",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-8 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2.5em] font-bold text-shortblack flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-2xl text-green-600">
            <DollarSign className="w-8 h-8" />
          </div>
          Revenue & Financial Dashboard
        </h1>
        <p className="text-[1.6em] text-grays mt-2 ml-2">
          Monitor platform revenue, cashflow, dan withdrawal management
        </p>
      </div>

      {/* Stats Grid */}
      <SharedStatsGrid cards={statsCards} isLoading={false} columns={4} />

      {/* Cashflow Overview */}
      <CashflowOverview
        totalRevenue={stats?.totalRevenue || 0}
        totalWithdrawals={
          (stats?.paidWithdrawals || 0) + (stats?.pendingWithdrawals || 0)
        }
        platformBalance={stats?.platformBalance || 0}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Ad Level */}
        <RevenueByLevelChart data={revenueByLevel} />

        {/* Withdrawal Trends */}
        <WithdrawalTrendsChart data={withdrawalTrends} />
      </div>

      {/* Top Earners */}
      <TopEarnersCard earners={topEarners} />
    </div>
  );
}
