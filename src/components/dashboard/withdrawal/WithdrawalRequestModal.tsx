"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Smartphone,
  Bitcoin,
  ChevronDown,
  Landmark,
  User,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { PaymentMethod } from "@/types/type";
import clsx from "clsx";

// --- 1. COPY KONFIGURASI DARI SETTINGS ---
// Biar konsisten sama halaman Payment Settings
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

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod: PaymentMethod | null;
  availableBalance: number;
  onSuccess: (amount: number, method: PaymentMethod) => Promise<void>;
}

export default function WithdrawalRequestModal({
  isOpen,
  onClose,
  defaultMethod,
  availableBalance,
  onSuccess,
}: WithdrawalRequestModalProps) {
  const { showAlert } = useAlert();

  // --- STATE UTAMA ---
  const [step, setStep] = useState(1);
  const [useDefault, setUseDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // --- STATE METODE BARU ---
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("wallet");
  const [selectedMethodId, setSelectedMethodId] = useState(
    PAYMENT_CONFIG.wallet.methods[0].id
  );
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  // Reset state pas modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUseDefault(!!defaultMethod);
      setWithdrawAmount("");
      setIsLoading(false);

      // Reset form manual
      setActiveCategory("wallet");
      setSelectedMethodId(PAYMENT_CONFIG.wallet.methods[0].id);
      setNewAccountName("");
      setNewAccountNumber("");
    }
  }, [isOpen, defaultMethod]);

  // Helper Config Aktif
  const currentCategoryConfig = PAYMENT_CONFIG[activeCategory];
  const currentMethodConfig =
    currentCategoryConfig.methods.find((m) => m.id === selectedMethodId) ||
    currentCategoryConfig.methods[0];

  // Handler Ganti Kategori
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as CategoryKey;
    setActiveCategory(newCat);
    // Reset ke metode pertama di kategori baru
    setSelectedMethodId(PAYMENT_CONFIG[newCat].methods[0].id);
    setNewAccountNumber(""); // Reset nomor biar ga salah format
  };

  // --- LOGIC STEP 1 ---
  const handleNextStep = () => {
    if (!useDefault) {
      if (!newAccountName || !newAccountNumber) {
        showAlert("Harap lengkapi detail akun pembayaran.", "warning");
        return;
      }
    }
    setStep(2);
  };

  // --- LOGIC STEP 2 ---
  const handleSubmit = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 2.0) {
      showAlert("Minimal penarikan adalah $2.00", "error");
      return;
    }
    if (amount > availableBalance) {
      showAlert("Saldo tidak mencukupi.", "error");
      return;
    }

    setIsLoading(true);

    const finalMethod: PaymentMethod =
      useDefault && defaultMethod
        ? defaultMethod
        : {
            provider: selectedMethodId,
            accountName: newAccountName,
            accountNumber: newAccountNumber,
          };

    try {
      await onSuccess(amount, finalMethod);
      onClose();
    } catch (err) {
      // Error handled in parent
    } finally {
      setIsLoading(false);
    }
  };

  const setPercentage = (percent: number) => {
    const val = availableBalance * (percent / 100);
    setWithdrawAmount(val.toFixed(2));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-figtree"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-[50em] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div>
                <h2 className="text-[2em] font-bold text-shortblack">
                  Request Payout
                </h2>
                <p className="text-[1.4em] text-grays">
                  Step {step} of 2:{" "}
                  {step === 1 ? "Select Method" : "Confirm Amount"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-grays transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="p-8 overflow-y-auto custom-scrollbar-minimal flex-1"
            >
              {step === 1 ? (
                // === STEP 1 ===
                <div className="space-y-6">
                  {/* Option 1: Default Method */}
                  {defaultMethod && (
                    <label
                      className={clsx(
                        "block p-6 rounded-2xl border-2 cursor-pointer transition-all relative",
                        useDefault
                          ? "border-bluelight bg-blue-50/50"
                          : "border-gray-200 hover:border-blue-200"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="method"
                          checked={useDefault}
                          onChange={() => setUseDefault(true)}
                          className="w-6 h-6 text-bluelight border-gray-300 focus:ring-bluelight"
                        />
                        <div className="flex-1">
                          <p className="text-[1.6em] font-bold text-shortblack flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-bluelight" />
                            Use Saved Method
                          </p>
                          <p className="text-[1.4em] text-grays mt-1">
                            {defaultMethod.provider} •{" "}
                            {defaultMethod.accountNumber}
                          </p>
                        </div>
                      </div>
                    </label>
                  )}

                  {/* Option 2: Different Method */}
                  <label
                    className={clsx(
                      "block p-6 rounded-2xl border-2 cursor-pointer transition-all",
                      !useDefault
                        ? "border-bluelight bg-white shadow-md"
                        : "border-gray-200 hover:border-blue-200"
                    )}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="radio"
                        name="method"
                        checked={!useDefault}
                        onChange={() => setUseDefault(false)}
                        className="w-6 h-6 text-bluelight border-gray-300 focus:ring-bluelight"
                      />
                      <span className="text-[1.6em] font-bold text-shortblack">
                        Use Different Method
                      </span>
                    </div>

                    {/* Form Dinamis (Muncul kalau pilih Different Method) */}
                    <AnimatePresence>
                      {!useDefault && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className=" space-y-4 pt-2"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dropdown 1: Category */}
                            <div className="space-y-2">
                              <label className="text-[1.2em] font-medium text-grays">
                                Method Type
                              </label>
                              <div className="relative">
                                <select
                                  value={activeCategory}
                                  onChange={handleCategoryChange}
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blues text-[1.4em] text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer"
                                >
                                  {Object.entries(PAYMENT_CONFIG).map(
                                    ([key, config]) => (
                                      <option key={key} value={key}>
                                        {config.label}
                                      </option>
                                    )
                                  )}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grays pointer-events-none" />
                              </div>
                            </div>

                            {/* Dropdown 2: Provider (Depends on Category) */}
                            <div className="space-y-2">
                              <label className="text-[1.2em] font-medium text-grays">
                                Provider
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedMethodId}
                                  onChange={(e) =>
                                    setSelectedMethodId(e.target.value)
                                  }
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blues text-[1.4em] text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer"
                                >
                                  {currentCategoryConfig.methods.map((m) => (
                                    <option key={m.id} value={m.id}>
                                      {m.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grays pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Input Account Name */}
                          <div className="space-y-2">
                            <label className="text-[1.2em] font-medium text-grays">
                              Account Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grays" />
                              <input
                                type="text"
                                value={newAccountName}
                                onChange={(e) =>
                                  setNewAccountName(e.target.value)
                                }
                                placeholder="e.g. Kevin Ragil"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-blues text-[1.4em] focus:outline-none focus:ring-2 focus:ring-bluelight/50"
                              />
                            </div>
                          </div>

                          {/* Input Account Number (Dynamic Label & Placeholder) */}
                          <div className="space-y-2">
                            <label className="text-[1.2em] font-medium text-grays">
                              {currentMethodConfig.inputLabel}
                            </label>
                            <input
                              type={currentMethodConfig.inputType}
                              value={newAccountNumber}
                              onChange={(e) =>
                                setNewAccountNumber(e.target.value)
                              }
                              placeholder={currentMethodConfig.placeholder}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blues text-[1.4em] focus:outline-none focus:ring-2 focus:ring-bluelight/50 font-mono"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                </div>
              ) : (
                // === STEP 2 === (Sama kayak sebelumnya)
                <div className="space-y-8">
                  {/* Info Saldo */}
                  <div className="bg-blues p-6 rounded-2xl flex items-center justify-between border border-blue-100">
                    <div>
                      <p className="text-[1.4em] text-grays mb-1">
                        Available Balance
                      </p>
                      <p className="text-[2.4em] font-bold text-bluelight">
                        ${availableBalance.toFixed(4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[1.4em] text-grays mb-1">
                        Destination
                      </p>
                      <p className="text-[1.6em] font-semibold text-shortblack truncate max-w-[200px]">
                        {useDefault && defaultMethod
                          ? defaultMethod.provider
                          : selectedMethodId}
                      </p>
                      <p className="text-[1.2em] text-grays truncate max-w-[200px]">
                        {useDefault && defaultMethod
                          ? defaultMethod.accountNumber
                          : newAccountNumber}
                      </p>
                    </div>
                  </div>

                  {/* Input Amount */}
                  <div>
                    <label className="block text-[1.6em] font-bold text-shortblack mb-3">
                      Withdrawal Amount ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[2em] font-bold text-grays">
                        $
                      </span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 text-[2.5em] font-bold text-shortblack focus:outline-none focus:border-bluelight transition-colors placeholder:text-gray-300"
                        min={2}
                        max={availableBalance}
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setWithdrawAmount("2.00")}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-grays hover:bg-gray-200 text-[1.2em] font-medium transition-colors"
                      >
                        Min ($2)
                      </button>
                      <button
                        onClick={() => setPercentage(50)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-grays hover:bg-gray-200 text-[1.2em] font-medium transition-colors"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setPercentage(100)}
                        className="px-4 py-2 rounded-lg bg-blue-100 text-bluelight hover:bg-blue-200 text-[1.2em] font-medium transition-colors"
                      >
                        Max (${availableBalance.toFixed(2)})
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-4 bg-orange-50 rounded-xl text-orange-700 border border-orange-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-[1.2em] leading-snug">
                      Pastikan data akun sudah benar. Penarikan akan diproses
                      dalam 24-48 jam kerja. Kesalahan input dapat menyebabkan
                      dana hangus.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl text-[1.6em] font-medium text-grays hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleNextStep}
                  className="bg-bluelight text-white px-8 py-3 rounded-xl text-[1.6em] font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-greenlight text-white px-8 py-3 rounded-xl text-[1.6em] font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Confirm Withdrawal
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
