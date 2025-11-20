"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, Activity } from "lucide-react";
import type { ReferralStats } from "@/types/type";

interface ReferralStatsGridProps {
  stats: ReferralStats | null;
}

export default function ReferralStatsGrid({ stats }: ReferralStatsGridProps) {
  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Earnings */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
          <DollarSign className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[1.4em] text-grays">Pendapatan Referral</p>
          <h3 className="text-[2.8em] font-bold text-shortblack">
            {formatCurrency(stats?.totalEarnings || 0)}
          </h3>
        </div>
      </motion.div>

      {/* Total Users */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-bluelight">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[1.4em] text-grays">Total Diundang</p>
          <h3 className="text-[2.8em] font-bold text-shortblack">
            {stats?.totalReferred || 0} User
          </h3>
        </div>
      </motion.div>

      {/* Active Users */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[1.4em] text-grays">User Aktif</p>
          <h3 className="text-[2.8em] font-bold text-shortblack">
            {stats?.activeReferred || 0} User
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
