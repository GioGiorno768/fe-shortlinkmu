"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

interface BanConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  userName: string;
  isLoading?: boolean;
}

export default function BanConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}: BanConfirmModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("Alasan ban wajib diisi");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Alasan minimal 10 karakter");
      return;
    }
    setError("");
    await onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-shortblack mb-2">
          Suspend User
        </h2>
        <p className="text-center text-grays mb-6">
          Anda akan men-suspend akun{" "}
          <strong className="text-shortblack">{userName}</strong>. User tidak
          akan bisa login sampai di-unsuspend.
        </p>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-shortblack mb-2">
            Alasan Suspend <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Contoh: Terdeteksi melakukan kecurangan klik..."
            className={clsx(
              "w-full px-4 py-3 rounded-xl border bg-gray-50 text-shortblack placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none transition-all",
              error
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
            )}
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
          <div className="flex justify-between mt-1">
            {error ? (
              <span className="text-sm text-red-500">{error}</span>
            ) : (
              <span className="text-sm text-gray-400">
                Alasan ini akan ditampilkan ke user
              </span>
            )}
            <span className="text-sm text-gray-400">{reason.length}/500</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-grays font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Konfirmasi Suspend"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
