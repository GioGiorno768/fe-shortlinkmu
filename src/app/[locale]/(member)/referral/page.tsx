// src/app/[locale]/(member)/referral/page.tsx
"use client";

import { useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";

// Components
import ReferralHeader from "@/components/dashboard/referral/ReferralHeader";
import ReferralStatsGrid from "@/components/dashboard/referral/ReferralStatsGrid";
import ReferralHowItWorks from "@/components/dashboard/referral/ReferralHowItWorks";
import ReferralTable from "@/components/dashboard/referral/ReferralTable";

// Hook
import { useReferral } from "@/hooks/useReferral";

export default function ReferralPage() {
  const { showAlert } = useAlert();

  // Panggil Logic dari Hook
  const { stats, users, referralLink, isLoading, error } = useReferral();

  // Handle Error Alert
  useEffect(() => {
    if (error) {
      showAlert(error, "error");
    }
  }, [error, showAlert]);

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
