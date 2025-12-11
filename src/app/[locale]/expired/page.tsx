"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Clock, Home, ArrowLeft } from "lucide-react";

export default function ExpiredPage() {
  // Translate manual strings for now or use useTranslations if keys exist
  // Assuming no specific keys for this yet, using hardcoded with potential for i18n

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/30">
            <Clock className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Link Expired
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Maaf, tautan yang Anda coba akses sudah kedaluwarsa dan tidak lagi
          tersedia.
        </p>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-sm text-gray-400">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi pemilik
            tautan.
          </p>
        </div>
      </div>
    </div>
  );
}
