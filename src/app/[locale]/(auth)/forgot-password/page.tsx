"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await authService.forgotPassword(email);
      setStatus("success");
      showAlert("Link reset password telah dikirim ke email Anda!", "success");
    } catch (error: any) {
      setStatus("error");
      const msg = error.response?.data?.message || "Gagal mengirim link reset.";
      showAlert(msg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-bluelight/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-bluelight" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Lupa Password?
          </h1>
          <p className="text-[1.4em] text-gray-500">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan link
            untuk mereset password.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 rounded-xl p-6 text-center space-y-4 animate-fade-in">
            <div className="text-green-600 font-medium text-[1.4em]">
              🎉 Link terkirim! Cek kotak masuk atau spam email Anda.
            </div>
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-gray-800 text-[1.4em]"
                disabled={status === "loading"}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full bg-bluelight hover:bg-bluelight/90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[1.4em] shadow-lg shadow-bluelight/25"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Link Reset"
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
