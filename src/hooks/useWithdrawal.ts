// src/hooks/useWithdrawal.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as withdrawalService from "@/services/withdrawalService";
import * as settingsService from "@/services/settingsService";
import { refreshHeaderStats } from "@/services/headerService";
import type {
  WithdrawalStats,
  PaymentMethod,
  Transaction,
  SavedPaymentMethod,
} from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

interface WithdrawalSettings {
  minWithdrawal: number;
  maxWithdrawal: number;
  limitCount: number;
  limitDays: number;
}

// Query keys for cache management
export const withdrawalKeys = {
  all: ["withdrawal"] as const,
  data: (page: number, search: string, sort: string, method: string) =>
    [...withdrawalKeys.all, "data", page, search, sort, method] as const,
  method: () => [...withdrawalKeys.all, "method"] as const,
  allMethods: () => [...withdrawalKeys.all, "allMethods"] as const,
};

type SortOrder = "newest" | "oldest";

export function useWithdrawal() {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  // Table States (Pagination, Search, Filters)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [methodFilter, setMethodFilter] = useState("all");

  // Debounced search for API call
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortOrder, methodFilter]);

  // Main Data Query with all filters
  const {
    data: withdrawalData,
    isLoading,
    isFetching,
    error: dataError,
  } = useQuery({
    queryKey: withdrawalKeys.data(
      page,
      debouncedSearch,
      sortOrder,
      methodFilter
    ),
    queryFn: () =>
      withdrawalService.getWithdrawalData(
        page,
        debouncedSearch,
        sortOrder,
        methodFilter
      ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });

  // 2. Payment Method Query (default method)
  const { data: method } = useQuery({
    queryKey: withdrawalKeys.method(),
    queryFn: withdrawalService.getPrimaryPaymentMethod,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 2b. All Payment Methods Query (for "Use Different Method")
  const { data: allMethods } = useQuery({
    queryKey: withdrawalKeys.allMethods(),
    queryFn: settingsService.getPaymentMethods,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract data
  const stats = withdrawalData?.stats ?? null;
  const settings = withdrawalData?.settings ?? null;
  const transactions = withdrawalData?.transactions ?? [];
  const totalPages = withdrawalData?.totalPages ?? 1;

  // Mutation: Request Payout
  const requestPayoutMutation = useMutation({
    mutationFn: ({
      amount,
      usedMethod,
    }: {
      amount: number;
      usedMethod: PaymentMethod;
    }) => withdrawalService.requestWithdrawal(amount, usedMethod),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.all });
      // Refresh header stats to update balance
      refreshHeaderStats();
      showAlert("Permintaan penarikan berhasil dikirim!", "success");
    },
    onError: (error: any) => {
      showAlert(error.message || "Gagal memproses penarikan.", "error");
    },
  });

  // Mutation: Cancel Transaction
  const cancelTransactionMutation = useMutation({
    mutationFn: (id: string) => withdrawalService.cancelWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.all });
      // Refresh header stats to update balance
      refreshHeaderStats();
      showAlert("Permintaan penarikan dibatalkan.", "info");
    },
    onError: (error: any) => {
      showAlert(error.message || "Gagal membatalkan transaksi.", "error");
    },
  });

  // Action wrappers for backwards compatibility
  const requestPayout = async (amount: number, usedMethod: PaymentMethod) => {
    try {
      await requestPayoutMutation.mutateAsync({ amount, usedMethod });
      return true;
    } catch {
      return false;
    }
  };

  const cancelTransaction = async (id: string) => {
    try {
      await cancelTransactionMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  // Refresh all data
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: withdrawalKeys.all });
  }, [queryClient]);

  const isProcessing =
    requestPayoutMutation.isPending || cancelTransactionMutation.isPending;

  // Show error alert if load fails
  useEffect(() => {
    if (dataError) {
      showAlert("Gagal memuat data withdrawal.", "error");
    }
  }, [dataError, showAlert]);

  return {
    stats,
    method: method ?? null,
    allMethods: allMethods ?? [],
    settings,
    transactions,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    methodFilter,
    setMethodFilter,
    isLoading,
    isTableLoading: isFetching,
    isProcessing,
    requestPayout,
    cancelTransaction,
    refreshData,
  };
}
