"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Link2, Send, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  type: "reject" | "proof" | "pay" | null;
  onClose: () => void;
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export default function WithdrawalActionModal({
  isOpen,
  type,
  onClose,
  onSubmit,
  isLoading,
}: ModalProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue(""); // Reset
  };

  const config =
    type === "reject"
      ? {
          title: "Reject Withdrawal",
          desc: "Are you sure? Please provide a reason for the user.",
          placeholder: "e.g. Invalid bank account name...",
          icon: AlertTriangle,
          color: "red",
          btnText: "Confirm Reject",
        }
      : {
          title: "Attach Payment Proof",
          desc: "Paste the link to the payment proof (Google Drive/Image URL).",
          placeholder: "https://drive.google.com/file/d/...",
          icon: Link2,
          color: "blue",
          btnText: "Save Proof Link",
        };

  if (type === "pay") {
    Object.assign(config, {
      title: "Complete Payment",
      desc: "Paste the proof link to mark this withdrawal as Paid.",
      btnText: "Pay & Complete",
      color: "green",
      icon: Send,
    });
  }

  return (
    <AnimatePresence>
      {isOpen && type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-shortblack/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 font-figtree"
          >
            <div
              className={clsx(
                "p-6 border-b flex items-center gap-4",
                type === "reject"
                  ? "bg-red-50 border-red-100"
                  : type === "pay"
                  ? "bg-green-50 border-green-100"
                  : "bg-blue-50 border-blue-100"
              )}
            >
              <div
                className={clsx(
                  "p-2 rounded-full",
                  type === "reject"
                    ? "bg-red-100 text-red-600"
                    : type === "pay"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                )}
              >
                <config.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[1.4em] font-bold text-shortblack">
                  {config.title}
                </h3>
                <p className="text-grays text-[1em]">{config.desc}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-grays" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {type === "reject" ? (
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={config.placeholder}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all outline-none min-h-[100px] text-[1.1em]"
                  required
                />
              ) : (
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={config.placeholder}
                  className={clsx(
                    "w-full p-4 rounded-xl border border-gray-200 transition-all outline-none text-[1.1em]",
                    type === "pay"
                      ? "focus:border-green-300 focus:ring-4 focus:ring-green-100"
                      : "focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  )}
                  required
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-grays hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !value.trim()}
                  className={clsx(
                    "px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-gray-200 flex items-center gap-2 transition-all hover:-translate-y-0.5",
                    type === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : type === "pay"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    config.btnText
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
