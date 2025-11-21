"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";
import type { ReferralStats, ReferredUser } from "@/types/type";

// Import Komponen Pecahan
import ReferralHeader from "@/components/dashboard/referral/ReferralHeader";
import ReferralStatsGrid from "@/components/dashboard/referral/ReferralStatsGrid";
import ReferralHowItWorks from "@/components/dashboard/referral/ReferralHowItWorks";
import ReferralTable from "@/components/dashboard/referral/ReferralTable";

// --- API MOCK ---
async function fetchReferralStats(): Promise<ReferralStats> {
  console.log("MANGGIL API: /api/referral/stats");
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    totalEarnings: 154.2,
    totalReferred: 45,
    activeReferred: 12,
    commissionRate: 20,
  };
}

async function fetchReferredUsers(): Promise<ReferredUser[]> {
  console.log("MANGGIL API: /api/referral/list");
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    {
      id: "1",
      name: "Budi Santoso",
      emailHidden: "bu***@gmail.com",
      dateJoined: "2025-10-01",
      totalEarningsForMe: 12.5,
      status: "active",
    },
    {
      id: "2",
      name: "Siti Aminah",
      emailHidden: "si***@yahoo.com",
      dateJoined: "2025-10-05",
      totalEarningsForMe: 5.2,
      status: "inactive",
    },
    {
      id: "3",
      name: "Joko Anwar",
      emailHidden: "jo***@gmail.com",
      dateJoined: "2025-10-12",
      totalEarningsForMe: 25.0,
      status: "active",
    },
    {
      id: "4",
      name: "Rina Nose",
      emailHidden: "ri***@outlook.com",
      dateJoined: "2025-10-20",
      totalEarningsForMe: 0.0,
      status: "inactive",
    },
    {
      id: "5",
      name: "Dedi Corbu",
      emailHidden: "de***@gmail.com",
      dateJoined: "2025-11-01",
      totalEarningsForMe: 8.8,
      status: "active",
    },
  ];
}

export default function ReferralPage() {
  const { showAlert } = useAlert();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [users, setUsers] = useState<ReferredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralLink] = useState("https://shortlinkmu.com/ref/kevin123"); // Ini nanti dari API user

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, usersData] = await Promise.all([
          fetchReferralStats(),
          fetchReferredUsers(),
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        showAlert("Gagal memuat data referral.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-8 pb-10">
      {/* 1. Header Gradient & Share Link */}
      <ReferralHeader
        referralLink={referralLink}
        commissionRate={stats?.commissionRate || 0}
      />

      {/* 2. Statistik Referral (3 Card) */}
      <ReferralStatsGrid stats={stats} />

      {/* 3. Penjelasan Cara Kerja */}
      <ReferralHowItWorks commissionRate={stats?.commissionRate || 0} />

      {/* 4. Tabel Daftar Teman */}
      <ReferralTable users={users} />
    </div>
  );
}
