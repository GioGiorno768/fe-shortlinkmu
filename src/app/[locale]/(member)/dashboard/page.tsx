// src/app/(dashboard)/dashbardpage.tsx
"use client";
import { useTranslations } from "next-intl";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopPerformingLinksCard from "@/components/dashboard/TopPerformingLinksCard";
import TopTrafficCard from "@/components/dashboard/TopTrafficCard";
import ReferralCard from "@/components/dashboard/ReferralCard";
import MilestoneCard from "@/components/dashboard/MilestoneCard";
import DashboardSlider from "@/components/dashboard/DashboardSlider";
import { Megaphone, Sparkles, Star, Wallet } from "lucide-react";
import {
  AdLevel,
  AnalyticsData,
  DashboardSlide,
  MilestoneData,
  ReferralCardData,
  StatType,
  TimeRange,
  TopPerformingLink,
  TopTrafficStats,
} from "@/types/type";
import { useEffect, useState } from "react";

// --- 1. DATA DUMMY SLIDER (Simulasi API) ---
async function fetchSlidesData(): Promise<DashboardSlide[]> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi loading
  return [
    {
      id: "welcome",
      title: "Selamat Datang, Kevin! 👋",
      desc: "Semoga harimu menyenangkan. Yuk cek performa link kamu dan tingkatkan trafik hari ini!",
      cta: "Buat Link Baru",
      link: "/new-link",
      icon: Sparkles,
      theme: "blue",
    },
    {
      id: "event",
      title: "Bonus CPM Weekend! 🚀",
      desc: "Dapatkan kenaikan CPM +15% untuk semua traffic dari Indonesia khusus Sabtu & Minggu ini.",
      cta: "Lihat Info",
      link: "/ads-info",
      icon: Megaphone,
      theme: "purple",
    },
    {
      id: "feature",
      title: "Withdraw via Crypto 💎",
      desc: "Kabar gembira! Sekarang kamu bisa menarik saldo ke wallet USDT (TRC20) dengan fee rendah.",
      cta: "Atur Payment",
      link: "/settings?tab=payment",
      icon: Wallet,
      theme: "orange",
    },
  ];
}

// --- 2. DATA DUMMY MILESTONE ---
async function fetchMilestoneData(): Promise<MilestoneData> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    icon: Star, // Kirim komponen Icon langsung
    currentLevel: "Rookie",
    nextLevel: "Elite",
    currentEarnings: 35.5,
    nextTarget: 50.0,
    currentBonus: 5,
    nextBonus: 10,
    progress: 71,
  };
}

// --- 3. DATA DUMMY REFERRAL (Simulasi API) ---
async function fetchReferralData(): Promise<ReferralCardData> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    referralLink: "https://shortlinkmu.com/ref?id=kevin123",
    totalUsers: 25,
  };
}

// --- 4. DATA DUMMY TRAFFIC (Simulasi API) ---
async function fetchTopTrafficStats(): Promise<TopTrafficStats> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    topMonth: {
      month: "February",
      views: 405123,
    },
    topYear: {
      year: "2025",
      views: 805678,
    },
    topLevel: {
      level: "mythic",
      cpmBonusPercent: 20,
    },
  };
}

// --- 5. DATA DUMMY TOP LINKS (Simulasi API) ---
async function fetchTopLinks(): Promise<TopPerformingLink[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Bikin 10 data dummy
  return Array.from({ length: 10 }, (_, i) => ({
    id: `link-${i + 1}`,
    title:
      i === 0
        ? "Link Shadow Fight Mod"
        : i === 1
        ? "Turbo VPN Mod"
        : `Generated Link ${i + 1}`,
    shortUrl: `short.link/${i === 0 ? "w1W0K12" : "gen" + (i + 1)}`,
    originalUrl: "https://example.com",
    validViews: 22000 - i * 1500 + Math.floor(Math.random() * 500), // Biar angkanya variatif
    totalEarnings: 200 - i * 15,
    cpm: 9.5 - i * 0.2,
    adsLevel: ["noAds", "level1", "level2", "level3", "level4"][
      i % 5
    ] as AdLevel,
  }));
}

// --- 6. DATA DUMMY ANALYTICS (Simulasi API) ---
// Logic ini dipindahin dari dalam komponen card
async function fetchAnalyticsData(
  range: TimeRange,
  stat: StatType
): Promise<AnalyticsData> {
  console.log(`MANGGIL API: /api/analytics?range=${range}&stat=${stat}`);
  await new Promise((resolve) => setTimeout(resolve, 700));

  let data: AnalyticsData = {
    series: [{ name: "Data", data: [] }],
    categories: [],
  };

  // Label Chart
  let statName = "Total Views";
  if (stat === "totalEarnings") statName = "Earnings";
  if (stat === "totalReferral") statName = "New Referrals";

  // Dummy Data berdasarkan Range
  if (range === "perWeek") {
    data = {
      series: [{ name: statName, data: [10, 41, 35, 51, 49, 62, 69] }],
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  } else if (range === "perMonth") {
    data = {
      series: [
        {
          name: statName,
          data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 100, 80, 110],
        },
      ],
      categories: [
        "Wk1",
        "Wk2",
        "Wk3",
        "Wk4",
        "Wk5",
        "Wk6",
        "Wk7",
        "Wk8",
        "Wk9",
        "Wk10",
        "Wk11",
        "Wk12",
      ],
    };
  } else {
    // perYear
    data = {
      series: [
        {
          name: statName,
          data: [300, 400, 250, 500, 490, 600, 700, 910, 1250, 1000, 800, 1100],
        },
      ],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  }

  // Modifikasi angka berdasarkan Stat Type biar kelihatan beda
  if (stat === "totalEarnings") {
    data.series[0].data = data.series[0].data.map((n) =>
      parseFloat((n / 10).toFixed(2))
    );
  } else if (stat === "totalViews") {
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n * 0.8));
  } else if (stat === "totalReferral") {
    data.series[0].data = data.series[0].data.map((n) => Math.floor(n / 15));
  }

  return data;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  // State untuk Slides
  const [slides, setSlides] = useState<DashboardSlide[]>([]);

  // State baru buat Milestone
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);

  // State baru buat Referral
  const [referralData, setReferralData] = useState<ReferralCardData | null>(
    null
  );

  // State baru buat Top Traffic
  const [trafficStats, setTrafficStats] = useState<TopTrafficStats | null>(
    null
  );

  // State baru
  const [topLinks, setTopLinks] = useState<TopPerformingLink[] | null>(null);

  // --- STATE BUAT ANALYTICS ---
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsRange, setAnalyticsRange] = useState<TimeRange>("perWeek");
  const [analyticsStat, setAnalyticsStat] = useState<StatType>("totalViews");

  // Fetch Awal (Semua)
  useEffect(() => {
    async function load() {
      const [slidesData, milestoneData, refData, trafficData, linksData] =
        await Promise.all([
          fetchSlidesData(),
          fetchMilestoneData(),
          fetchReferralData(),
          fetchTopTrafficStats(),
          fetchTopLinks(),
        ]);

      setSlides(slidesData);
      setMilestone(milestoneData);
      setReferralData(refData);
      setTrafficStats(trafficData);
      setTopLinks(linksData);

      // Load Analytics default
      // (Kita panggil ini terpisah atau barengan juga boleh,
      // tapi karena dia punya loading sendiri pas ganti filter,
      // mending kita trigger via useEffect terpisah di bawah)
    }
    load();
  }, []);

  // Fetch Khusus Analytics (Jalan pas range/stat berubah)
  useEffect(() => {
    async function loadAnalytics() {
      setAnalyticsLoading(true);
      try {
        const data = await fetchAnalyticsData(analyticsRange, analyticsStat);
        setAnalyticsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setAnalyticsLoading(false);
      }
    }
    loadAnalytics();
  }, [analyticsRange, analyticsStat]); // <--- Trigger fetch pas filter ganti

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* Stats Grid */}
      {/* UBAH GRID: 3 kartu pertama + 1 kartu achievement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 3 (SLIDER): Pass data slides lewat props */}
        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full min-h-[200px]">
          <DashboardSlider slides={slides} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
          <MilestoneCard data={milestone} />
        </div>
      </div>

      {/* Charts Section (Ini sisa kode lu, gak diubah) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        {/* 2. GANTI "RECENT ACTIVITY" JADI KARTU BARU LU */}
        {/* KITA BUAT JADI 'lg:col-span-2' BIAR LEBAR SESUAI GAMBAR */}
        <div className="">
          <LinkAnalyticsCard
            data={analyticsData}
            isLoading={analyticsLoading}
            error={null}
            range={analyticsRange}
            stat={analyticsStat}
            onChangeRange={setAnalyticsRange}
            onChangeStat={setAnalyticsStat}
          />
        </div>

        {/* --- 2. GANTI BAGIAN INI --- */}
        {/* Hapus "Top Products" div */}
        <div className="">
          <TopPerformingLinksCard data={topLinks} />
        </div>
        {/* --- AKHIR PERUBAHAN --- */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Traffic */}
        <div>
          <TopTrafficCard data={trafficStats} />
        </div>

        {/* Referral */}
        <div>
          <ReferralCard data={referralData} />
        </div>
      </div>
    </div>
  );
}
