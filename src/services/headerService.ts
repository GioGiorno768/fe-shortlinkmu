// src/services/headerService.ts
import type { HeaderStats, AdminHeaderStats } from "@/types/type";
import apiClient from "./apiClient";

// In-memory cache for header stats
let cachedStats: HeaderStats | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute client-side cache

/**
 * Get header stats with client-side caching.
 * Uses dedicated lightweight endpoint /api/user/stats
 */
export async function getHeaderStats(): Promise<HeaderStats> {
  // Return cached if still valid
  const now = Date.now();
  if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
    return cachedStats;
  }

  try {
    const response = await apiClient.get("/user/stats");
    const data = response.data.data;

    cachedStats = {
      balance: data?.balance ?? 0,
      payout: data?.payout ?? 0,
      cpm: data?.cpm ?? 0,
    };
    cacheTimestamp = now;

    return cachedStats;
  } catch (error) {
    console.error("Failed to fetch header stats:", error);
    // Return cached if available, otherwise defaults
    return cachedStats ?? { balance: 0, payout: 0, cpm: 0 };
  }
}

/**
 * Force refresh header stats (invalidate cache).
 * Call this after withdrawal, payout, etc.
 */
export async function refreshHeaderStats(): Promise<HeaderStats> {
  cachedStats = null;
  cacheTimestamp = 0;
  return getHeaderStats();
}

/**
 * Get cached stats immediately (no fetch).
 * Returns null if cache is empty.
 */
export function getCachedHeaderStats(): HeaderStats | null {
  const now = Date.now();
  if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
    return cachedStats;
  }
  return null;
}

export async function getAdminHeaderStats(): Promise<AdminHeaderStats> {
  // TODO: Implement admin header stats endpoint
  await new Promise((r) => setTimeout(r, 100));
  return {
    pendingWithdrawals: 18,
    abuseReports: 3,
    newUsers: 145,
  };
}
