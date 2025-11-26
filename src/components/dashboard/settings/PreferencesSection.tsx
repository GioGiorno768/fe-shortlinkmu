// src/components/dashboard/settings/PreferencesSection.tsx
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Coins,
  Clock,
  Save,
  Loader2,
  ChevronDown,
  ShieldAlert,
  Cookie,
  KeyRound,
  Check, // Icon Check buat indikator selected
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import clsx from "clsx";
import Image from "next/image"; // Pake Image buat bendera
import type { UserPreferences, PrivacySettings } from "@/types/type";

// --- DATA STATIS (Config Bendera & Label) ---
const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar", countryCode: "us" },
  { code: "IDR", label: "Indonesian Rupiah", countryCode: "id" },
  { code: "MYR", label: "Malaysian Ringgit", countryCode: "my" },
  { code: "SGD", label: "Singapore Dollar", countryCode: "sg" },
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", countryCode: "us" }, // Pake US/GB terserah lu
  { code: "id", label: "Indonesia", countryCode: "id" },
];

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

  // State buat Custom Dropdown Currency
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  // State Form
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: currentLocale as "en" | "id",
    currency: initialData?.currency || "USD",
    timezone: initialData?.timezone || "Asia/Jakarta",
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

  // Close dropdown currency pas klik luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: !prev.privacy[key] },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
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

  // Helper buat nyari object currency yang aktif
  const activeCurrency =
    CURRENCY_OPTIONS.find((c) => c.code === preferences.currency) ||
    CURRENCY_OPTIONS[0];

  return (
    <div className="space-y-8 font-figtree">
      {/* === GENERAL PREFERENCES === */}
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
          {/* 1. Language Picker (Button Group) */}
          <div className="space-y-3">
            <label className="text-[1.4em] font-medium text-grays">
              Display Language
            </label>
            <div className="flex gap-4">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as "en" | "id")}
                  disabled={isPending}
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 relative overflow-hidden",
                    preferences.language === lang.code
                      ? "border-bluelight bg-blue-50 text-bluelight"
                      : "border-gray-200 text-grays hover:border-blue-200 hover:bg-slate-50"
                  )}
                >
                  {/* Bendera */}
                  <div className="relative w-8 h-6 shadow-sm rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image
                      src={`https://flagcdn.com/${lang.countryCode}.svg`}
                      alt={lang.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[1.4em] font-bold">{lang.label}</span>

                  {/* Indikator Selected */}
                  {preferences.language === lang.code && (
                    <div className="absolute top-0 right-0 p-[2px] bg-bluelight rounded-bl-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Currency Picker (Custom Dropdown) */}
          <div className="space-y-3" ref={currencyRef}>
            <label className="text-[1.4em] font-medium text-grays">
              Display Currency
            </label>
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-shortblack flex items-center gap-3 hover:border-bluelight transition-all focus:ring-2 focus:ring-bluelight/50"
              >
                <div className="relative w-8 h-6 shadow-sm rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
                    src={`https://flagcdn.com/${activeCurrency.countryCode}.svg`}
                    alt={activeCurrency.code}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[1.5em] font-medium">
                  {activeCurrency.code} - {activeCurrency.label}
                </span>
                <ChevronDown
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays transition-transform ${
                    isCurrencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown List */}
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden p-1.5"
                  >
                    {CURRENCY_OPTIONS.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setPreferences({
                            ...preferences,
                            currency: curr.code as any,
                          });
                          setIsCurrencyOpen(false);
                        }}
                        className={clsx(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          preferences.currency === curr.code
                            ? "bg-blue-50 text-bluelight"
                            : "text-shortblack hover:bg-gray-50"
                        )}
                      >
                        <div className="relative w-8 h-6 shadow-sm rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image
                            src={`https://flagcdn.com/${curr.countryCode}.svg`}
                            alt={curr.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[1.3em] font-bold leading-none">
                            {curr.code}
                          </span>
                          <span className="text-[1.1em] opacity-70 leading-none mt-0.5">
                            {curr.label}
                          </span>
                        </div>
                        {preferences.currency === curr.code && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-[1.2em] text-grays italic mt-1">
              *Kurs dikonversi otomatis berdasarkan rate harian.
            </p>
          </div>

          {/* Timezone Picker (Tetap Native Select - Karena listnya panjang bgt) */}
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
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-[1.5em] text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 appearance-none cursor-pointer hover:border-bluelight transition-colors"
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

      {/* === PRIVACY & SESSION (Gak berubah) === */}
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
