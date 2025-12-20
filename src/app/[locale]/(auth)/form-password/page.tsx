"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/authService";
import { Loader2, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);

    if (!tokenParam || !emailParam) {
      showAlert("Token atau email tidak valid.", "error");
    }
  }, [searchParams, showAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      showAlert("Password tidak sama!", "error");
      return;
    }

    if (password.length < 8) {
      showAlert("Password minimal 8 karakter.", "error");
      return;
    }

    setStatus("loading");
    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setStatus("success");
      showAlert("Password berhasil direset! Silakan login.", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      const msg = error.response?.data?.message || "Gagal mereset password.";
      showAlert(msg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-bluelight/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-bluelight" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-[1.4em] text-gray-500">
            Masukkan password baru Anda yang aman.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 rounded-xl p-6 text-center space-y-4 animate-fade-in">
            <div className="text-green-600 font-medium text-[1.4em]">
              🎉 Password berhasil diubah! Mengalihkan ke halaman login...
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-gray-800 text-[1.4em]"
                  placeholder="Min. 8 karakter"
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-gray-800 text-[1.4em]"
                  placeholder="Ulangi password"
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !password || !confirmPassword}
              className="w-full bg-bluelight hover:bg-bluelight/90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[1.4em] shadow-lg shadow-bluelight/25"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center pt-4">
          <Link
            href="/login"
            className="inline-flex items-center text-[1.3em] font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
