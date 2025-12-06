// src/components/dashboard/MilestoneCard.tsx
"use client";

import { motion } from "motion/react";
import { TrendingUp, ChevronRight, Loader2, Lock, Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { MilestoneData } from "@/types/type";

// Terima data lewat props
interface MilestoneCardProps {
  data: MilestoneData | null;
}

export default function MilestoneCard({ data }: MilestoneCardProps) {
  const formatCurrency = (num: number) => "$" + num.toFixed(2);

  // Handle Loading State (Kalau data belum ada)
  if (!data) {
    return (
      <div className="h-full min-h-[180px] bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
      </div>
    );
  }

  // Destructure biar kodingan di bawah lebih bersih
  const {
    icon: Icon, // Rename jadi huruf besar biar bisa dipake sebagai Component
    currentLevel,
    nextLevel,
    currentEarnings,
    nextTarget,
    currentBonus,
    nextBonus,
    progress,
  } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative h-full p-8 bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 shadow-slate-400/50 text-shortblack overflow-hidden flex flex-col justify-between"
    >
      {/* Dekorasi Background */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 ${
          currentLevel === "Rookie"
            ? "bg-lightgreen-dashboard/50"
            : "bg-blue-50"
        } rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none`}
      />

      {/* --- HEADER: Current Status --- */}
      <div className="flex justify-between items-start relative z-10 ">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
            <Icon
              className={`w-8 h-8 ${
                // Cek nama komponen icon-nya (karena Icon sekarang berupa fungsi/objek)
                // Cara paling aman di sini pake logic props data aja kalau mau styling beda
                currentLevel === "Rookie" ? "text-green-500" : "text-yellow-300"
              }`}
            />
          </div>
          <div>
            <p className="text-[1.2em] text-slate-400 font-medium mb-1">
              Current Rank
            </p>
            <h3 className="text-[2.4em] font-bold leading-none">
              {currentLevel}
            </h3>
          </div>
        </div>

        {/* Badge Bonus CPM */}
        <div className="text-right hidden md:block">
          <div className="inline-flex items-center gap-2 bg-lightgreen-dashboard border border-darkgreen-dashboard px-3 py-1.5 rounded-full text-darkgreen-dashboard font-bold text-[1.2em]">
            <TrendingUp className="w-4 h-4" />
            <span>+{currentBonus}% CPM Bonus</span>
          </div>
        </div>

        <div className="text-right md:hidden block">
          <div className="flex justify-center flex-col items-center px-3 py-1.5 rounded-full text-darkgreen-dashboard font-bold text-[1.2em]">
            <div className="text-[2.4em] flex items-center gap-2">
              <span>+{currentBonus}%</span>
            </div>
            <span className="flex">CPM Bonus</span>
          </div>
        </div>
      </div>

      {/* --- BODY: Progress Bar & Target --- */}
      <div className="mt-8 relative z-10">
        <div className="flex justify-between items-end mb-3 text-[1.3em]">
          <span className="text-shortblack">
            Earnings:{" "}
            <b className="text-bluelight">{formatCurrency(currentEarnings)}</b>
          </span>
          <span className="text-slate-400">
            Target: {formatCurrency(nextTarget)}
          </span>
        </div>

        {/* Bar Container */}
        <div className="h-4 bg-slate-600/10 rounded-full overflow-hidden relative">
          {/* Bar Fill (Animated) */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
          </motion.div>
        </div>

        {/* Motivation Text */}
        <p className="mt-3 text-[1.2em] text-slate-400">
          You need{" "}
          <span className="text-bluelight font-bold">
            {formatCurrency(nextTarget - currentEarnings)}
          </span>{" "}
          more to unlock{" "}
          <span className="text-yellow-400 font-bold">{nextLevel}</span>.
        </p>
      </div>

      {/* --- FOOTER: Next Reward Preview --- */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 opacity-70">
          <Lock className="w-5 h-5 text-slate-400" />
          <span className="text-[1.2em] text-slate-500">
            Next Reward:{" "}
            <span className="text-bluelight font-bold">+{nextBonus}% CPM</span>
          </span>
        </div>

        <Link
          href="/levels"
          className="flex items-center gap-1 text-[1.2em] font-semibold text-bluelight/65 hover:text-bluelight transition-colors group"
        >
          View Levels
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
