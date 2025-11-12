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
} from "lucide-react"; // Pastikan DollarSign dan Users ada
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard"; // <-- IMPORT KOMPONEN BARU

export default function DashboardPage() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  // UBAH: Ini jadi array KONFIGURASI, bukan data
  const statsCards = [
    {
      icon: BanknoteArrowUp,
      color: [
        "text-bluelight",
        "bg-blue-dashboard",
        "border-bluelight",
      ],
      label: t("totalEarnings"),
      apiEndpoint: "/api/stats/earnings", // Endpoint buat API earnings
    },
    {
      icon: MousePointerClick,
      color: [
        "text-darkpurple-dashboard",
        "bg-lightpurple-dashboard",
        "border-darkpurple-dashboard",
      ],
      label: t("totalClicks"),
      apiEndpoint: "/api/stats/clicks", // Endpoint buat API clicks
    },
    {
      icon: MousePointer2Icon,
      color: [
        "text-darkpurple-dashboard",
        "bg-lightpurple-dashboard",
        "border-darkpurple-dashboard",
      ],
      label: t("validClicks"),
      apiEndpoint: "/api/stats/validClicks", // Endpoint buat API clicks
    },
    // Lu bisa tambahin kartu lain di sini dengan gampang
    // {
    //   icon: ShoppingCart, // Contoh
    //   label: "Total Sales",
    //   apiEndpoint: "/api/stats/sales"
    // },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* UBAH: Looping diganti jadi ini */}
        {statsCards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            color={card.color}
            label={card.label}
            apiEndpoint={card.apiEndpoint}
          />
        ))}
        {/* <div className="col-span-2 rounded-xl md:py-[1.3vw] py-[3vw] w-full bg-white shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200"></div> */}
      </div>

      {/* Charts Section (Ini sisa kode lu, gak diubah) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  U{i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    User {i} completed a purchase
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {i} hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
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
