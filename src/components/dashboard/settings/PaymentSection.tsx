"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  Smartphone, // Icon buat E-Wallet
  Landmark, // Icon buat Bank
  Bitcoin, // Icon buat Crypto
  ChevronDown,
  User,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { PaymentMethod } from "@/types/type";
import clsx from "clsx";

// --- 1. KONFIGURASI PROVIDER (GAMPANG DI-MAINTAIN) ---
// Di sini lu atur semua logic label, placeholder, dan opsinya.
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

interface PaymentSectionProps {
  initialData: PaymentMethod | null;
}

export default function PaymentSection({ initialData }: PaymentSectionProps) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  // State Kategori Utama (Wallet / Bank / Crypto)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("wallet");

  // State Sub-Metode (Dana / BCA / USDT)
  // Default ambil dari initialData, atau default ke item pertama dari kategori aktif
  const [selectedMethodId, setSelectedMethodId] = useState("");

  // State Form Values
  const [details, setDetails] = useState({
    accountName: initialData?.accountName || "",
    accountNumber: initialData?.accountNumber || "",
  });

  // --- EFFECT: DETEKSI INITIAL DATA ---
  // Kalau user udah punya data sebelumnya, kita harus tau dia masuk kategori mana
  useEffect(() => {
    if (initialData?.provider) {
      // Cari provider ini ada di kategori mana
      let foundCategory: CategoryKey = "wallet"; // default fallback

      for (const [catKey, config] of Object.entries(PAYMENT_CONFIG)) {
        const found = config.methods.find((m) => m.id === initialData.provider);
        if (found) {
          foundCategory = catKey as CategoryKey;
          break;
        }
      }

      setActiveCategory(foundCategory);
      setSelectedMethodId(initialData.provider);
    } else {
      // Kalau data kosong, set default ke DANA (item pertama wallet)
      setSelectedMethodId(PAYMENT_CONFIG.wallet.methods[0].id);
    }
  }, [initialData]);

  // --- HANDLER GANTI KATEGORI ---
  const handleCategoryChange = (category: CategoryKey) => {
    setActiveCategory(category);
    // Reset sub-metode ke item pertama di kategori baru
    setSelectedMethodId(PAYMENT_CONFIG[category].methods[0].id);
    // Optional: Reset nomor rekening biar ga nyangkut, tapi nama biarin
    setDetails((prev) => ({ ...prev, accountNumber: "" }));
  };

  // Ambil config metode yang lagi dipilih sekarang buat nentuin label/placeholder
  const currentCategoryConfig = PAYMENT_CONFIG[activeCategory];
  const currentMethodConfig =
    currentCategoryConfig.methods.find((m) => m.id === selectedMethodId) ||
    currentCategoryConfig.methods[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Payload yang dikirim ke backend
    const payload = {
      provider: selectedMethodId, // Kirim ID spesifik (misal "DANA", "BCA")
      accountName: details.accountName,
      accountNumber: details.accountNumber,
    };

    console.log("MANGGIL API: PUT /api/user/payment-method", payload);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      showAlert(
        `Metode pembayaran ${selectedMethodId} berhasil disimpan!`,
        "success"
      );
    } catch (err) {
      showAlert("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-[2em] font-bold text-shortblack mb-8">
        Withdrawal Method
      </h2>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* 1. PILIH KATEGORI UTAMA */}
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

        {/* 2. AREA DINAMIS (DROPDOWN & INPUT) */}
        <div className="bg-blues rounded-3xl p-8 border border-blue-100 space-y-6 relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

          {/* --- DROPDOWN SUB-METODE --- */}
          <div className="space-y-2 relative z-10">
            <label className="text-[1.4em] font-bold text-shortblack flex items-center gap-2">
              Select {currentCategoryConfig.label}
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
              {/* Custom Chevron Icon */}
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-grays pointer-events-none" />
            </div>
          </div>

          <div className="h-px bg-blue-200/50 my-4"></div>

          {/* --- INPUT ACCOUNT NAME (SELALU ADA) --- */}
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

          {/* --- INPUT DINAMIS (NOMOR/EMAIL/WALLET) --- */}
          <div className="space-y-2 relative z-10">
            <label className="text-[1.4em] font-medium text-grays">
              {currentMethodConfig.inputLabel}
            </label>
            <motion.div
              key={currentMethodConfig.id} // Biar ada animasi pas ganti metode
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-bluelight text-white px-10 py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-200 hover:-translate-y-1"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
            Save Information
          </button>
        </div>
      </form>
    </motion.div>
  );
}
