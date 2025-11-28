// src/hooks/useWithdrawal.ts
"use client";

import { useState, useEffect } from "react";
import * as withdrawalService from "@/services/withdrawalService";
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

export function useWithdrawal() {
  const { showAlert } = useAlert();

  // Data States
  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  // Table States (Pagination & Search)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Loading States
  const [isLoading, setIsLoading] = useState(true); // Loading awal
  const [isTableLoading, setIsTableLoading] = useState(false); // Loading pas ganti page/search
  const [isProcessing, setIsProcessing] = useState(false); // Loading pas submit/cancel

  // 1. Fetch Data Awal (Stats & Method)
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [statsData, methodData] = await Promise.all([
          withdrawalService.getWithdrawalStats(),
          withdrawalService.getPrimaryPaymentMethod(),
        ]);
        setStats(statsData);
        setMethod(methodData);
      } catch (error) {
        console.error(error);
        showAlert("Gagal memuat data withdrawal.", "error");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // 2. Fetch Transactions (Triggered by page/search)
  useEffect(() => {
    async function loadTransactions() {
      setIsTableLoading(true);
      try {
        const res = await withdrawalService.getTransactionHistory({
          page,
          search,
        });
        setTransactions(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsTableLoading(false);
      }
    }

    const timeout = setTimeout(loadTransactions, 500); // Debounce search
    return () => clearTimeout(timeout);
  }, [page, search]);

  // Reset page ke 1 kalau search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Action: Request Payout
  const requestPayout = async (amount: number, usedMethod: PaymentMethod) => {
    setIsProcessing(true);
    try {
      await withdrawalService.requestWithdrawal(amount, usedMethod);

      // Update UI Optimis
      if (stats) {
        setStats({
          ...stats,
          availableBalance: stats.availableBalance - amount,
          pendingWithdrawn: stats.pendingWithdrawn + amount,
        });
      }

      // Refresh tabel transaksi biar data baru muncul (opsional: atau push manual)
      setPage(1);
      setSearch(""); // Reset search biar kelihatan data paling baru

      showAlert("Permintaan penarikan berhasil dikirim!", "success");
      return true;
    } catch (error: any) {
      showAlert(error.message || "Gagal memproses penarikan.", "error");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Cancel Transaction
  const cancelTransaction = async (id: string) => {
    const txToCancel = transactions.find((t) => t.id === id);
    if (!txToCancel) return false;

    setIsProcessing(true);
    try {
      await withdrawalService.cancelWithdrawal(id);

      // Update UI Optimis: Balikin saldo
      if (stats) {
        setStats({
          ...stats,
          availableBalance: stats.availableBalance + txToCancel.amount,
          pendingWithdrawn: stats.pendingWithdrawn - txToCancel.amount,
        });
      }

      // Update status di list lokal
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
      );

      showAlert("Permintaan penarikan dibatalkan.", "info");
      return true;
    } catch (error) {
      showAlert("Gagal membatalkan transaksi.", "error");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    stats,
    method,
    transactions,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    isTableLoading,
    isProcessing,
    requestPayout,
    cancelTransaction,
  };
}
