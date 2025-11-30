// src/services/headerService.ts
import type { HeaderStats, AdminHeaderStats } from "@/types/type";

export async function getHeaderStats(): Promise<HeaderStats> {
  // NANTI GANTI: fetch('/api/user/header-stats')
  // Data ini biasanya butuh fresh/realtime, jadi nanti di Next.js fetch-nya:
  // fetch(url, { cache: 'no-store' })

  await new Promise((r) => setTimeout(r, 500)); // Simulasi
  return {
    balance: 880.21,
    payout: 10210.0,
    cpm: 5.0,
  };
}

export async function getAdminHeaderStats(): Promise<AdminHeaderStats> {
  // NANTI GANTI: fetch('/api/admin/header-stats')
  await new Promise((r) => setTimeout(r, 500));
  return {
    pendingWithdrawals: 18, // Angka contoh
    abuseReports: 3,
    newUsers: 145,
  };
}
