// src/hooks/useReferral.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import * as referralService from "@/services/referralService";
import type { ReferralStats, ReferredUser } from "@/types/type";

// Query keys for cache management
export const referralKeys = {
  all: ["referral"] as const,
  stats: () => [...referralKeys.all, "stats"] as const,
  users: () => [...referralKeys.all, "users"] as const,
  link: () => [...referralKeys.all, "link"] as const,
};

export function useReferral() {
  // Fetch referral stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: referralKeys.stats(),
    queryFn: referralService.getReferralStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch referred users list
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: referralKeys.users(),
    queryFn: referralService.getReferredUsers,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch referral link
  const {
    data: referralLink,
    isLoading: linkLoading,
    error: linkError,
  } = useQuery({
    queryKey: referralKeys.link(),
    queryFn: referralService.getReferralLink,
    staleTime: 30 * 60 * 1000, // 30 minutes - link rarely changes
  });

  // Combined loading state
  const isLoading = statsLoading || usersLoading || linkLoading;

  // Combined error state
  const error =
    statsError || usersError || linkError
      ? "Gagal memuat data referral."
      : null;

  return {
    stats: stats ?? null,
    users: users ?? [],
    referralLink: referralLink ?? "",
    isLoading,
    error,
  };
}
