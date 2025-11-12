"use client";
import { Link } from "@/i18n/routing";
// src/app/page.tsx
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BanknoteArrowUp,
  MousePointerClick,
  MousePointerBan,
  MousePointer2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import AchievementCard from "@/components/dashboard/AchievementCard"; // <-- IMPORT KARTU BARU
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";

export default function DashboardPage() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  // Ini 3 kartu pertama
  const statsCards = [
    {
      icon: BanknoteArrowUp,
      color: ["text-bluelight", "bg-blue-dashboard", "border-bluelight"],
      label: t("totalEarnings"),
      apiEndpoint: "/api/stats/earnings",
    },
    {
      icon: MousePointerClick,
      color: [
        "text-darkpurple-dashboard",
        "bg-lightpurple-dashboard",
        "border-darkpurple-dashboard",
      ],
      label: t("totalClicks"),
      apiEndpoint: "/api/stats/clicks",
    },
    {
      icon: MousePointer2Icon,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("totalViews"),
      apiEndpoint: "/api/stats/totalViews",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Stats Grid */}
      {/* UBAH GRID: 3 kartu pertama + 1 kartu achievement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Render 3 kartu pertama */}
        {statsCards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            color={card.color}
            label={card.label}
            apiEndpoint={card.apiEndpoint}
          />
        ))}

        {/* TAMBAHKAN KARTU ACHIEVEMENT DI SINI */}
        <div className="col-span-1 lg:col-span-1">
          <AchievementCard />
        </div>
      </div>

      {/* Charts Section (Ini sisa kode lu, gak diubah) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {/* 2. GANTI "RECENT ACTIVITY" JADI KARTU BARU LU */}
        {/* KITA BUAT JADI 'lg:col-span-2' BIAR LEBAR SESUAI GAMBAR */}
        <div className="">
          <LinkAnalyticsCard />
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Top Products
          </h3>
          <div className="space-y-3">
            {[
              { name: "Product A", sales: 234 },
              { name: "Product B", sales: 189 },
              { name: "Product C", sales: 156 },
              { name: "Product D", sales: 142 },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {product.name}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {product.sales} sales
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
