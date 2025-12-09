"use client";

import { motion } from "motion/react";
import { Crown, TrendingUp, AlertTriangle, Ban } from "lucide-react";
import clsx from "clsx";
import type { TopEarner } from "@/services/revenueService";
import { formatCurrency } from "@/services/revenueService";

interface TopEarnersCardProps {
  earners: TopEarner[];
}

export default function TopEarnersCard({ earners }: TopEarnersCardProps) {
  const getStatusConfig = (status: TopEarner["status"]) => {
    switch (status) {
      case "active":
        return {
          icon: TrendingUp,
          label: "Active",
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "suspicious":
        return {
          icon: AlertTriangle,
          label: "Suspicious",
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case "banned":
        return {
          icon: Ban,
          label: "Banned",
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 font-figtree">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-50 rounded-2xl">
          <Crown className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">Top Earners</h2>
          <p className="text-[1.3em] text-grays">
            Users dengan earning tertinggi
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 text-[1.3em] font-semibold text-grays">
                Rank
              </th>
              <th className="text-left py-4 px-4 text-[1.3em] font-semibold text-grays">
                User
              </th>
              <th className="text-right py-4 px-4 text-[1.3em] font-semibold text-grays">
                Total Earnings
              </th>
              <th className="text-center py-4 px-4 text-[1.3em] font-semibold text-grays">
                Withdrawals
              </th>
              <th className="text-center py-4 px-4 text-[1.3em] font-semibold text-grays">
                Status
              </th>
              <th className="text-right py-4 px-4 text-[1.3em] font-semibold text-grays">
                Last Withdrawal
              </th>
            </tr>
          </thead>
          <tbody>
            {earners.map((earner, index) => {
              const statusConfig = getStatusConfig(earner.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.tr
                  key={earner.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(
                    "border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer group",
                    index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                  )}
                >
                  {/* Rank */}
                  <td className="py-4 px-4">
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[1.4em]",
                        index === 0 &&
                          "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg",
                        index === 1 &&
                          "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md",
                        index === 2 &&
                          "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md",
                        index > 2 && "bg-gray-100 text-grays"
                      )}
                    >
                      {index + 1}
                    </div>
                  </td>

                  {/* User */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={earner.avatar}
                        alt={earner.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <p className="text-[1.4em] font-semibold text-shortblack">
                          {earner.name}
                        </p>
                        <p className="text-[1.2em] text-grays">
                          {earner.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Total Earnings */}
                  <td className="py-4 px-4 text-right">
                    <p className="text-[1.6em] font-bold text-green-600">
                      {formatCurrency(earner.totalEarnings)}
                    </p>
                  </td>

                  {/* Withdrawal Count */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-[1.3em] font-semibold text-blue-700">
                        {earner.withdrawalCount}
                      </span>
                      <span className="text-[1.1em] text-blue-600">times</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <div
                      className={clsx(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                        statusConfig.bg,
                        statusConfig.text,
                        statusConfig.border
                      )}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-[1.2em] font-medium">
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>

                  {/* Last Withdrawal */}
                  <td className="py-4 px-4 text-right">
                    <p className="text-[1.3em] text-grays">
                      {new Date(earner.lastWithdrawal).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {earners.length === 0 && (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-[1.6em] text-grays">No earners data available</p>
        </div>
      )}
    </div>
  );
}
