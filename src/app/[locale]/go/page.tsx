"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert";

export default function GuestGoPage() {
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();

  const code = searchParams.get("code");
  const token = searchParams.get("token");

  const [timeLeft, setTimeLeft] = useState(3);
  const [status, setStatus] = useState<"counting" | "redirecting" | "error">(
    "counting"
  );

  useEffect(() => {
    // Timer Count Down
    if (timeLeft > 0 && status === "counting") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    // Timer Finished -> Trigger Redirect
    if (timeLeft === 0 && status === "counting") {
      handleAutoRedirect();
    }
  }, [timeLeft, status]);

  const handleAutoRedirect = async () => {
    if (!code || !token) {
      setStatus("error");
      return;
    }

    setStatus("redirecting");

    try {
      // Reuse the same validation logic
      const originalUrl = await linkService.validateContinueToken(code, token);

      // Hard Redirect
      window.location.href = originalUrl;
    } catch (error: any) {
      console.error(error);
      showAlert("Gagal mengalihkan. Link mungkin kadaluarsa.", "error");
      setStatus("error");
    }
  };

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Link Error</h1>
          <p className="mt-2 text-gray-600">
            Terjadi kesalahan saat memproses link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-4 text-[#404040]">
      <div className="w-full max-w-md rounded-lg border border-[#e5e5e5] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <div className="mb-6 flex items-center gap-4">
          {status === "counting" ? (
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {status === "counting"
                ? "Checking your connection..."
                : "Secure Connection Verified"}
            </h1>
            <p className="text-sm text-gray-500">Shortlinkmu Security System</p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-md bg-gray-50 p-4 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Ray ID:</span>
            <span className="font-mono">
              {code}-{token?.substring(0, 8)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span
              className={
                status === "counting" ? "text-amber-600" : "text-green-600"
              }
            >
              {status === "counting" ? "Verifying..." : "Verified"}
            </span>
          </div>
        </div>

        {status === "counting" && (
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
              style={{ width: `${((3 - timeLeft) / 3) * 100}%` }}
            ></div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          {status === "redirecting"
            ? "Redirecting to destination..."
            : "Please wait while we verify your browser..."}
        </p>
      </div>
    </div>
  );
}
