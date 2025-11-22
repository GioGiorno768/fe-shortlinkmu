"use client";

import { motion } from "framer-motion";
import { Crown, TrendingUp, Zap } from "lucide-react";
import type { UserLevelProgress } from "@/types/type";
import clsx from "clsx";

interface CurrentLevelHeaderProps {
  data: UserLevelProgress;
}

export default function CurrentLevelHeader({ data }: CurrentLevelHeaderProps) {
  const formatCurrency = (num: number) =>
    "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const earningsNeeded = data.nextLevelEarnings - data.currentEarnings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-bluelight to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Background Dekorasi */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Icon Level Besar */}
        <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-inner">
          <Crown className="w-14 h-14 text-yellow-300" fill="currentColor" />
        </div>

        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
            <h2 className="text-[3em] font-bold capitalize tracking-tight">
              {data.currentLevel} Rank
            </h2>
            <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 px-4 py-1 rounded-full text-[1.2em] font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              Current Tier
            </span>
          </div>

          <p className="text-[1.6em] text-blue-100 mb-6">
            Keep pushing! You need{" "}
            <span className="font-bold text-white">
              {formatCurrency(earningsNeeded)}
            </span>{" "}
            more earnings to reach the next level.
          </p>

          {/* Progress Bar */}
          <div className="relative pt-2">
            <div className="flex justify-between text-[1.2em] font-medium text-blue-200 mb-2">
              <span>{formatCurrency(data.currentEarnings)}</span>
              <span>{formatCurrency(data.nextLevelEarnings)} (Target)</span>
            </div>
            <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative"
              >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
