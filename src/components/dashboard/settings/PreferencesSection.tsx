// src/components/dashboard/settings/PreferencesSection.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe,
  Coins,
  Clock,
  Save,
  Loader2,
  ChevronDown,
  // 👇 Icon baru buat privacy
  ShieldAlert,
  Cookie,
  KeyRound,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import clsx from "clsx";
// 👇 Import tipe baru
import type { UserPreferences, PrivacySettings } from "@/types/type";

interface PreferencesSectionProps {
  initialData: UserPreferences | null;
}

export default function PreferencesSection({
  initialData,
}: PreferencesSectionProps) {
  const { showAlert } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // State Form (Update struktur sesuai PrivacySettings)
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: currentLocale as "en" | "id",
    currency: initialData?.currency || "USD",
    timezone: initialData?.timezone || "Asia/Jakarta",
    // 👇 Default value baru
    privacy: initialData?.privacy || {
      loginAlert: true,
      cookieConsent: true,
      saveLoginInfo: false,
    },
  });

  useEffect(() => {
    setPreferences((prev) => ({
      ...prev,
      language: currentLocale as "en" | "id",
    }));
  }, [currentLocale]);

  const handleLanguageChange = (lang: "en" | "id") => {
    setPreferences({ ...preferences, language: lang });
    startTransition(() => {
      const currentParams = searchParams.toString();
      const targetPath = currentParams
        ? `${pathname}?${currentParams}`
        : pathname;
      router.replace(targetPath, { locale: lang });
    });
    showAlert(
      `Bahasa diganti ke ${lang === "id" ? "Indonesia" : "English"}`,
      "success"
    );
  };

  // 👇 Handler baru buat Privacy Toggle
  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // [SETUP API] PUT /api/user/preferences
    console.log("MANGGIL API: PUT /api/user/preferences", preferences);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      showAlert("Pengaturan berhasil disimpan!", "success");
    } catch (err) {
      showAlert("Gagal menyimpan pengaturan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-figtree">
      {/* SECTION 1: GENERAL (Sama kayak sebelumnya) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-8 flex items-center gap-3">
          <Globe className="w-6 h-6 text-bluelight" />
          General Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Language Picker */}
          <div className="space-y-3">
            <label className="text-[1.4em] font-medium text-grays">
              Display Language
            </label>
            <div className="flex gap-4">
              {["en", "id"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as "en" | "id")}
                  disabled={isPending}
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-xl border-2 text-[1.4em] font-semibold transition-all",
                    currentLocale === lang
                      ? "border-bluelight bg-blue-50 text-bluelight"
                      : "border-gray-200 text-grays hover:border-blue-200"
                  )}
                >
                  {lang === "en" ? "🇬🇧 English" : "🇮🇩 Indonesia"}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Picker */}
          <div className="space-y-3">
            <label className="text-[1.4em] font-medium text-grays">
              Display Currency
            </label>
            <div className="relative">
              <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <select
                value={preferences.currency}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    currency: e.target.value as any,
                  })
                }
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-[1.5em] text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer"
              >
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="IDR">🇮🇩 IDR - Indonesian Rupiah</option>
                <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
                <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays pointer-events-none" />
            </div>
            <p className="text-[1.2em] text-grays italic">
              *Kurs dikonversi otomatis berdasarkan rate harian.
            </p>
          </div>

          {/* Timezone Picker */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[1.4em] font-medium text-grays">
              Timezone
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <select
                value={preferences.timezone}
                onChange={(e) =>
                  setPreferences({ ...preferences, timezone: e.target.value })
                }
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-[1.5em] text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer"
              >
                <option value="UTC">UTC (Universal Time)</option>
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* === SECTION 2: PRIVACY & SESSION (UPDATE BARU) === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-8 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-bluelight" />
          Privacy & Session
        </h2>

        <div className="space-y-4">
          {/* LIST TOGGLE BARU */}
          {[
            {
              key: "loginAlert",
              title: "Login Alert",
              desc: "Terima email notifikasi jika ada login dari perangkat baru.",
              icon: ShieldAlert,
            },
            {
              key: "cookieConsent",
              title: "Cookie Settings",
              desc: "Izinkan penyimpanan cookie untuk pengalaman login yang lebih cepat.",
              icon: Cookie,
            },
            {
              key: "saveLoginInfo",
              title: "Save Login Info",
              desc: "Ingat sesi login saya di perangkat ini (Auto-login).",
              icon: KeyRound,
            },
          ].map((item) => {
            const isActive =
              preferences.privacy[item.key as keyof PrivacySettings];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive
                        ? "bg-blue-100 text-bluelight"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[1.5em] font-bold text-shortblack">
                      {item.title}
                    </h3>
                    <p className="text-[1.3em] text-grays max-w-md leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handlePrivacyToggle(item.key as keyof PrivacySettings)
                  }
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
                    isActive ? "bg-bluelight" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${
                      isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-bluelight text-white px-10 py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-200 hover:-translate-y-1"
        >
          {isSaving ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Save className="w-6 h-6" />
          )}
          Save Preferences
        </button>
      </div>
    </div>
  );
}
