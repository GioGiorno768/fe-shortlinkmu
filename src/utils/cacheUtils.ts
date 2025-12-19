// src/utils/cacheUtils.ts
// Centralized cache management for clearing all caches on logout

import { clearHeaderCache } from "@/services/headerService";
import { clearReferralCache } from "@/services/referralService";

// Keep reference to QueryClient for clearing React Query cache
let queryClientRef: any = null;

/**
 * Set the QueryClient reference (called from providers)
 */
export function setQueryClient(client: any): void {
  queryClientRef = client;
}

/**
 * Clear all application caches
 * Should be called on logout to prevent stale data
 */
export function clearAllCaches(): void {
  // 1. Clear service-level caches
  clearHeaderCache();
  clearReferralCache();

  // 2. Clear React Query cache
  if (queryClientRef) {
    queryClientRef.clear();
  }

  // 3. Clear any localStorage cache keys
  if (typeof window !== "undefined") {
    // Add any specific cache keys here
    const cacheKeys = ["dashboard_cache", "analytics_cache", "links_cache"];
    cacheKeys.forEach((key) => localStorage.removeItem(key));
  }

  console.log("🧹 All caches cleared");
}
