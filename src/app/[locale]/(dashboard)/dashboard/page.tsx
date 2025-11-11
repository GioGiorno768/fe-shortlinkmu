"use client";
import { Link } from "@/i18n/routing";
// src/app/page.tsx
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function DashboardPage() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  const stats = [
    {
      icon: DollarSign,
      label: t("totalEarnings"),
      value: "$45,231",
      status: "",
    },
    {
      icon: Users,
      label: t("totalClicks"),
      value: "2,345",
      status: "sd",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 
                       hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[1.8em] font-semibold text-shortblack tracking-tight">
                  {stat.label}
                </p>
                {/* <span
                  className={`text-sm font-semibold ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span> */}
                <div className="relative w-1/2 flex items-center justify-end">
                  <button className="w-[3.2em] h-[3.2em] flex items-center justify-center rounded-lg hover:bg-blue-dashboard transition-colors duration-300 relative">
                    <span className="solar--hamburger-menu-broken w-[2.5em] h-[2.5em] bg-shortblack hover:bg-bluelight transition-colors duration-300 " />
                  </button>
                  <div className="absolute top-[4em] p-[1em] w-full right-0 bg-white rounded-lg shadow-sm shadow-slate-500/50 grid grid-cols-1">
                    {["Week", "Month", "Year"].map((item, index) => (
                      <button
                        key={index}
                        className="text-[1.4em] px-[.5em] py-[.5em] rounded-lg hover:bg-blue-dashboard hover:text-bluelight transition-colors duration-300 text-start"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="text-[3em] font-semibold text-bluelight font-manrope">
                {stat.value}
              </h3>
              <p className="text-[1.4em] text-grays">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
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
