"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Smartphone, Loader2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { SecuritySettings } from "@/types/type";
import clsx from "clsx";

interface SecuritySectionProps {
  initialData: SecuritySettings | null;
}

export default function SecuritySection({ initialData }: SecuritySectionProps) {
  const { showAlert } = useAlert();
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    initialData?.twoFactorEnabled || false
  );
  const [isSavingPass, setIsSavingPass] = useState(false);

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
    if (passwords.new !== passwords.confirm) {
      showAlert("Password baru tidak cocok!", "error");
      return;
    }
    setIsSavingPass(true);

    // === API CALL CHANGE PASSWORD ===
    console.log("MANGGIL API: PUT /api/user/change-password");

    try {
      await new Promise((r) => setTimeout(r, 1500));
      showAlert("Password berhasil diubah!", "success");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      showAlert("Gagal mengubah password.", "error");
    } finally {
      setIsSavingPass(false);
    }
  };

  const toggle2FA = async () => {
    // === API CALL TOGGLE 2FA ===
    const newState = !is2FAEnabled;
    console.log(`MANGGIL API: PUT /api/user/2fa { enabled: ${newState} }`);

    setIs2FAEnabled(newState);
    showAlert(
      newState
        ? "Two-Factor Authentication diaktifkan."
        : "Two-Factor Authentication dinonaktifkan.",
      newState ? "success" : "warning"
    );
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
          Change Password
        </h2>
        <p className="text-[1.4em] text-grays mb-8">
          Pastikan password Anda kuat dan unik.
        </p>

        <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-[1.4em] font-medium text-shortblack">
              Current Password
            </label>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePassChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                New Password
              </label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePassChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                placeholder="••••••••"
                required
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
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSavingPass}
            className="bg-bluelight text-white px-8 py-3 rounded-xl font-semibold text-[1.5em] hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSavingPass && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
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
