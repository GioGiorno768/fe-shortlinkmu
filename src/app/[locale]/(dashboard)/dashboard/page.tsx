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
      label: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      positive: true,
    },
    {
      icon: Users,
      label: "Total Users",
      value: "2,345",
      change: "+12.5%",
      positive: true,
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      value: "1,234",
      change: "-5.4%",
      positive: false,
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: "89.2%",
      change: "+8.1%",
      positive: true,
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Header */}
      <div className="mb-8 ml-[4em]">
        <h1 className="lg:text-[1.8em] text-[2.3em] font-semibold text-slate-900 ">Dashboard</h1>
        <p className="text-slate-600 lg:text-[1.4em] text-[1.8em] dark:text-slate-400">
          <Link href="/">Home</Link>
          {pathname.includes("/id/")
            ? pathname.replace("/id/", " > ")
            : pathname.replace(/^\//, " > ")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-800 
                       hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"></div>
                <span
                  className={`text-sm font-semibold ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
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
