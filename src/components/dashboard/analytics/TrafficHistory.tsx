// src/components/dashboard/analytics/TrafficHistory.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Crown,
  Calendar,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import clsx from "clsx";

// --- TIPE DATA ---
interface MonthlyStat {
  month: string; // "Jan", "Feb"
  year: number; // 2025
  views: number; // 405123
  cpm: number; // 4.50
  earnings: number; // 1822.50
  level: string; // "Mythic", "Master"
  growth: number; // +12.5 (persen dibanding bulan lalu)
}

// --- MOCK API ---
async function fetchTrafficHistory(): Promise<MonthlyStat[]> {
  // Simulasi loading
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      month: "Feb",
      year: 2025,
      views: 405123,
      cpm: 4.5,
      earnings: 1823.05,
      level: "Mythic",
      growth: 12.5,
    },
    {
      month: "Jan",
      year: 2025,
      views: 360050,
      cpm: 3.8,
      earnings: 1368.19,
      level: "Master",
      growth: 5.2,
    },
    {
      month: "Dec",
      year: 2024,
      views: 342100,
      cpm: 3.5,
      earnings: 1197.35,
      level: "Pro",
      growth: -2.1,
    },
    {
      month: "Nov",
      year: 2024,
      views: 350000,
      cpm: 3.5,
      earnings: 1225.0,
      level: "Pro",
      growth: 8.4,
    },
    {
      month: "Oct",
      year: 2024,
      views: 322500,
      cpm: 3.2,
      earnings: 1032.0,
      level: "Elite",
      growth: 1.5,
    },
  ];
}

export default function TrafficHistory() {
  const [data, setData] = useState<MonthlyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await fetchTrafficHistory();
      setData(res);
      setIsLoading(false);
    }
    load();
  }, []);

  // Helper Format
  const formatViews = (val: number) => val.toLocaleString("en-US");
  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // Cari data terbaik (Top Month) buat Highlight
  const topMonth = data.reduce(
    (prev, current) => (prev.views > current.views ? prev : current),
    data[0]
  );

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div // ID buat anchor link
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-figtree"
    >
      {/* --- HEADER SECTION --- */}
      <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-[2em] font-bold text-shortblack flex items-center gap-3">
            <Calendar className="w-7 h-7 text-bluelight" />
            Traffic Performance
          </h3>
          <p className="text-[1.4em] text-grays mt-2">
            Detail performa trafik bulanan, CPM, dan pendapatan Anda.
          </p>
        </div>

        {/* Highlight Box Kecil */}
        {topMonth && (
          <div className="flex gap-4">
            <div className="bg-yellow-50 border border-yellow-200 px-6 py-3 rounded-2xl flex items-center gap-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[1.1em] text-yellow-700 font-bold uppercase tracking-wider">
                  Best Traffic
                </p>
                <p className="text-[1.6em] font-bold text-shortblack">
                  {topMonth.month} {topMonth.year}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blues text-grays uppercase text-[1.2em] font-bold tracking-wider">
            <tr>
              <th className="px-8 py-5">Month</th>
              <th className="px-8 py-5">Views (Traffic)</th>
              <th className="px-8 py-5">Avg. CPM (Level)</th>
              <th className="px-8 py-5 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, index) => (
              <motion.tr
                key={`${item.month}-${item.year}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={clsx(
                  "hover:bg-slate-50 transition-colors group",
                  item === topMonth && "bg-blue-50/30" // Highlight baris Top Month
                )}
              >
                {/* Kolom Bulan */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[1.4em] font-bold text-grays group-hover:bg-white group-hover:text-bluelight transition-colors group-hover:shadow-sm">
                      {item.month.substring(0, 3)}
                    </div>
                    <div>
                      <p className="text-[1.5em] font-bold text-shortblack">
                        {item.year}
                      </p>
                      {item.growth !== 0 && (
                        <span
                          className={clsx(
                            "text-[1.1em] font-semibold flex items-center gap-1",
                            item.growth > 0 ? "text-green-600" : "text-red-500"
                          )}
                        >
                          {item.growth > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(item.growth)}%
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Kolom Views */}
                <td className="px-8 py-6">
                  <p className="text-[1.6em] font-semibold text-shortblack">
                    {formatViews(item.views)}
                  </p>
                  {item === topMonth && (
                    <span className="inline-flex items-center gap-1 text-[1em] text-bluelight bg-blue-100 px-2 py-0.5 rounded text-xs font-bold uppercase mt-1">
                      <TrendingUp className="w-3 h-3" /> Top Traffic
                    </span>
                  )}
                </td>

                {/* Kolom CPM / Level */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[1.6em] font-mono font-medium text-grays">
                      ${item.cpm.toFixed(2)}
                    </span>
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-[1.1em] font-bold uppercase",
                        item.level === "Mythic"
                          ? "bg-purple-100 text-purple-700"
                          : item.level === "Master"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      )}
                    >
                      {item.level}
                    </span>
                  </div>
                </td>

                {/* Kolom Earnings */}
                <td className="px-8 py-6 text-right">
                  <p className="text-[1.6em] font-bold text-green-600">
                    {formatCurrency(item.earnings)}
                  </p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
