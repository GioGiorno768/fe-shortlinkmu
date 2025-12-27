import { useState, useEffect, useCallback } from "react";
import * as withdrawalService from "@/services/withdrawalService";
import { getUser } from "@/services/authService";
import { useAlert } from "@/hooks/useAlert";
import type {
  RecentWithdrawal,
  AdminWithdrawalStats,
  AdminWithdrawalFilters,
} from "@/types/type";

export function useAdminWithdrawals() {
  const { showAlert } = useAlert();
  const [transactions, setTransactions] = useState<RecentWithdrawal[]>([]);
  const [stats, setStats] = useState<AdminWithdrawalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID for checking if current admin is the processor
  const currentUser = getUser();
  const currentUserId = currentUser?.id;

  // State Pagination & Filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AdminWithdrawalFilters>({
    search: "",
    status: "all",
    sort: "newest",
    level: "all",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Paralel fetch: List (pake filter) & Stats (global)
      const [trxData, statsData] = await Promise.all([
        withdrawalService.getWithdrawals(page, filters),
        withdrawalService.getWithdrawalStats(),
      ]);
      setTransactions(trxData.data);
      setTotalPages(trxData.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      showAlert("Gagal memuat data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, showAlert]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Actions
  const handleApprove = async (id: string, currentStatus: string) => {
    try {
      // Logic Toggle Status:
      // Pending -> Approved
      // Approved -> Paid
      const nextStatus = currentStatus === "pending" ? "approved" : "paid";

      await withdrawalService.updateTransactionStatus(id, nextStatus as any);

      // Optimistic Update
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t))
      );

      // Pesan Alert yang sesuai
      if (nextStatus === "approved") {
        showAlert("Withdrawal approved. Ready to pay.", "info");
      } else {
        showAlert("Withdrawal marked as Paid.", "success");
      }
    } catch (e: any) {
      // Check if it's a race condition error (403 - another admin already processed)
      const errorMessage = e?.response?.data?.message || e?.message || "";

      if (
        e?.response?.status === 403 &&
        (errorMessage.includes("sedang diproses") ||
          errorMessage.includes("sudah diproses"))
      ) {
        // Another admin already processed this withdrawal
        showAlert(
          "Pembayaran sudah diproses oleh admin lain. Memuat ulang data...",
          "warning"
        );
        // Auto-refresh after 1 second
        setTimeout(() => {
          fetchData();
        }, 1000);
      } else {
        showAlert("Error updating status.", "error");
      }
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await withdrawalService.updateTransactionStatus(id, "rejected", reason);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t))
      );
      showAlert("Withdrawal rejected.", "info");
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || "";

      if (
        e?.response?.status === 403 &&
        (errorMessage.includes("sedang diproses") ||
          errorMessage.includes("sudah diproses"))
      ) {
        showAlert(
          "Pembayaran sudah diproses oleh admin lain. Memuat ulang data...",
          "warning"
        );
        setTimeout(() => fetchData(), 1000);
      } else {
        showAlert("Error rejecting.", "error");
      }
    }
  };

  const handleAddProof = async (id: string, url: string) => {
    try {
      await withdrawalService.saveProofLink(id, url);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, proofUrl: url } : t))
      );
      showAlert("Proof link attached successfully.", "success");
    } catch (e) {
      showAlert("Error saving proof.", "error");
    }
  };

  const handlePayWithProof = async (id: string, url: string) => {
    try {
      // 1. Save Proof
      await withdrawalService.saveProofLink(id, url);
      // 2. Update Status to Paid
      await withdrawalService.updateTransactionStatus(id, "paid");

      // Optimistic Update
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "paid", proofUrl: url } : t
        )
      );
      showAlert("Payment completed & proof attached!", "success");
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || "";

      if (
        e?.response?.status === 403 &&
        (errorMessage.includes("sedang diproses") ||
          errorMessage.includes("sudah diproses"))
      ) {
        showAlert(
          "Pembayaran sudah diproses oleh admin lain. Memuat ulang data...",
          "warning"
        );
        setTimeout(() => fetchData(), 1000);
      } else {
        showAlert("Error processing payment.", "error");
      }
    }
  };

  return {
    transactions,
    stats,
    isLoading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters, // Export filter controls
    handleApprove,
    handleReject,
    handleAddProof,
    handlePayWithProof,
    currentUserId, // For checking if current admin is the processor
  };
}
