// src/hooks/useAdsInfo.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import * as adsInfoService from "@/services/adsInfoService";
import type { AdLevelConfig } from "@/types/type";

// Query keys for cache management
export const adsInfoKeys = {
  all: ["adsInfo"] as const,
  levels: () => [...adsInfoKeys.all, "levels"] as const,
};

export function useAdsInfo() {
  const {
    data: levels,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: adsInfoKeys.levels(),
    queryFn: adsInfoService.getAdLevels,
    staleTime: 10 * 60 * 1000, // 10 minutes - ad config rarely changes
  });

  // Convert error to string for consistency
  const error = queryError ? "Gagal memuat data level iklan." : null;

  return {
    levels: levels ?? [],
    isLoading,
    error,
  };
}
