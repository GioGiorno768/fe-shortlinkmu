// src/hooks/useHistory.ts
"use client";

import { useState, useEffect } from "react";
import * as historyService from "@/services/historyService";
import type { ActivityLog, ActivityType } from "@/types/type";

export type FilterType = "all" | ActivityType;

export function useHistory() {
  // Data State
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State (Control dari sini, bukan di component UI)
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Kirim state filter ke Service
        const response = await historyService.getActivityLogs({
          type: filter,
          search: search,
          page: page,
        });

        setLogs(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Gagal load history:", err);
        setError("Gagal memuat riwayat aktivitas.");
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search dikit biar gak spam API
    const timeoutId = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filter, search, page]); // Fetch ulang kalau filter/page berubah

  // Reset page ke 1 kalau filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  return {
    logs,
    totalPages,
    isLoading,
    error,
    // Return state & setter buat dipake di UI
    filter,
    setFilter,
    search,
    setSearch,
    page,
    setPage,
  };
}
