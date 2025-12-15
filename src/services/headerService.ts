// src/services/headerService.ts
import type { HeaderStats, AdminHeaderStats } from "@/types/type";
import apiClient from "./apiClient";

export async function getHeaderStats(): Promise<HeaderStats> {
  try {
    const response = await apiClient.get("/dashboard/overview");
    const summary = response.data.data?.summary || response.data.summary;

    return {
      balance: summary?.balance ?? 0,
      payout: summary?.payout ?? 0,
      cpm: summary?.cpm ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch header stats:", error);
    // Return default values on error
    return {
      balance: 0,
      payout: 0,
      cpm: 0,
    };
  }
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
