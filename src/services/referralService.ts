// src/services/referralService.ts
import type { ReferralStats, ReferredUser } from "@/types/type";

// --- MOCK API CALLS ---

export async function getReferralStats(): Promise<ReferralStats> {
  // NANTI GANTI: fetch('/api/referral/stats')
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    totalEarnings: 154.2,
    totalReferred: 45,
    activeReferred: 12,
    commissionRate: 20,
  };
}

export async function getReferredUsers(): Promise<ReferredUser[]> {
  // NANTI GANTI: fetch('/api/referral/list')
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
    // ... data lain
  ];
}

// Tambahan: Fetch Link Referral User (Biar gak hardcoded di UI)
export async function getReferralLink(): Promise<string> {
  // NANTI GANTI: fetch('/api/user/referral-link')
  await new Promise((resolve) => setTimeout(resolve, 400));
  return "https://shortlinkmu.com/ref/kevin123";
}
