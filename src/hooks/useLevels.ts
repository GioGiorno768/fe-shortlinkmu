// src/hooks/useLevels.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import * as levelsService from "@/services/levelsService";
import type { UserLevelProgress, LevelConfig } from "@/types/type";

// Query keys for cache management
export const levelsKeys = {
  all: ["levels"] as const,
  progress: () => [...levelsKeys.all, "progress"] as const,
  config: () => [...levelsKeys.all, "config"] as const,
};

export function useLevels() {
  // Fetch user progress with React Query
  const {
    data: userProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useQuery({
    queryKey: levelsKeys.progress(),
    queryFn: levelsService.getUserLevelProgress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch levels config with React Query
  const {
    data: levelsConfig,
    isLoading: configLoading,
    error: configError,
  } = useQuery({
    queryKey: levelsKeys.config(),
    queryFn: levelsService.getLevelsConfig,
    staleTime: 10 * 60 * 1000, // 10 minutes - config rarely changes
  });

  // Combined loading state
  const isLoading = progressLoading || configLoading;

  // Combined error state
  const error =
    progressError || configError ? "Gagal memuat data level." : null;

  return {
    userProgress: userProgress ?? null,
    levelsConfig: levelsConfig ?? [],
    isLoading,
    error,
  };
}
