// src/hooks/useLevels.ts
"use client";

import { useState, useEffect } from "react";
import * as levelsService from "@/services/levelsService";
import type { UserLevelProgress, LevelConfig } from "@/types/type";

export function useLevels() {
  // State sesuai tipe data yang bener
  const [userProgress, setUserProgress] = useState<UserLevelProgress | null>(
    null
  );
  const [levelsConfig, setLevelsConfig] = useState<LevelConfig[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch paralel biar kenceng
        const [progressData, configData] = await Promise.all([
          levelsService.getUserLevelProgress(),
          levelsService.getLevelsConfig(),
        ]);

        setUserProgress(progressData);
        setLevelsConfig(configData);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data level.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    userProgress,
    levelsConfig,
    isLoading,
    error,
  };
}
