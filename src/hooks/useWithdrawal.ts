// src/hooks/useWithdrawal.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as withdrawalService from "@/services/withdrawalService";
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";
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
  data: (page: number, search: string) =>
    [...withdrawalKeys.all, "data", page, search] as const,
  method: () => [...withdrawalKeys.all, "method"] as const,
  transactions: (page: number, search: string) =>
    [...withdrawalKeys.all, "transactions", page, search] as const,
};

export function useWithdrawal() {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  // Table States (Pagination & Search)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Debounced search for API call
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // 1. Initial Data Query (stats, settings, first page transactions)
  const {
    data: initialData,
    isLoading,
    error: initialError,
  } = useQuery({
    queryKey: withdrawalKeys.data(1, ""),
    queryFn: () => withdrawalService.getWithdrawalData(1, ""),
    staleTime: 2 * 60 * 1000, // 2 minutes - stats change with withdrawals
  });

  // 2. Payment Method Query
  const { data: method } = useQuery({
    queryKey: withdrawalKeys.method(),
    queryFn: withdrawalService.getPrimaryPaymentMethod,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 3. Transactions Query (paginated - only when page/search changes from initial)
  const {
    data: transactionsData,
    isLoading: isTableLoading,
    isFetching: isTableFetching,
  } = useQuery({
    queryKey: withdrawalKeys.transactions(page, debouncedSearch),
    queryFn: () =>
      withdrawalService.getTransactionHistory({
        page,
        search: debouncedSearch,
      }),
    staleTime: 2 * 60 * 1000,
    enabled: page !== 1 || debouncedSearch !== "", // Only fetch if not initial state
  });

  // Determine which data to use
  const stats = initialData?.stats ?? null;
  const settings = initialData?.settings ?? null;
  const transactions =
    page === 1 && debouncedSearch === ""
      ? initialData?.transactions ?? []
      : transactionsData?.data ?? [];
  const totalPages =
    page === 1 && debouncedSearch === ""
      ? initialData?.totalPages ?? 1
      : transactionsData?.totalPages ?? 1;

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

  // Show error alert if initial load fails
  useEffect(() => {
    if (initialError) {
      showAlert("Gagal memuat data withdrawal.", "error");
    }
  }, [initialError, showAlert]);

  return {
    stats,
    method: method ?? null,
    settings,
    transactions,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    isTableLoading: isTableLoading || isTableFetching,
    isProcessing,
    requestPayout,
    cancelTransaction,
    refreshData,
  };
}
