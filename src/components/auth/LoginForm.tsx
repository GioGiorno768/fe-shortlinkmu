// Login Form Component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import ErrorAlert from "./ErrorAlert";
import GoogleAuthButton from "./GoogleAuthButton";
import Toast from "@/components/common/Toast";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Show success toast
      setToastMessage("Login berhasil! Mengalihkan...");
      setShowToast(true);

      // Redirect after short delay for toast visibility
      setTimeout(() => {
        const redirectPath = authService.getRedirectPath();
        router.push(redirectPath);
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle different error types
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (err.response?.status === 422) {
        // Laravel validation error
        const errors = err.response?.data?.errors;
        if (errors?.email) {
          // Login failed - wrong credentials
          errorMessage = "Email atau password salah. Silakan coba lagi.";
        } else {
          // Other validation errors
          const firstError = Object.values(errors || {})[0];
          errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : (firstError as string) || "Email atau password salah.";
        }
      } else if (err.response?.status === 403) {
        // Account banned
        errorMessage =
          err.response?.data?.message ||
          "Akun Anda telah dinonaktifkan. Hubungi admin.";
      } else {
        // Other errors
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Terjadi kesalahan saat login. Silakan coba lagi.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setLoading(true);
      setError("");
      await authService.googleLogin(accessToken);

      // Show success toast
      setToastMessage("Login dengan Google berhasil!");
      setShowToast(true);

      // Redirect after short delay
      setTimeout(() => {
        const redirectPath = authService.getRedirectPath();
        router.push(redirectPath);
      }, 800);
    } catch (err: any) {
      console.error("Google login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login dengan Google gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-fit">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-lg text-gray-600">Silakan login untuk melanjutkan</p>
      </div>

      {/* Error Alert */}
      <ErrorAlert error={error} onClose={() => setError("")} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              placeholder="email@anda.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/30"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Atau</span>
        </div>
      </div>

      {/* Google OAuth */}
      <div>
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={(error) => setError(error)}
          text="Masuk dengan Google"
        />
      </div>

      {/* Register link */}
      <p className="text-center text-gray-600">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
