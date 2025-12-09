"use client";

import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import type { WithdrawalTrend } from "@/services/revenueService";
import { formatCurrency } from "@/services/revenueService";

interface WithdrawalTrendsChartProps {
  data: WithdrawalTrend[];
}

export default function WithdrawalTrendsChart({
  data,
}: WithdrawalTrendsChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.total));
  const chartHeight = 250;

  // Calculate points for each line
  const getPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const totalPoints = getPoints(data.map((d) => d.total));
  const approvedPoints = getPoints(data.map((d) => d.approved));
  const rejectedPoints = getPoints(data.map((d) => d.rejected));
  const pendingPoints = getPoints(data.map((d) => d.pending));

  const lines = [
    {
      points: totalPoints,
      color: "#3b82f6",
      label: "Total",
      strokeWidth: 3,
    },
    {
      points: approvedPoints,
      color: "#10b981",
      label: "Approved",
      strokeWidth: 2.5,
    },
    {
      points: rejectedPoints,
      color: "#ef4444",
      label: "Rejected",
      strokeWidth: 2,
    },
    {
      points: pendingPoints,
      color: "#f59e0b",
      label: "Pending",
      strokeWidth: 2,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 font-figtree h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-2xl">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">
            Withdrawal Trends
          </h2>
          <p className="text-[1.3em] text-grays">
            Trend withdrawal 6 bulan terakhir
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="0.2"
            />
          ))}

          {/* Lines with gradient */}
          {lines.map((line, index) => (
            <g key={line.label}>
              {/* Gradient fill */}
              <defs>
                <linearGradient
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{
                      stopColor: line.color,
                      stopOpacity: 0.2,
                    }}
                  />
                  <stop
                    offset="100%"
                    style={{
                      stopColor: line.color,
                      stopOpacity: 0,
                    }}
                  />
                </linearGradient>
              </defs>

              {/* Area under line */}
              <motion.polygon
                points={`0,100 ${line.points} 100,100`}
                fill={`url(#gradient-${index})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />

              {/* Line */}
              <motion.polyline
                points={line.points}
                fill="none"
                stroke={line.color}
                strokeWidth={line.strokeWidth / 10}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              />
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2">
          {data.map((item, index) => (
            <span key={index} className="text-[1.2em] text-grays font-medium">
              {item.month}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-8 justify-center">
        {lines.map((line, index) => {
          const latestValue = data[data.length - 1];
          let value = 0;
          switch (line.label) {
            case "Total":
              value = latestValue.total;
              break;
            case "Approved":
              value = latestValue.approved;
              break;
            case "Rejected":
              value = latestValue.rejected;
              break;
            case "Pending":
              value = latestValue.pending;
              break;
          }

          return (
            <motion.div
              key={line.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              <div>
                <p className="text-[1.2em] text-grays font-medium">
                  {line.label}
                </p>
                <p
                  className="text-[1.4em] font-bold"
                  style={{ color: line.color }}
                >
                  {formatCurrency(value)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-[1.6em] text-grays">No trend data available</p>
        </div>
      )}
    </div>
  );
}
