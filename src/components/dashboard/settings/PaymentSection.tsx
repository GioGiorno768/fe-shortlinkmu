// src/components/dashboard/settings/PaymentSection.tsx
"use client";

import { useState } from "react"; // Hapus useEffect karena gak perlu fetch awal
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
import { useAlert } from "@/hooks/useAlert";
import clsx from "clsx";
import type { SavedPaymentMethod } from "@/types/type";

// --- KONFIGURASI PROVIDER (TETAP SAMA) ---
const PAYMENT_CONFIG = {
  wallet: {
    label: "Digital Wallet",
    icon: Smartphone,
    methods: [
      {
        id: "DANA",
        label: "DANA",
        inputType: "number",
        inputLabel: "DANA Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "OVO",
        label: "OVO",
        inputType: "number",
        inputLabel: "OVO Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "GoPay",
        label: "GoPay",
        inputType: "number",
        inputLabel: "GoPay Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "ShopeePay",
        label: "ShopeePay",
        inputType: "number",
        inputLabel: "ShopeePay Number",
        placeholder: "0812xxxx",
      },
      {
        id: "PayPal",
        label: "PayPal",
        inputType: "email",
        inputLabel: "PayPal Email Address",
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
        inputType: "number",
        inputLabel: "Rekening BCA",
        placeholder: "1234567890",
      },
      {
        id: "BRI",
        label: "Bank BRI",
        inputType: "number",
        inputLabel: "Rekening BRI",
        placeholder: "1234567890",
      },
      {
        id: "Mandiri",
        label: "Bank Mandiri",
        inputType: "number",
        inputLabel: "Rekening Mandiri",
        placeholder: "1234567890",
      },
      {
        id: "BNI",
        label: "Bank BNI",
        inputType: "number",
        inputLabel: "Rekening BNI",
        placeholder: "1234567890",
      },
      {
        id: "Jago",
        label: "Bank Jago",
        inputType: "number",
        inputLabel: "Rekening Jago",
        placeholder: "1234567890",
      },
    ],
  },
  crypto: {
    label: "Crypto",
    icon: Bitcoin,
    methods: [
      {
        id: "USDT-TRC20",
        label: "USDT (TRC20)",
        inputType: "text",
        inputLabel: "Wallet Address (TRC20)",
        placeholder: "Txr...",
      },
      {
        id: "USDT-ERC20",
        label: "USDT (ERC20)",
        inputType: "text",
        inputLabel: "Wallet Address (ERC20)",
        placeholder: "0x...",
      },
      {
        id: "BTC",
        label: "Bitcoin (BTC)",
        inputType: "text",
        inputLabel: "Bitcoin Wallet Address",
        placeholder: "1A1z...",
      },
      {
        id: "LTC",
        label: "Litecoin (LTC)",
        inputType: "text",
        inputLabel: "Litecoin Wallet Address",
        placeholder: "L...",
      },
    ],
  },
};

type CategoryKey = keyof typeof PAYMENT_CONFIG;

// 👇 UBAH PROPS DISINI
interface PaymentSectionProps {
  initialMethods: SavedPaymentMethod[];
}

export default function PaymentSection({
  initialMethods,
}: PaymentSectionProps) {
  const { showAlert } = useAlert();

  // State Data (Langsung diisi dari props)
  const [savedMethods, setSavedMethods] =
    useState<SavedPaymentMethod[]>(initialMethods);

  // State Loading Action
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("wallet");
  const [selectedMethodId, setSelectedMethodId] = useState(
    PAYMENT_CONFIG.wallet.methods[0].id
  );
  const [details, setDetails] = useState({
    accountName: "",
    accountNumber: "",
  });

  // --- 2. HANDLER TAMBAH METODE BARU ---
  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newMethodPayload = {
      provider: selectedMethodId,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      category: activeCategory,
    };

    // [API Call] POST /api/user/payment-methods
    console.log(
      "MANGGIL API: POST /api/user/payment-methods",
      newMethodPayload
    );

    try {
      await new Promise((r) => setTimeout(r, 1000)); // Simulasi

      const newMethodMock: SavedPaymentMethod = {
        id: `pm-${Date.now()}`,
        ...newMethodPayload,
        isDefault: savedMethods.length === 0,
      } as SavedPaymentMethod;

      setSavedMethods([...savedMethods, newMethodMock]);
      setDetails({ accountName: "", accountNumber: "" });
      showAlert("Metode pembayaran berhasil ditambahkan!", "success");
    } catch (err) {
      showAlert("Gagal menambah metode pembayaran.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. HANDLER SET DEFAULT ---
  const handleSetDefault = async (id: string) => {
    setActionLoadingId(id);

    // [API Call] PATCH /api/user/payment-methods/{id}/set-default
    console.log(
      `MANGGIL API: PATCH /api/user/payment-methods/${id}/set-default`
    );

    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulasi

      setSavedMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === id,
        }))
      );
      showAlert("Metode pembayaran utama diperbarui.", "success");
    } catch (err) {
      showAlert("Gagal mengatur default.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- 4. HANDLER DELETE ---
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus metode pembayaran ini?")) return;

    setActionLoadingId(id);

    // [API Call] DELETE /api/user/payment-methods/{id}
    console.log(`MANGGIL API: DELETE /api/user/payment-methods/${id}`);

    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulasi

      setSavedMethods((prev) => prev.filter((m) => m.id !== id));
      showAlert("Metode pembayaran dihapus.", "info");
    } catch (err) {
      showAlert("Gagal menghapus data.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setActiveCategory(category);
    setSelectedMethodId(PAYMENT_CONFIG[category].methods[0].id);
    setDetails((prev) => ({ ...prev, accountNumber: "" }));
  };

  const currentCategoryConfig = PAYMENT_CONFIG[activeCategory];
  const currentMethodConfig =
    currentCategoryConfig.methods.find((m) => m.id === selectedMethodId) ||
    currentCategoryConfig.methods[0];

  return (
    <div className="space-y-8">
      {/* === LIST KARTU PEMBAYARAN === */}
      <div className="space-y-4">
        <h2 className="text-[2em] font-bold text-shortblack">Saved Methods</h2>

        {/* Gak perlu loading state disini karena data udah dateng dari props */}
        {savedMethods.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-3xl text-grays">
            <p className="text-[1.4em]">
              Belum ada metode pembayaran yang disimpan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {savedMethods.map((method) => (
                <motion.div
                  key={method.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={clsx(
                    "relative p-6 rounded-3xl border-2 transition-all duration-300 shadow-sm",
                    method.isDefault
                      ? "border-bluelight bg-blue-50/30"
                      : "border-gray-100 bg-white hover:border-blue-200"
                  )}
                >
                  {method.isDefault && (
                    <div className="absolute top-0 right-0 bg-bluelight text-white text-[1.1em] px-4 py-1 rounded-bl-2xl rounded-tr-2xl font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Default
                    </div>
                  )}

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

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={actionLoadingId === method.id}
                        className="text-[1.3em] font-semibold text-bluelight hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoadingId === method.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(method.id)}
                      disabled={actionLoadingId === method.id}
                      className="text-[1.3em] font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoadingId === method.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200 my-8" />

      {/* === FORM TAMBAH BARU (TETAP SAMA) === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-8 flex items-center gap-3">
          <Plus className="w-6 h-6 text-bluelight" />
          Add New Method
        </h2>

        <form onSubmit={handleAddMethod} className="space-y-8 max-w-3xl">
          {/* ... (Bagian Form sama persis kayak kode sebelumnya) ... */}
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
                    "p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-200",
                    isActive
                      ? "border-bluelight bg-blue-50 text-bluelight ring-2 ring-bluelight/20 ring-offset-2"
                      : "border-gray-100 bg-white text-grays hover:border-blue-200 hover:bg-slate-50"
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

          <div className="bg-blues rounded-3xl p-8 border border-blue-100 space-y-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <label className="text-[1.4em] font-bold text-shortblack">
                Select Provider
              </label>
              <div className="relative">
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-xl border border-gray-200 bg-white text-[1.6em] font-medium text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer hover:border-bluelight transition-colors"
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

            <div className="space-y-2 relative z-10">
              <label className="text-[1.4em] font-medium text-grays">
                Account Name (Holder)
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
                <input
                  type="text"
                  value={details.accountName}
                  onChange={(e) =>
                    setDetails({ ...details, accountName: e.target.value })
                  }
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em] bg-white/80 focus:bg-white transition-colors"
                  placeholder="e.g. Kevin Ragil"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <label className="text-[1.4em] font-medium text-grays">
                {currentMethodConfig.inputLabel}
              </label>
              <input
                type={currentMethodConfig.inputType}
                value={details.accountNumber}
                onChange={(e) =>
                  setDetails({ ...details, accountNumber: e.target.value })
                }
                className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em] bg-white/80 focus:bg-white transition-colors font-mono"
                placeholder={currentMethodConfig.placeholder}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-bluelight text-white px-10 py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-200 hover:-translate-y-1"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Save className="w-6 h-6" />
              )}
              Save Method
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
