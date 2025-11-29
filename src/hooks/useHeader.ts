// src/hooks/useHeader.ts
"use client";

import { useState, useEffect } from "react";
import * as headerService from "@/services/headerService";
import type { HeaderStats } from "@/types/type";

export function useHeader() {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await headerService.getHeaderStats();
        setStats(data);
      } catch (error) {
        console.error("Gagal load header stats", error);
        // Opsional: Set default 0 kalo error
        setStats({ balance: 0, payout: 0, cpm: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return { stats, isLoading };
}
