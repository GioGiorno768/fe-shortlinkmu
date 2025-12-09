"use client";

import { motion } from "motion/react";
import { PieChart } from "lucide-react";
import clsx from "clsx";
import type { RevenueByLevel } from "@/services/revenueService";
import { formatCurrency } from "@/services/revenueService";

interface RevenueByLevelChartProps {
  data: RevenueByLevel[];
}

export default function RevenueByLevelChart({
  data,
}: RevenueByLevelChartProps) {
  // Calculate total for center display
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);

  // Calculate cumulative percentages for donut segments
  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const startPercentage = cumulativePercentage;
    cumulativePercentage += item.percentage;
    return {
      ...item,
      startPercentage,
      endPercentage: cumulativePercentage,
    };
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 font-figtree h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-2xl">
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">
            Revenue by Ad Level
          </h2>
          <p className="text-[1.3em] text-grays">
            Distribusi revenue per level iklan
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Donut Chart Visual */}
        <div className="relative w-64 h-64 flex-shrink-0">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="40"
            />

            {/* Donut segments */}
            {segments.map((segment, index) => {
              const circumference = 2 * Math.PI * 70;
              const offset =
                circumference * (1 - segment.startPercentage / 100);
              const dashArray = `${
                (circumference * segment.percentage) / 100
              } ${circumference}`;

              return (
                <motion.circle
                  key={segment.levelId}
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={dashArray}
                  strokeDashoffset={offset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  strokeLinecap="butt"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[1.2em] text-grays font-medium">Total</p>
            <p className="text-[2.2em] font-bold text-shortblack">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => (
            <motion.div
              key={item.levelId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Color indicator */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.color }}
                />

                {/* Level info */}
                <div>
                  <p className="text-[1.5em] font-semibold text-shortblack">
                    {item.levelName}
                  </p>
                  <p className="text-[1.2em] text-grays">
                    {item.userCount.toLocaleString()} users
                  </p>
                </div>
              </div>

              {/* Revenue & Percentage */}
              <div className="text-right">
                <p className="text-[1.5em] font-bold text-shortblack">
                  {formatCurrency(item.totalRevenue)}
                </p>
                <p
                  className="text-[1.3em] font-semibold"
                  style={{ color: item.color }}
                >
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-[1.6em] text-grays">No revenue data available</p>
        </div>
      )}
    </div>
  );
}
