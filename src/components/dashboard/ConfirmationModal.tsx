"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Info,
  Trash2,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import clsx from "clsx";

export type ConfirmType = "danger" | "warning" | "info" | "success";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmType;
  isLoading?: boolean;
  showReasonInput?: boolean;
  reasonPlaceholder?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger",
  isLoading = false,
  showReasonInput = false,
  reasonPlaceholder = "Please provide a reason...",
}: ConfirmationModalProps) {
  const [reason, setReason] = useState("");

  // Reset reason when modal opens/closes
  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  // Config Icon & Warna berdasarkan Tipe
  const config = {
    danger: {
      icon: Trash2,
      iconColor: "text-red-500",
      iconBg: "bg-red-50 border-red-100",
      btnColor: "bg-red-500 hover:bg-red-600 shadow-red-200",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50 border-orange-100",
      btnColor: "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
    },
    info: {
      icon: Info,
      iconColor: "text-bluelight",
      iconBg: "bg-blue-50 border-blue-100",
      btnColor: "bg-bluelight hover:bg-blue-700 shadow-blue-200",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50 border-green-100",
      btnColor: "bg-green-600 hover:bg-green-700 shadow-green-200",
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-shortblack/60 backdrop-blur-sm font-figtree h-screen"
          onClick={!isLoading ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[40em] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col items-center text-center p-8"
          >
            {/* Icon Bubble */}
            <div
              className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center border-4 mb-6",
                currentConfig.iconBg
              )}
            >
              <Icon className={clsx("w-10 h-10", currentConfig.iconColor)} />
            </div>

            {/* Text Content */}
            <h3 className="text-[2.2em] font-bold text-shortblack mb-3 leading-tight">
              {title}
            </h3>
            <p className="text-[1.5em] text-grays leading-relaxed mb-8 px-4">
              {description}
            </p>

            {showReasonInput && (
              <div className="w-full px-4 mb-8">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonPlaceholder}
                  className="w-full p-4 text-[1.2em] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-4 rounded-xl text-[1.5em] font-semibold text-shortblack bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => onConfirm(reason)}
                disabled={isLoading || (showReasonInput && !reason.trim())}
                className={clsx(
                  "flex-1 py-4 rounded-xl text-[1.5em] font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50",
                  currentConfig.btnColor
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
