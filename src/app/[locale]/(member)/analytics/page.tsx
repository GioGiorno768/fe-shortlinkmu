// src/app/[locale]/(dashboard)/analytics/page.tsx
"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import { useTranslations } from "next-intl";
import {
  BanknoteArrowUp,
  MousePointerClick,
  Eye,
  DollarSign,
  UserPlus,
  UserPlus2, // Kita pake ikon dollar buat CPM
} from "lucide-react";
import TopCountriesCard from "@/components/dashboard/TopCountriesCard";
import TopReferrersCard from "@/components/dashboard/TopReferrersCard";

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard");

  // ========================================================
  // === DESAIN API ===
  // ========================================================
  // Setup API buat card-card ini udah ada di dalem
  // komponen <StatsCard> itu sendiri. Lu cuma perlu
  // pastikan endpoint API-nya bener.
  // ========================================================
  const statsCards = [
    {
      icon: BanknoteArrowUp,
      color: ["text-bluelight", "bg-blue-dashboard", "border-bluelight"],
      label: t("totalEarnings"),
      apiEndpoint: "/api/stats/earnings", // <-- Pastiin endpoint ini ada
    },
    {
      icon: Eye,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("totalViews"),
      apiEndpoint: "/api/stats/totalViews", // <-- Pastiin endpoint ini ada
    },
    {
      icon: UserPlus2,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("referral"),
      apiEndpoint: "/api/stats/referral", // <-- Pastiin endpoint ini ada
    },
    // Ini card baru yang kita tambahin
    {
      icon: DollarSign,
      color: [
        "text-yellow-600", // Ganti warnanya
        "bg-yellow-100",
        "border-yellow-500",
      ],
      label: t("avgCPM"),
      apiEndpoint: "/api/stats/avg-cpm", // <-- Pastiin endpoint ini ada
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      <div className="space-y-6">
        {/* Bagian 1: Stats Cards (4 Kartu) */}
        <div className="grid grid-cols-1 md:grid-cols-2 custom:grid-cols-4 gap-6">
          {statsCards.map((card) => (
            <StatsCard
              key={card.label}
              icon={card.icon}
              color={card.color}
              label={card.label}
              apiEndpoint={card.apiEndpoint}
            />
          ))}
        </div>

        {/* Bagian 2: Main Chart (Full Width)
          Setup API buat chart ini udah ada di dalem 
          komponen <LinkAnalyticsCard>
        */}
        <div className="w-full">
          <LinkAnalyticsCard />
        </div>

        {/* NANTI KITA TAMBAHIN FITUR BERIKUTNYA DI SINI
          (Misal: Top Countries, Top Referrers)
        */}
        {/* --- 2. TAMBAHKAN BAGIAN BARU DI SINI --- */}
        {/* Bagian 3: Top Countries & Referrers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri: Top Countries */}
          <div className="h-[380px]">
            {" "}
            {/* Kita kasih tinggi biar tingginya sama */}
            <TopCountriesCard />
          </div>

          {/* Kolom Kanan: Nanti buat Top Referrers */}
          <div className="h-[380px]">
            <TopReferrersCard />
          </div>
        </div>
      </div>
    </div>
  );
}
