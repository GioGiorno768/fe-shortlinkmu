"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Clock, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { WithdrawalStats } from "@/types/type";

interface WithdrawalStatsCardProps {
  stats: WithdrawalStats | null;
  onRequest: () => void; // Callback buat parent
  isProcessing: boolean;
}

export default function WithdrawalStatsCard({
  stats,
  onRequest,
  isProcessing,
}: WithdrawalStatsCardProps) {
  const formatCurrency = (val: number) => `$${val.toFixed(4)}`; // 4 desimal buat presisi

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm shadow-slate-500/20 border border-gray-100 relative overflow-hidden"
    >
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        {/* Bagian Saldo Utama */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-grays">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[1.6em] font-medium">Available Balance</span>
          </div>
          <h1 className="text-[4em] font-bold text-bluelight leading-tight">
            {formatCurrency(stats?.availableBalance || 0)}
          </h1>
          <p className="text-[1.4em] text-grays">
            Minimum payout amount is <span className="font-bold">$5.00</span>
          </p>
        </div>

        {/* Tombol Request */}
        <div className="w-full md:w-auto">
          <button
            onClick={onRequest}
            disabled={isProcessing || (stats?.availableBalance || 0) < 5.0}
            className="w-full md:w-auto bg-bluelight text-white px-8 py-4 rounded-2xl font-bold text-[1.6em] 
                     hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                     flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="hugeicons--money-send-circle w-6 h-6 bg-white" />
            )}
            <span>{isProcessing ? "Processing..." : "Request Payout"}</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-8" />

      {/* Stats Kecil di Bawah */}
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[1.2em] text-grays uppercase font-semibold tracking-wider">
              Pending
            </p>
            <p className="text-[2em] font-bold text-shortblack">
              {formatCurrency(stats?.pendingWithdrawn || 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-bluelight">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[1.2em] text-grays uppercase font-semibold tracking-wider">
              Total Withdrawn
            </p>
            <p className="text-[2em] font-bold text-shortblack">
              {formatCurrency(stats?.totalWithdrawn || 0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
