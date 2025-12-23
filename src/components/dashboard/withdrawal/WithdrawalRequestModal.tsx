// src/components/dashboard/withdrawal/WithdrawalRequestModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  Bitcoin,
  ChevronDown,
  Landmark,
  User,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { PaymentMethod } from "@/types/type";
import clsx from "clsx";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertFromUSD, getExchangeRates } from "@/utils/currency";

// --- KONFIGURASI PAYMENT (Tetap di sini sesuai request lu) ---
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

import type { SavedPaymentMethod } from "@/types/type";

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod: PaymentMethod | null;
  allMethods: SavedPaymentMethod[];
  availableBalance: number;
  onSuccess: (amount: number, method: PaymentMethod) => Promise<void>;
}

export default function WithdrawalRequestModal({
  isOpen,
  onClose,
  defaultMethod,
  allMethods,
  availableBalance,
  onSuccess,
}: WithdrawalRequestModalProps) {
  const { showAlert } = useAlert();
  // 💱 Use global currency context
  const { format: formatCurrency, symbol, currency } = useCurrency();

  // --- CURRENCY CONVERSION HELPERS ---
  // Convert USD to local currency
  const toLocalCurrency = (amountUSD: number): number => {
    return convertFromUSD(amountUSD, currency);
  };

  // Convert local currency back to USD
  const toUSD = (amountLocal: number): number => {
    const rates = getExchangeRates();
    return amountLocal / rates[currency];
  };

  // 🔄 Round minimum withdrawal up to a clean number per currency
  const roundMinimumUp = (amount: number): number => {
    switch (currency) {
      case "IDR":
        // Round up to nearest 1000 (e.g., 33478 → 34000)
        return Math.ceil(amount / 1000) * 1000;
      case "MYR":
      case "SGD":
        // Round up to nearest 1 (e.g., 8.15 → 9)
        return Math.ceil(amount);
      case "EUR":
      case "GBP":
        // Round up to nearest 0.5 (e.g., 1.84 → 2)
        return Math.ceil(amount * 2) / 2;
      default:
        // USD: Keep as is (already $2)
        return amount;
    }
  };

  // Get minimum withdrawal in local currency (rounded up for clean display)
  const minWithdrawalLocal = roundMinimumUp(toLocalCurrency(2));
  const maxWithdrawalLocal = toLocalCurrency(Number(availableBalance) || 0);

  // --- STATE UTAMA ---
  const [step, setStep] = useState(1);
  const [useDefault, setUseDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>(""); // In local currency

  // --- STATE FOR "Use Different Method" ---
  // Store the ID of selected non-default method
  const [selectedOtherMethodId, setSelectedOtherMethodId] = useState<
    string | null
  >(null);

  // Get list of other methods (exclude default)
  const otherMethods = allMethods.filter((m) => !m.isDefault);

  // Get selected other method object
  const selectedOtherMethod =
    otherMethods.find((m) => m.id === selectedOtherMethodId) || null;

  // Reset state pas modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUseDefault(!!defaultMethod);
      setWithdrawAmount("");
      setIsLoading(false);
      // Set first other method as default selection
      setSelectedOtherMethodId(
        otherMethods.length > 0 ? otherMethods[0].id : null
      );
    }
  }, [isOpen, defaultMethod]);

  // --- LOGIC STEP 1: VALIDASI METODE ---
  const handleNextStep = () => {
    if (!useDefault) {
      if (!selectedOtherMethod) {
        showAlert("Pilih metode pembayaran yang valid.", "warning");
        return;
      }
    } else if (!defaultMethod) {
      showAlert("Metode pembayaran default belum diatur.", "error");
      return;
    }
    setStep(2);
  };

  // --- LOGIC STEP 2: SUBMIT ---
  const handleSubmit = async () => {
    const amountLocal = parseFloat(withdrawAmount);

    // Validate minimum in local currency
    if (isNaN(amountLocal) || amountLocal < minWithdrawalLocal) {
      showAlert(`Minimal penarikan adalah ${formatCurrency(2)}`, "error");
      return;
    }

    // Validate max in local currency
    if (amountLocal > maxWithdrawalLocal) {
      showAlert("Saldo tidak mencukupi.", "error");
      return;
    }

    setIsLoading(true);

    // Convert back to USD for backend
    const amountUSD = toUSD(amountLocal);

    // Tentukan metode mana yang dipake (Default atau Selected Other)
    const finalMethod: PaymentMethod =
      useDefault && defaultMethod
        ? defaultMethod
        : {
            id: selectedOtherMethod?.id || "",
            provider: selectedOtherMethod?.provider || "",
            accountName: selectedOtherMethod?.accountName || "",
            accountNumber: selectedOtherMethod?.accountNumber || "",
          };

    try {
      await onSuccess(amountUSD, finalMethod); // Send USD to backend
      onClose(); // Tutup modal kalo sukses
    } catch (err) {
      // Error udah dihandle di parent (hook)
    } finally {
      setIsLoading(false);
    }
  };

  // Set amount in local currency
  const setPercentage = (percent: number) => {
    const valLocal = maxWithdrawalLocal * (percent / 100);
    // Format based on currency (no decimals for IDR)
    const formatted =
      currency === "IDR"
        ? Math.round(valLocal).toString()
        : valLocal.toFixed(2);
    setWithdrawAmount(formatted);
  };

  const setMinAmount = () => {
    const formatted =
      currency === "IDR"
        ? Math.round(minWithdrawalLocal).toString()
        : minWithdrawalLocal.toFixed(2);
    setWithdrawAmount(formatted);
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

            {/* Content Body */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="p-8 overflow-y-auto custom-scrollbar-minimal flex-1"
            >
              {step === 1 ? (
                // === STEP 1: PILIH METODE ===
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

                    {/* Saved Methods List (Muncul kalau pilih Different Method) */}
                    <AnimatePresence>
                      {!useDefault && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 pt-2"
                        >
                          {otherMethods.length > 0 ? (
                            otherMethods.map((method) => (
                              <div
                                key={method.id}
                                onClick={() =>
                                  setSelectedOtherMethodId(method.id)
                                }
                                className={clsx(
                                  "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3",
                                  selectedOtherMethodId === method.id
                                    ? "border-bluelight bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                <div
                                  className={clsx(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                    selectedOtherMethodId === method.id
                                      ? "border-bluelight"
                                      : "border-gray-300"
                                  )}
                                >
                                  {selectedOtherMethodId === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-bluelight" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-[1.4em] font-semibold text-shortblack">
                                    {method.provider}
                                  </p>
                                  <p className="text-[1.2em] text-grays">
                                    {method.accountName} •{" "}
                                    {method.accountNumber}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-grays">
                              <p className="text-[1.4em]">
                                Tidak ada metode pembayaran lain tersimpan.
                              </p>
                              <p className="text-[1.2em] mt-1">
                                Tambahkan di{" "}
                                <a
                                  href="/settings"
                                  className="text-bluelight underline"
                                >
                                  Settings
                                </a>
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                </div>
              ) : (
                // === STEP 2: INPUT AMOUNT ===
                (() => {
                  // Get fee from selected payment method (fee is in USD from backend)
                  const selectedMethod =
                    useDefault && defaultMethod
                      ? defaultMethod
                      : selectedOtherMethod;
                  const feeUSD = selectedMethod?.fee || 0;
                  // Convert fee from USD to user's local currency
                  const feeLocal = toLocalCurrency(feeUSD);

                  const amountLocal = parseFloat(withdrawAmount) || 0;
                  const totalAmount = amountLocal + feeLocal;

                  return (
                    <div className="space-y-6">
                      {/* Info Saldo & Tujuan */}
                      <div className="bg-blues p-5 rounded-2xl flex items-center justify-between border border-blue-100">
                        <div>
                          <p className="text-[1.2em] text-grays mb-0.5 uppercase tracking-wide font-medium">
                            Available Balance
                          </p>
                          <p className="text-[2em] font-bold text-bluelight">
                            {formatCurrency(Number(availableBalance) || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[1.2em] text-grays mb-0.5 uppercase tracking-wide font-medium">
                            Destination
                          </p>
                          <p className="text-[1.4em] font-semibold text-shortblack truncate max-w-[200px]">
                            {useDefault && defaultMethod
                              ? defaultMethod.provider
                              : selectedOtherMethod?.provider}
                          </p>
                          <p className="text-[1.1em] text-grays truncate max-w-[200px]">
                            {useDefault && defaultMethod
                              ? defaultMethod.accountNumber
                              : selectedOtherMethod?.accountNumber}
                          </p>
                        </div>
                      </div>

                      {/* Input Amount */}
                      <div>
                        <label className="block text-[1.4em] font-bold text-shortblack mb-2">
                          Withdrawal Amount ({symbol})
                        </label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[1.8em] font-bold text-grays">
                            {symbol}
                          </span>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-14 pr-5 py-3.5 rounded-2xl border-2 border-gray-200 text-[2em] font-bold text-shortblack focus:outline-none focus:border-bluelight transition-colors placeholder:text-gray-300"
                            min={2}
                            max={availableBalance}
                          />
                        </div>
                        {/* Tombol Cepat % */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={setMinAmount}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-grays hover:bg-gray-200 text-[1.1em] font-medium transition-colors"
                          >
                            Min ({symbol}
                            {currency === "IDR"
                              ? minWithdrawalLocal.toLocaleString("id-ID")
                              : minWithdrawalLocal.toLocaleString()}
                            )
                          </button>
                          <button
                            onClick={() => setPercentage(50)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-grays hover:bg-gray-200 text-[1.1em] font-medium transition-colors"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => setPercentage(100)}
                            className="px-3 py-1.5 rounded-lg bg-blue-100 text-bluelight hover:bg-blue-200 text-[1.1em] font-medium transition-colors"
                          >
                            Max ({formatCurrency(Number(availableBalance) || 0)}
                            )
                          </button>
                        </div>
                      </div>

                      {/* Fee & Total Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[1.3em] text-grays">
                            Fee Amount
                          </span>
                          <span className="text-[1.3em] text-grays">
                            {symbol}{" "}
                            {currency === "IDR"
                              ? Math.round(feeLocal).toLocaleString("id-ID")
                              : feeLocal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[1.4em] font-semibold text-shortblack">
                            Total Amount
                          </span>
                          <span className="text-[1.6em] font-bold text-shortblack">
                            {symbol}{" "}
                            {currency === "IDR"
                              ? Math.round(totalAmount).toLocaleString("id-ID")
                              : totalAmount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-start p-3 bg-orange-50 rounded-xl text-orange-700 border border-orange-100">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-[1.1em] leading-snug">
                          Pastikan data akun sudah benar. Penarikan akan
                          diproses dalam 24-48 jam kerja. Kesalahan input dapat
                          menyebabkan dana hangus.
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer Buttons */}
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
