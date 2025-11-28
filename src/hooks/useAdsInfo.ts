// src/hooks/useAdsInfo.ts
"use client";

import { useState, useEffect } from "react";
import * as adsInfoService from "@/services/adsInfoService";
import type { AdLevelConfig } from "@/types/type";

export function useAdsInfo() {
  const [levels, setLevels] = useState<AdLevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await adsInfoService.getAdLevels();
        setLevels(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data level iklan.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    levels,
    isLoading,
    error,
  };
}
