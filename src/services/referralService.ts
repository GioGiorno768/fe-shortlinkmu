// src/services/referralService.ts
import apiClient from "@/services/apiClient";
import type { ReferralStats, ReferredUser } from "@/types/type";

// API Response types
interface ReferralApiResponse {
  stats: {
    totalEarnings: number;
    totalReferred: number;
    activeReferred: number;
    commissionRate: number;
  };
  referralLink: string;
  referrals: {
    data: ReferredUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Cache to avoid duplicate API calls
let cachedData: ReferralApiResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

async function fetchReferralData(): Promise<ReferralApiResponse> {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }

  const response = await apiClient.get<{ data: ReferralApiResponse }>(
    "/referrals"
  );
  cachedData = response.data.data;
  cacheTimestamp = now;
  return cachedData;
}

// Fetch referral stats
export async function getReferralStats(): Promise<ReferralStats> {
  const data = await fetchReferralData();
  return data.stats;
}

// Fetch referred users list
export async function getReferredUsers(): Promise<ReferredUser[]> {
  const data = await fetchReferralData();
  return data.referrals.data;
}

// Fetch referral link
export async function getReferralLink(): Promise<string> {
  const data = await fetchReferralData();
  return data.referralLink;
}

// Force refetch (clear cache)
export function clearReferralCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
}
