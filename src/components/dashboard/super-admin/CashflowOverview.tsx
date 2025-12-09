"use client";

import { motion } from "motion/react";
import { DollarSign, TrendingDown, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { formatCurrency } from "@/services/revenueService";

interface CashflowOverviewProps {
  totalRevenue: number;
  totalWithdrawals: number; // paid + pending
  platformBalance: number;
}

export default function CashflowOverview({
  totalRevenue,
  totalWithdrawals,
  platformBalance,
}: CashflowOverviewProps) {
  const revenuePercentage =
    (totalRevenue / (totalRevenue + totalWithdrawals)) * 100;
  const withdrawalPercentage = 100 - revenuePercentage;

  const isHealthy = platformBalance > 0;
  const burnRate =
    totalWithdrawals > 0
      ? ((totalWithdrawals / totalRevenue) * 100).toFixed(1)
      : "0";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 font-figtree">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-[2em] font-bold text-shortblack">
              Cashflow Overview
            </h2>
            <p className="text-[1.3em] text-grays">
              Perbandingan revenue vs withdrawal
            </p>
          </div>
        </div>

        {/* Health Badge */}
        <div
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl border",
            isHealthy
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          )}
        >
          {isHealthy ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[1.3em] font-semibold">Healthy</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span className="text-[1.3em] font-semibold">Warning</span>
            </>
          )}
        </div>
      </div>

      {/* Comparison Bars */}
      <div className="space-y-6">
        {/* Revenue Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[1.4em] font-semibold text-green-700">
              Total Revenue
            </span>
            <span className="text-[1.6em] font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="h-12 bg-gray-100 rounded-2xl overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-end px-4"
              initial={{ width: 0 }}
              animate={{ width: `${revenuePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="text-[1.3em] font-bold text-white drop-shadow-sm">
                {revenuePercentage.toFixed(1)}%
              </span>
            </motion.div>
          </div>
        </div>

        {/* Withdrawals Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[1.4em] font-semibold text-red-700">
              Total Withdrawals
            </span>
            <span className="text-[1.6em] font-bold text-red-600">
              {formatCurrency(totalWithdrawals)}
            </span>
          </div>
          <div className="h-12 bg-gray-100 rounded-2xl overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-2xl flex items-center justify-end px-4"
              initial={{ width: 0 }}
              animate={{ width: `${withdrawalPercentage}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <span className="text-[1.3em] font-bold text-white drop-shadow-sm">
                {withdrawalPercentage.toFixed(1)}%
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {/* Platform Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={clsx(
            "p-6 rounded-2xl border-2",
            isHealthy
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          )}
        >
          <p className="text-[1.3em] text-grays font-medium mb-1">
            Platform Balance
          </p>
          <p
            className={clsx(
              "text-[2.4em] font-bold",
              isHealthy ? "text-green-700" : "text-red-700"
            )}
          >
            {formatCurrency(platformBalance)}
          </p>
          <p className="text-[1.2em] text-grays mt-1">
            {isHealthy ? "Surplus aktif" : "Perlu top up"}
          </p>
        </motion.div>

        {/* Burn Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            <p className="text-[1.3em] text-grays font-medium">Burn Rate</p>
          </div>
          <p className="text-[2.4em] font-bold text-amber-700">{burnRate}%</p>
          <p className="text-[1.2em] text-grays mt-1">
            Withdrawal vs Revenue ratio
          </p>
        </motion.div>
      </div>

      {/* Warning Alert */}
      {!isHealthy && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[1.4em] font-semibold text-red-700 mb-1">
              Platform Balance Low!
            </p>
            <p className="text-[1.2em] text-red-600">
              Pending withdrawals melebihi balance. Pastikan ada dana cukup
              untuk membayar user.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
