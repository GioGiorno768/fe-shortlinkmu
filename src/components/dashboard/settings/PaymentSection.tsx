"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Building2, Save, Loader2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { PaymentMethod } from "@/types/type";

interface PaymentSectionProps {
  initialData: PaymentMethod | null;
}

export default function PaymentSection({ initialData }: PaymentSectionProps) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState(initialData?.provider || "PayPal");

  const [details, setDetails] = useState({
    accountName: initialData?.accountName || "",
    accountNumber: initialData?.accountNumber || "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // === API CALL SAVE PAYMENT METHOD ===
    const payload = { provider: method, ...details };
    console.log("MANGGIL API: PUT /api/user/payment-method", payload);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      showAlert("Metode pembayaran disimpan!", "success");
    } catch (err) {
      showAlert("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const providers = [
    { id: "PayPal", icon: Wallet, label: "PayPal" },
    { id: "Bank Transfer", icon: Building2, label: "Bank Transfer" },
    { id: "Crypto", icon: CreditCard, label: "Crypto (USDT)" },
  ];

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
        {/* Selector Provider */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setMethod(p.id)}
              className={`
                        p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all
                        ${
                          method === p.id
                            ? "border-bluelight bg-blue-50 text-bluelight"
                            : "border-gray-100 bg-white text-grays hover:border-blue-200"
                        }
                    `}
            >
              <p.icon className="w-8 h-8" />
              <span className="text-[1.4em] font-bold">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Input Fields Dynamic */}
        <div className="space-y-6 p-6 bg-blues rounded-2xl border border-blue-100">
          <div className="space-y-2">
            <label className="text-[1.4em] font-medium text-shortblack">
              Account Name
            </label>
            <input
              type="text"
              value={details.accountName}
              onChange={(e) =>
                setDetails({ ...details, accountName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
              placeholder="e.g. Kevin Ragil"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[1.4em] font-medium text-shortblack">
              {method === "PayPal"
                ? "PayPal Email"
                : method === "Crypto"
                ? "Wallet Address"
                : "Account Number"}
            </label>
            <input
              type="text"
              value={details.accountNumber}
              onChange={(e) =>
                setDetails({ ...details, accountNumber: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
              placeholder={
                method === "PayPal" ? "email@example.com" : "1234567890"
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-bluelight text-white px-10 py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Method
          </button>
        </div>
      </form>
    </motion.div>
  );
}
