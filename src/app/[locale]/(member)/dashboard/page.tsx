// src/app/(dashboard)/dashbardpage.tsx
"use client";
import { Link } from "@/i18n/routing";
import {
  BanknoteArrowUp,
  MousePointerClick,
  MousePointer2Icon,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import AchievementCard from "@/components/dashboard/AchievementCard"; // <-- IMPORT KARTU BARU
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopPerformingLinksCard from "@/components/dashboard/TopPerformingLinksCard";
import TopTrafficCard from "@/components/dashboard/TopTrafficCard";
import ReferralCard from "@/components/dashboard/ReferralCard";
import MilestoneCard from "@/components/dashboard/MilestoneCard";
import DashboardSlider from "@/components/dashboard/DashboardSlider";

export default function DashboardPage() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  // Ini 3 kartu pertama
  const statsCards = [
    {
      icon: BanknoteArrowUp,
      color: ["text-bluelight", "bg-blue-dashboard", "border-bluelight"],
      label: t("totalEarnings"),
      apiEndpoint: "/api/stats/earnings",
    },
    // {
    //   icon: MousePointerClick,
    //   color: [
    //     "text-darkpurple-dashboard",
    //     "bg-lightpurple-dashboard",
    //     "border-darkpurple-dashboard",
    //   ],
    //   label: t("totalClicks"),
    //   apiEndpoint: "/api/stats/clicks",
    // },
    {
      icon: Eye,
      color: [
        "text-darkgreen-dashboard",
        "bg-lightgreen-dashboard",
        "border-darkgreen-dashboard",
      ],
      label: t("totalViews"),
      apiEndpoint: "/api/stats/totalViews",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Stats Grid */}
      {/* UBAH GRID: 3 kartu pertama + 1 kartu achievement */}
      <div className="grid grid-cols-1 md:grid-cols-2 custom:grid-cols-4 gap-6 mb-8">
        {/* Render 3 kartu pertama */}
        {/* {statsCards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            color={card.color}
            label={card.label}
            apiEndpoint={card.apiEndpoint}
          />
        ))} */}
        {/* Card 3 (SLIDER): Lebar 2 Kolom */}
        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full min-h-[200px]">
          <DashboardSlider />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
          <MilestoneCard />
        </div>

        {/* TAMBAHKAN KARTU ACHIEVEMENT DI SINI */}
        {/* <div >
          <AchievementCard />
        </div> */}
      </div>

      {/* Charts Section (Ini sisa kode lu, gak diubah) */}
      <div className="grid grid-cols-1 custom:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        {/* 2. GANTI "RECENT ACTIVITY" JADI KARTU BARU LU */}
        {/* KITA BUAT JADI 'lg:col-span-2' BIAR LEBAR SESUAI GAMBAR */}
        <div className="">
          <LinkAnalyticsCard />
        </div>

        {/* --- 2. GANTI BAGIAN INI --- */}
        {/* Hapus "Top Products" div */}
        <div className="">
          <TopPerformingLinksCard />
        </div>
        {/* --- AKHIR PERUBAHAN --- */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Traffic */}
        <div>
          <TopTrafficCard />
        </div>

        {/* Referral */}
        <div>
          <ReferralCard />
        </div>
      </div>
    </div>
  );
}
