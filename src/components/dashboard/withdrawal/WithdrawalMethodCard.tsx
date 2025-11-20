"use client";

import { motion } from "framer-motion";
import { CreditCard, Settings, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { PaymentMethod } from "@/types/type";

interface WithdrawalMethodCardProps {
  method: PaymentMethod | null;
}

export default function WithdrawalMethodCard({
  method,
}: WithdrawalMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-3xl p-8 shadow-sm shadow-slate-500/20 border border-gray-100 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[1.8em] font-bold text-shortblack flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-bluelight" />
          Payment Method
        </h3>
        <Link
          href="/settings" // Link ke halaman setting buat ganti metode
          className="p-2 text-grays hover:text-bluelight hover:bg-blues rounded-lg transition-colors"
          title="Change Method"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {method ? (
          <div className="bg-blues rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[1.4em] font-medium text-grays">
                Provider
              </span>
              <span className="text-[1.6em] font-bold text-bluelight">
                {method.provider}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[1.4em] font-medium text-grays">Name</span>
              <span className="text-[1.6em] font-semibold text-shortblack">
                {method.accountName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[1.4em] font-medium text-grays">
                Account
              </span>
              <span className="text-[1.6em] font-mono text-shortblack">
                {method.accountNumber}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 text-center space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[1.6em] font-bold text-orange-700">
                No Method Selected
              </p>
              <p className="text-[1.4em] text-orange-600/80">
                Please set up your payment details before requesting a payout.
              </p>
            </div>
            <Link
              href="/settings"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-[1.4em] hover:bg-orange-600 transition-colors"
            >
              Setup Now
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-[1.2em] text-grays flex items-start gap-2">
          <span className="text-bluelight font-bold">ℹ️ Info:</span>
          Payments are processed daily. Allow up to 24-48 hours for the funds to
          appear in your account.
        </p>
      </div>
    </motion.div>
  );
}
