// src/components/dashboard/withdrawal/WithdrawalMethodCard.tsx
"use client";

import { motion } from "framer-motion";
import { CreditCard, Settings, AlertTriangle, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { PaymentMethod } from "@/types/type";
import clsx from "clsx";

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
      {/* Header Kecil */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.6em] font-bold text-shortblack flex items-center gap-2">
          Payment Method
        </h3>
        <Link
          href="/settings?tab=payment"
          className="p-2 text-grays hover:text-bluelight hover:bg-blues rounded-xl transition-colors"
          title="Change Method"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      {/* Content Area - Flex Grow biar ngisi tinggi */}
      <div className="flex-1 flex flex-col">
        {method ? (
          // === STATE: ADA METODE (Tampilan Kartu Kredit Digital) ===
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative bg-gradient-to-br from-bluelight to-blue-600 rounded-3xl p-8 text-white shadow-sm shadow-slate-400/50 overflow-hidden group">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="text-[1.4em] text-white font-medium">
                    Primary Account
                  </span>
                  {/* Logo Provider (Simulasi Teks/Icon) */}
                  <span className="text-[1.8em] font-bold tracking-wider uppercase">
                    {method.provider}
                  </span>
                </div>

                <div className="space-y-1 mt-6">
                  <p className="text-[1.8em] font-mono tracking-widest">
                    {method.accountNumber}
                  </p>
                  <p className="text-[1.3em] text-white uppercase tracking-wide">
                    {method.accountName}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Tambahan Kecil di Bawah Kartu */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-[1.2em] text-green-800 leading-snug">
                Akun Anda terverifikasi dan siap menerima pembayaran otomatis.
              </p>
            </div>
          </div>
        ) : (
          // === STATE: KOSONG / NO METHOD (Simetris & Clean) ===
          <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100 shadow-inner">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <h4 className="text-[1.8em] font-bold text-shortblack mb-2">
              No Payment Method
            </h4>
            <p className="text-[1.4em] text-grays max-w-[250px] mx-auto leading-relaxed mb-8">
              Anda belum mengatur metode pembayaran. Harap atur terlebih dahulu
              untuk melakukan penarikan.
            </p>

            <Link
              href="/settings?tab=payment"
              className="bg-shortblack text-white px-8 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 hover:shadow-lg transition-all w-full max-w-[200px]"
            >
              Setup Now
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
