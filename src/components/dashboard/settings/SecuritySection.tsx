// src/components/dashboard/settings/SecuritySection.tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Shield, Smartphone, Loader2, KeyRound } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { SecuritySettings } from "@/types/type";
import clsx from "clsx";
import { useSecurityLogic } from "@/hooks/useSettings"; // Import Hook

interface SecuritySectionProps {
  initialData: SecuritySettings | null;
}

export default function SecuritySection({ initialData }: SecuritySectionProps) {
  const { showAlert } = useAlert();
  // Panggil Logic dari Hook
  const { updatePass, toggle2FAStatus, isUpdating } = useSecurityLogic();

  const [is2FAEnabled, setIs2FAEnabled] = useState(
    initialData?.twoFactorEnabled || false
  );

  const isSocialLogin = initialData?.isSocialLogin || false;

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana di UI
    if (!isSocialLogin && !passwords.current) {
      showAlert("Harap isi password saat ini!", "warning");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showAlert("Password baru tidak cocok!", "error");
      return;
    }
    if (passwords.new.length < 8) {
      showAlert("Password minimal 8 karakter!", "warning");
      return;
    }

    // Panggil fungsi update dari Hook
    // Note: Backend nanti harus handle logic isSocialLogin (skip cek current pass)
    const success = await updatePass(passwords.current, passwords.new);

    if (success) {
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const toggle2FA = async () => {
    const newState = !is2FAEnabled;
    // Panggil fungsi toggle dari Hook
    await toggle2FAStatus(newState);
    // Update state lokal optimis (atau bisa tunggu response kalo mau strict)
    setIs2FAEnabled(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-[2em] font-bold text-shortblack mb-2 flex items-center gap-3">
          <Lock className="w-6 h-6 text-bluelight" />
          {isSocialLogin ? "Set Password" : "Change Password"}
        </h2>
        <p className="text-[1.4em] text-grays mb-8">
          {isSocialLogin
            ? "Karena Anda login via Google, silakan buat password untuk keamanan tambahan."
            : "Pastikan password Anda kuat dan unik untuk menjaga akun tetap aman."}
        </p>

        <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
          {!isSocialLogin && (
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                Current Password
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePassChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                  placeholder="••••••••"
                  required={!isSocialLogin}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                {isSocialLogin ? "New Password" : "New Password"}
              </label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePassChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePassChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                placeholder="Re-type password"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-bluelight text-white px-8 py-3 rounded-xl font-semibold text-[1.5em] hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSocialLogin ? "Create Password" : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* 2FA Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-bluelight flex-shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-[1.8em] font-bold text-shortblack mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-[1.4em] text-grays max-w-xl">
              Tambahkan lapisan keamanan ekstra ke akun Anda. Kami akan
              mengirimkan kode verifikasi setiap kali Anda login.
            </p>
          </div>
        </div>
        <button
          onClick={toggle2FA}
          className={clsx(
            "px-8 py-3 rounded-xl font-semibold text-[1.5em] transition-all flex items-center gap-3 min-w-[140px] justify-center",
            is2FAEnabled
              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
          )}
        >
          <Smartphone className="w-5 h-5" />
          {is2FAEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    </motion.div>
  );
}
