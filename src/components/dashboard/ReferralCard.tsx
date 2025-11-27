// src/components/dashboard/ReferralCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Clipboard,
  Check,
  Loader2,
  Facebook,
  Twitter,
  Send, // Icon Telegram
  Upload, // Icon Share generik
  ArrowRight,
} from "lucide-react";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
interface ReferralData {
  link: string;
  userCount: number;
}

// Kita jadiin satu API call biar efisien
async function fetchReferralData(): Promise<ReferralData> {
  console.log("MANGGIL API: /api/user/referral-data");
  /* // --- CONTOH API CALL BENERAN ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/user/referral-data`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error("Gagal memuat data referral");
  // }
  // const data: ReferralData = await response.json();
  // return data; // Asumsi API ngembaliin { link: "...", userCount: 20 }
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi loading
  return {
    link: "https://shortlinkmu.com/ref?id=k21314141423",
    userCount: 20,
  };
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

export default function ReferralCard() {
  const t = useTranslations("Dashboard");

  // State utama
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Efek: Fetch data pas komponen load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchReferralData();
        setData(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Handlers ---
  const handleCopy = () => {
    if (!data?.link) return;
    navigator.clipboard.writeText(data.link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // List platform share
  const socialPlatforms = [
    {
      name: "WhatsApp",
      // Pake icon WhatsApp dari globals.css lu
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

  // Fungsi buat handle social share
  const handleSocialShare = (platform: (typeof socialPlatforms)[0]) => {
    if (!data?.link) return;
    const text = `Ayo gabung Shortlinkmu pake link referral gua! ${data.link}`;
    const encodedUrl = encodeURIComponent(data.link);
    const encodedText = encodeURIComponent(text);

    let shareUrl = "";
    if (platform.name === "WhatsApp" || platform.name === "Twitter") {
      shareUrl = `${platform.url}${encodedText}`;
    } else {
      // Facebook, Telegram
      shareUrl = `${platform.url}${encodedUrl}&text=${encodedText}`;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Fungsi buat generic share (ikon panah atas)
  const handleGenericShare = async () => {
    if (navigator.share && data?.link) {
      try {
        await navigator.share({
          title: "Gabung Shortlinkmu!",
          text: `Ayo gabung Shortlinkmu! ${data.link}`,
          url: data.link,
        });
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      alert("Browser ini tidak mendukung fitur share. Link disalin!");
      handleCopy();
    }
  };

  return (
    <div className="bg-white p-6 py-4 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 box-border h-full">
      {/* Grid Utama 2 Kolom */}
      <div className="grid grid-cols-1 custom:grid-cols-3 gap-6 pb-2">
        {/* === Kolom Kiri: Referral === */}
        <div className="space-y-4 custom:col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
              {t("referralTitle")}
            </h3>
            <Link
              href="/referral" // Link ke halaman referral
              className="custom:hidden flex items-center justify-end gap-1 text-[1.4em] font-medium text-bluelight hover:underline "
            >
              <span>Detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Box Link Referral */}
          <div className="bg-blues rounded-xl p-3 px-5 flex items-center gap-5 h-[72px]">
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-bluelight" />
              </div>
            ) : error ? (
              <div className="w-full flex items-center justify-center text-redshortlink">
                {error}
              </div>
            ) : (
              <>
                {/* Icon User+Dollar */}
                <span className="tabler--user-dollar w-6 h-6 bg-bluelight flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[1.2em] font-medium text-grays">
                    {t("yourReferral")}
                  </p>
                  <input
                    type="text"
                    readOnly
                    value={data?.link || ""}
                    className="w-full text-[1.6em] font-medium text-shortblack bg-transparent border-none outline-none p-0"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <button
                  onClick={handleCopy}
                  title={isCopied ? t("copied") : t("copy")}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-bluelight hover:bg-white transition-colors"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-greenlight" />
                  ) : (
                    <Clipboard className="w-5 h-5" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Box Share Button */}
          <div className="bg-white rounded-xl p-3 px-6 flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
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
        </div>

        {/* === Kolom Kanan: Users === */}
        <div className="grid grid-cols-1 w-full">
          <div className="flex flex-col gap-4 h-full">
            <Link
              href="/referral" // Link ke halaman referral
              className="custom:flex hidden items-center justify-end gap-1 text-[1.4em] font-medium text-bluelight hover:underline "
            >
              <span>Detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Box User Count */}
            <div className="bg-blues rounded-xl flex flex-col items-center p-6 justify-center h-full w-full">
              <h1 className="text-[1.4em] pb-2 text-grays">{t("users")}</h1>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-bluelight" />
              ) : error ? (
                <span className="text-redshortlink">Error</span>
              ) : (
                <span className="text-6xl font-bold text-bluelight font-manrope">
                  {data?.userCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
