// src/components/dashboard/ReferralCard.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Clipboard,
  Check,
  Loader2,
  Facebook,
  Twitter,
  Send,
  Upload,
  ArrowRight,
} from "lucide-react";
import type { ReferralCardData } from "@/types/type";

// Terima data lewat props
interface ReferralCardProps {
  data: ReferralCardData | null;
}

export default function ReferralCard({ data }: ReferralCardProps) {
  const t = useTranslations("Dashboard");

  // State lokal cuma buat interaksi UI (Copy status)
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Social Share logic (Tetap sama)
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

  const handleSocialShare = (platform: any) => {
    if (!data?.referralLink) return;
    window.open(`${platform.url}${data.referralLink}`, "_blank");
  };

  const handleGenericShare = async () => {
    if (navigator.share && data?.referralLink) {
      try {
        await navigator.share({
          title: "Join Shortlinkmu",
          text: "Daftar dan dapatkan penghasilan tambahan!",
          url: data.referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  // Loading State handled in render
  const isLoading = !data;

  return (
    <div className="bg-white p-6 py-4 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-center">
      {/* Grid Utama 2 Kolom (Layout Original) */}
      <div className="grid grid-cols-1 custom:grid-cols-3 gap-6 pb-2 w-full">
        {/* === Kolom Kiri: Referral === */}
        <div className="space-y-4 custom:col-span-2">
          <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
            {t("referralTitle")}
          </h3>

          {/* Box Link Referral */}
          <div className="bg-blues rounded-xl p-3 px-5 flex items-center gap-5 h-[72px]">
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-bluelight" />
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
                    value={data?.referralLink || ""}
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
                  disabled={isLoading}
                >
                  {platform.icon}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenericShare}
              title={t("share")}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-bluelight hover:bg-blues transition-colors"
              disabled={isLoading}
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* === Kolom Kanan: Users === */}
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="space-y-4">
            <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
              {t("users")}
            </h3>

            {/* Box User Count */}
            <div className="bg-blues rounded-xl p-4 flex items-center justify-center h-[72px]">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-bluelight" />
              ) : (
                <span className="text-4xl font-bold text-bluelight font-manrope">
                  {data?.totalUsers}
                </span>
              )}
            </div>
          </div>

          <div className="flex custom:justify-center justify-end custom:items-center">
            {/* Link All Details */}
            <Link
              href="/referral"
              className="flex items-center justify-end gap-1 text-[1.4em] custom:p-5 custom:py-2 py-1 px-5 rounded-lg font-medium text-bluelight hover:underline bg-blues"
            >
              <span>{t("allDetails")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
