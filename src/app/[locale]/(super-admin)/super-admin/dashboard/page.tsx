"use client";

import SharedStatsGrid, {
  StatCardData,
} from "@/components/dashboard/SharedStatsGrid"; // <--- REUSE DISINI
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { DollarSign, Users, Ban, UserCheck } from "lucide-react";
import RevenueEstimationChart from "@/components/dashboard/super-admin/RevenueEstimationChart";
import AuditLogCard from "@/components/dashboard/super-admin/AuditLogCard";
import { useState, useEffect } from "react";
import { getRecentAuditLogs } from "@/services/superAdminService";
import type { AuditLog } from "@/types/type";

export default function SuperAdminDashboardPage() {
  const { stats, isLoading } = useSuperAdmin();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  useEffect(() => {
    getRecentAuditLogs().then((data) => {
      setAuditLogs(data);
      setIsLogsLoading(false);
    });
  }, []);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // MAPPING DATA SUPER ADMIN (Beda Config)
  const superAdminCards: StatCardData[] = [
    {
      id: "paid",
      title: "Paid Today",
      value: stats ? formatCurrency(stats.financial.paidToday) : "...",
      subLabel: "Total Disbursement",
      trend: stats?.financial.trend,
      icon: DollarSign,
      color: "green",
    },
    {
      id: "users",
      title: "Users Paid",
      value: stats ? stats.financial.usersPaidToday.toString() : "...",
      subLabel: "Processed Today",
      trend: stats?.financial.trend,
      icon: Users,
      color: "blue",
    },
    {
      id: "blocked",
      title: "Blocked Links",
      value: stats ? stats.security.blockedLinksToday.toString() : "...",
      subLabel: "System Block",
      trend: stats?.security.trend,
      icon: Ban,
      color: "red",
    },
    {
      id: "staff",
      title: "Staff Online",
      value: stats
        ? `${stats.system.staffOnline} / ${stats.system.totalStaff}`
        : "...",
      subLabel: "Active Admins",
      icon: UserCheck,
      color: "orange", // Warna beda buat sistem
    },
  ];

  return (
    <div className="space-y-8 pb-24 text-[10px]">
      {/* 1. Top Stats (REUSE) */}
      <SharedStatsGrid
        cards={superAdminCards}
        isLoading={isLoading}
        columns={4}
      />

      {/* 2. Revenue Chart */}
      <RevenueEstimationChart />

      {/* 3. Audit Logs */}
      <AuditLogCard logs={auditLogs} isLoading={isLogsLoading} />

      {/* 4. Chart & Logs */}
      {/* ... (kode chart) ... */}
    </div>
  );
}
