// src/components/dashboard/settings/PaymentSection.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  Smartphone,
  Landmark,
  Bitcoin,
  ChevronDown,
  User,
  Plus,
  Trash2,
  Star,
  CheckCircle,
} from "lucide-react";
import clsx from "clsx";
import type { SavedPaymentMethod } from "@/types/type";
import ConfirmationModal from "../ConfirmationModal";
import { usePaymentLogic } from "@/hooks/useSettings"; // Pake Hook baru

// Konfigurasi Input Tetap Di Sini
const PAYMENT_CONFIG = {
  wallet: {
    label: "Digital Wallet",
    icon: Smartphone,
    methods: [
      { id: "DANA", label: "DANA", type: "number", placeholder: "0812xxxx" },
      { id: "OVO", label: "OVO", type: "number", placeholder: "0812xxxx" },
      { id: "GoPay", label: "GoPay", type: "number", placeholder: "0812xxxx" },
      {
        id: "PayPal",
        label: "PayPal",
        type: "email",
        placeholder: "name@email.com",
      },
    ],
  },
  bank: {
    label: "Bank Transfer",
    icon: Landmark,
    methods: [
      {
        id: "BCA",
        label: "Bank BCA",
        type: "number",
        placeholder: "1234567890",
      },
      {
        id: "BRI",
        label: "Bank BRI",
        type: "number",
        placeholder: "1234567890",
      },
      {
        id: "Mandiri",
        label: "Bank Mandiri",
        type: "number",
        placeholder: "1234567890",
      },
    ],
  },
  crypto: {
    label: "Crypto",
    icon: Bitcoin,
    methods: [
      {
        id: "USDT",
        label: "USDT (TRC20)",
        type: "text",
        placeholder: "Txr...",
      },
      { id: "BTC", label: "Bitcoin", type: "text", placeholder: "1A1z..." },
    ],
  },
};

type CategoryKey = keyof typeof PAYMENT_CONFIG;

export default function PaymentSection({
  initialMethods,
}: {
  initialMethods: SavedPaymentMethod[];
}) {
  // Panggil Hook Sakti
  const { methods, addMethod, removeMethod, setAsDefault, isProcessing } =
    usePaymentLogic(initialMethods);

  // State Form Lokal
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("wallet");
  const [selectedMethodId, setSelectedMethodId] = useState(
    PAYMENT_CONFIG.wallet.methods[0].id
  );
  const [details, setDetails] = useState({
    accountName: "",
    accountNumber: "",
  });

  // State Modal Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCategoryChange = (key: CategoryKey) => {
    setActiveCategory(key);
    setSelectedMethodId(PAYMENT_CONFIG[key].methods[0].id);
    setDetails({ ...details, accountNumber: "" });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addMethod({
      provider: selectedMethodId,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      category: activeCategory,
    });
    // Reset form kalau sukses
    if (success) setDetails({ accountName: "", accountNumber: "" });
  };

  const currentCategoryConfig = PAYMENT_CONFIG[activeCategory];
  const currentMethodConfig = currentCategoryConfig.methods.find(
    (m) => m.id === selectedMethodId
  );

  return (
    <div className="space-y-8 font-figtree">
      {/* 1. LIST METHODS */}
      <div className="space-y-4 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-[2em] font-bold text-shortblack">Saved Methods</h2>

        {methods.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-3xl text-grays">
            <p className="text-[1.4em]">
              Belum ada metode pembayaran yang disimpan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {methods.map((method) => (
                <motion.div
                  key={method.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={clsx(
                    "relative p-6 rounded-3xl border-2 transition-all shadow-sm",
                    method.isDefault
                      ? "border-bluelight bg-blue-50/30"
                      : "border-gray-100 bg-white"
                  )}
                >
                  {/* Badge Default */}
                  {method.isDefault && (
                    <div className="absolute top-0 right-0 bg-bluelight text-white text-[1.1em] px-4 py-1 rounded-bl-2xl rounded-tr-2xl font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Default
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-blues text-bluelight">
                      {method.category === "bank" ? (
                        <Landmark className="w-6 h-6" />
                      ) : method.category === "crypto" ? (
                        <Bitcoin className="w-6 h-6" />
                      ) : (
                        <Smartphone className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[1.6em] font-bold text-shortblack">
                        {method.provider}
                      </h3>
                      <p className="text-[1.4em] text-grays truncate">
                        {method.accountName}
                      </p>
                      <p className="text-[1.3em] font-mono text-shortblack mt-1 break-all">
                        {method.accountNumber}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                    {!method.isDefault && (
                      <button
                        onClick={() => setAsDefault(method.id)}
                        disabled={isProcessing}
                        className="text-[1.3em] font-semibold text-bluelight hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(method.id)}
                      disabled={isProcessing}
                      className="text-[1.3em] font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200 my-8" />

      {/* 2. ADD NEW METHOD FORM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-8 flex items-center gap-3">
          <Plus className="w-6 h-6 text-bluelight" /> Add New Method
        </h2>

        <form onSubmit={handleAddSubmit} className="space-y-8">
          {/* Category Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(PAYMENT_CONFIG) as CategoryKey[]).map((key) => {
              const config = PAYMENT_CONFIG[key];
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className={clsx(
                    "p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all",
                    isActive
                      ? "border-bluelight bg-blue-50 text-bluelight ring-2 ring-bluelight/20"
                      : "border-gray-100 bg-white text-grays hover:bg-slate-50"
                  )}
                >
                  <config.icon
                    className={clsx("w-8 h-8", isActive && "animate-bounce")}
                  />
                  <span className="text-[1.4em] font-bold">{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Fields */}
          <div className="bg-blues rounded-3xl p-8 border border-blue-100 space-y-6">
            {/* Provider Select */}
            <div className="space-y-2">
              <label className="text-[1.4em] font-bold text-shortblack">
                Select Provider
              </label>
              <div className="relative">
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-xl border border-gray-200 bg-white text-[1.6em] font-medium text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer"
                >
                  {currentCategoryConfig.methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-grays pointer-events-none" />
              </div>
            </div>

            <div className="h-px bg-blue-200/50 my-4"></div>

            {/* Account Name */}
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-grays">
                Account Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
                <input
                  type="text"
                  value={details.accountName}
                  onChange={(e) =>
                    setDetails({ ...details, accountName: e.target.value })
                  }
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 text-[1.5em] focus:outline-none focus:ring-2 focus:ring-bluelight/50"
                  placeholder="e.g. Kevin Ragil"
                  required
                />
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-grays">
                Account Number / ID
              </label>
              <input
                type={currentMethodConfig?.type || "text"}
                value={details.accountNumber}
                onChange={(e) =>
                  setDetails({ ...details, accountNumber: e.target.value })
                }
                className="w-full px-6 py-3 rounded-xl border border-gray-200 text-[1.5em] focus:outline-none focus:ring-2 focus:ring-bluelight/50 font-mono"
                placeholder={
                  currentMethodConfig?.placeholder || "Enter number..."
                }
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-bluelight text-white px-10 py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Save className="w-6 h-6" />
              )}
              Save Method
            </button>
          </div>
        </form>
      </motion.div>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await removeMethod(deleteId);
          setDeleteId(null);
        }}
        isLoading={isProcessing}
        title="Hapus Metode?"
        description="Yakin ingin menghapus metode pembayaran ini? Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus"
        type="danger"
      />
    </div>
  );
}
