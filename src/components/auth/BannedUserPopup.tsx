"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ban, LogOut } from "lucide-react";
import authService from "@/services/authService";

interface BannedPopupData {
  message: string;
  reason: string;
}

export default function BannedUserPopup() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [banData, setBanData] = useState<BannedPopupData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleBanned = (event: CustomEvent<BannedPopupData>) => {
      setBanData(event.detail);
      setIsVisible(true);
    };

    // Listen for banned event from API interceptor
    window.addEventListener("user:banned", handleBanned as EventListener);

    return () => {
      window.removeEventListener("user:banned", handleBanned as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails, still redirect
      console.error("Logout error:", error);
    } finally {
      // Redirect to login
      router.push("/en/login");
    }
  };

  if (!isVisible || !banData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop - no close on click, must use button */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-red-100 rounded-full">
            <Ban className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-shortblack mb-2">
          Akun Anda Telah Di-Suspend
        </h2>
        <p className="text-center text-grays mb-6">{banData.message}</p>

        {/* Reason Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-red-800 mb-1">Alasan:</p>
          <p className="text-red-700">{banData.reason}</p>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-grays mb-6">
          Jika Anda merasa ini adalah kesalahan, silakan hubungi tim support
          kami.
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-6 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              OK, Keluar dari Akun
            </>
          )}
        </button>
      </div>
    </div>
  );
}
