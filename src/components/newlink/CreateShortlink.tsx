// src/components/dashboard/CreateShortlink.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Link as LinkIcon,
  Plus,
  Minus,
  Loader2,
  Lock,
  Type,
  Calendar,
  ChevronDown,
  OctagonAlert,
  Clipboard,
  Check,
  Upload,
  Facebook,
  Twitter,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  AdLevel,
  CreateLinkFormData,
  GeneratedLinkData,
} from "@/types/type";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini pake API call beneran
async function generateShortlinkAPI(
  formData: CreateLinkFormData
): Promise<GeneratedLinkData> {
  console.log("MANGGIL API: /api/links/create", formData);

  /* // --- CONTOH API CALL BENERAN (POST) ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/links/create`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //     body: JSON.stringify(formData),
  //   }
  // );
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   // Asumsi backend ngirim error { message: "Alias already in use" }
  //   throw new Error(errorData.message || "Gagal membuat link");
  // }
  // const data: GeneratedLinkData = await response.json();
  // return data; // Asumsi API ngembaliin { shortUrl: "...", originalUrl: "..." }
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi loading

  // Validasi simpel
  if (!formData.url.startsWith("http")) {
    throw new Error("URL tidak valid. Harus diawali http:// atau https://");
  }
  // Simulasi error alias
  if (formData.alias?.toLowerCase() === "test") {
    throw new Error("Alias ini sudah digunakan.");
  }

  const randomString = Math.random().toString(36).substring(7);
  return {
    shortUrl: `short.link/${formData.alias || randomString}`,
    originalUrl: formData.url,
  };
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

export default function CreateShortlink() {
  const t = useTranslations("Dashboard");

  // --- TAMBAHKAN INI ---
  // Helper buat ngedapetin format YYYY-MM-DDThh:mm (waktu LOKAL)
  // Ini penting biar 'min' nya bener di browser user
  const getMinDateTimeLocal = () => {
    const localDate = new Date();
    // Kita offset manual biar jadi waktu lokal, bukan UTC
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    // Format ke "YYYY-MM-DDThh:mm"
    return localDate.toISOString().slice(0, 16);
  };

  // State Form
  const [formData, setFormData] = useState<CreateLinkFormData>({
    url: "",
    alias: "",
    password: "",
    title: "",
    expiresAt: "",
    adsLevel: "default",
  });

  // State UI
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAdsLevelOpen, setIsAdsLevelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkData | null>(
    null
  );
  const [isShortCopied, setIsShortCopied] = useState(false);
  const [isDestCopied, setIsDestCopied] = useState(false);

  // Ref
  const adsLevelRef = useRef<HTMLDivElement>(null);

  // Opsi Ad Level
  const adLevels: { key: AdLevel; label: string }[] = [
    { key: "default", label: t("adsLevelDefault") },
    { key: "level1", label: t("adsLevel1") },
    { key: "level2", label: t("adsLevel2") },
    { key: "level3", label: t("adsLevel3") },
  ];

  // Efek: Nutup dropdown pas klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        adsLevelRef.current &&
        !adsLevelRef.current.contains(event.target as Node)
      ) {
        setIsAdsLevelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdLevelChange = (level: AdLevel) => {
    setFormData({ ...formData, adsLevel: level });
    setIsAdsLevelOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedLink(null);

    try {
      const data = await generateShortlinkAPI(formData);
      setGeneratedLink(data);
      // Reset input utama, tapi biarin advanced settings
      setFormData({
        ...formData,
        url: "",
        alias: "",
      });
    } catch (err: any) {
      // Set error
      if (err.message.includes("alias")) {
        setError(t("errorAliasInUse"));
      } else if (err.message.includes("valid")) {
        setError(t("errorUrlInvalid"));
      } else {
        setError(t("errorSomethingWentWrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Copy
  const handleCopy = (text: string, type: "short" | "dest") => {
    navigator.clipboard.writeText(text);
    if (type === "short") {
      setIsShortCopied(true);
      setTimeout(() => setIsShortCopied(false), 2000);
    } else {
      setIsDestCopied(true);
      setTimeout(() => setIsDestCopied(false), 2000);
    }
  };

  // Handle Share (Pake yang dari ReferralCard, sedikit modif)
  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: <span className="meteor-icons--whatsapp w-5 h-5 bg-green-500" />,
      url: `https://api.whatsapp.com/send?text=`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5 text-blue-600" fill="currentColor" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=`,
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5 text-blue-500" />,
      url: `https://t.me/share/url?url=`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5 text-black" fill="currentColor" />,
      url: `https://twitter.com/intent/tweet?text=`,
    },
  ];

  const handleSocialShare = (platform: (typeof socialPlatforms)[0]) => {
    if (!generatedLink) return;
    const text = `Lihat link saya: ${generatedLink.shortUrl}`;
    const encodedUrl = encodeURIComponent(generatedLink.shortUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl = "";
    if (platform.name === "WhatsApp" || platform.name === "Twitter") {
      shareUrl = `${platform.url}${encodedText}`;
    } else {
      shareUrl = `${platform.url}${encodedUrl}&text=${encodedText}`;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleGenericShare = async () => {
    if (navigator.share && generatedLink) {
      try {
        await navigator.share({
          title: "Link Saya",
          text: `Lihat link saya: ${generatedLink.shortUrl}`,
          url: generatedLink.shortUrl,
        });
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      alert("Browser ini tidak mendukung fitur share.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================= */}
      {/* === CARD FORM UTAMA === */}
      {/* ======================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50">
        {/* Header Form */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
            {t("createShortlink")}
          </h3>
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-[1.4em] font-medium text-bluelight bg-blue-dashboard px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
          >
            {isAdvancedOpen ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isAdvancedOpen ? t("basicLink") : t("advancedLink")}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
              placeholder={t("pasteUrl")}
              required
            />
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              className="w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
              placeholder={t("setAlias")}
            />
          </div>

          {/* Input Advanced (Animasi) */}
          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                    !isAdvancedOpen && "pt-4"
                  }`}
                >
                  {/* Password */}
                  <div className="relative">
                    <Lock className="w-4 h-4 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full text-[1.6em] px-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
                      placeholder={t("setPassword")}
                    />
                  </div>
                  {/* Title */}
                  <div className="relative">
                    <Type className="w-4 h-4 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full text-[1.6em] px-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
                      placeholder={t("setTitle")}
                    />
                  </div>
                  {/* === UBAH BLOK INI === */}
                  {/* Expired Date */}
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="datetime-local" // <-- 1. GANTI TYPE
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleChange}
                      className="w-full text-[1.6em] px-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
                      min={getMinDateTimeLocal()} // <-- 2. GANTI MIN
                    />
                  </div>
                  {/* === AKHIR PERUBAHAN === */}
                  {/* Ads Level Dropdown */}
                  <div className="relative" ref={adsLevelRef}>
                    <button
                      type="button"
                      onClick={() => setIsAdsLevelOpen(!isAdsLevelOpen)}
                      className="w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-blues
                                 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-bluelight"
                    >
                      <span
                        className={
                          formData.adsLevel === "default"
                            ? "text-grays"
                            : "text-shortblack"
                        }
                      >
                        {adLevels.find((l) => l.key === formData.adsLevel)
                          ?.label || t("adsLevel")}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-grays transition-transform ${
                          isAdsLevelOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isAdsLevelOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full right-0 mt-2 p-2 w-full bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                        >
                          {adLevels.map((level) => (
                            <button
                              key={level.key}
                              type="button"
                              onClick={() => handleAdLevelChange(level.key)}
                              className={`block w-full text-left text-[1.4em] px-3 py-2 rounded-md ${
                                formData.adsLevel === level.key
                                  ? "text-bluelight font-semibold bg-blue-dashboard"
                                  : "text-shortblack hover:bg-blues"
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-dashboard text-bluelight text-[1.6em] font-semibold py-4 rounded-xl 
                       hover:bg-bluelight hover:text-white transition-all duration-300
                       disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LinkIcon className="w-5 h-5" />
            )}
            <span>{isLoading ? t("generating") : t("generateShortlink")}</span>
          </button>

          {/* Tampilan Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-redshortlink text-[1.4em] font-medium flex items-center justify-center gap-2"
              >
                <OctagonAlert className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ======================= */}
      {/* === CARD HASIL LINK === */}
      {/* ======================= */}
      <AnimatePresence>
        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 custom:grid-cols-3 gap-4"
          >
            {/* Card Your Link */}
            <div className="bg-white p-4 rounded-xl shadow-sm shadow-slate-500/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-dashboard flex-shrink-0 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-bluelight" />
                </div>
                <div className="min-w-0">
                  <p className="text-[1.2em] font-medium text-grays">
                    {t("yourLink")}
                  </p>
                  <p className="text-[1.6em] font-semibold text-shortblack truncate">
                    {generatedLink.shortUrl}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(generatedLink.shortUrl, "short")}
                title={isShortCopied ? t("copied") : t("copy")}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-bluelight hover:bg-blues transition-colors"
              >
                {isShortCopied ? (
                  <Check className="w-5 h-5 text-greenlight" />
                ) : (
                  <Clipboard className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Card Share */}
            <div className="bg-white p-4 rounded-xl shadow-sm shadow-slate-500/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleSocialShare(platform)}
                    title={`Share to ${platform.name}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-blues hover:bg-blue-dashboard transition-colors"
                  >
                    {platform.icon}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenericShare}
                title={t("share")}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-bluelight hover:bg-blues transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            {/* Card Destination Link */}
            <div className="bg-white p-4 rounded-xl shadow-sm shadow-slate-500/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Ganti ikonnya biar beda */}
                <div className="w-10 h-10 rounded-lg bg-blue-dashboard flex-shrink-0 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-bluelight" />
                </div>
                <div className="min-w-0">
                  <p className="text-[1.2em] font-medium text-grays">
                    {t("destinationLink")}
                  </p>
                  <p className="text-[1.6em] font-semibold text-shortblack truncate">
                    {generatedLink.originalUrl}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(generatedLink.originalUrl, "dest")}
                title={isDestCopied ? t("copied") : t("copy")}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-bluelight hover:bg-blues transition-colors"
              >
                {isDestCopied ? (
                  <Check className="w-5 h-5 text-greenlight" />
                ) : (
                  <Clipboard className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
