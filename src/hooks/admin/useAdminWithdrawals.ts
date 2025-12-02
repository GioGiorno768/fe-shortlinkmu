import { useState, useEffect, useCallback } from "react";
import * as withdrawalService from "@/services/withdrawalService";
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

  // State Pagination & Filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AdminWithdrawalFilters>({
    status: "all",
    sort: "newest",
    level: "all",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Paralel fetch: List (pake filter) & Stats (global)
      const [trxData, statsData] = await Promise.all([
        withdrawalService.getWithdrawals(page, { ...filters, search }),
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
  }, [page, filters, search, showAlert]);

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
      // Approved -> Completed
      const nextStatus = currentStatus === "pending" ? "approved" : "completed";

      await withdrawalService.updateTransactionStatus(id, nextStatus);

      // Optimistic Update
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t))
      );

      // Pesan Alert yang sesuai
      if (nextStatus === "approved") {
        showAlert("Withdrawal approved. Ready to pay.", "info");
      } else {
        showAlert("Withdrawal marked as Paid/Completed.", "success");
      }
    } catch (e) {
      showAlert("Error updating status.", "error");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await withdrawalService.updateTransactionStatus(id, "rejected", reason);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t))
      );
      showAlert("Withdrawal rejected.", "info");
    } catch (e) {
      showAlert("Error rejecting.", "error");
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
      // 2. Update Status to Completed
      await withdrawalService.updateTransactionStatus(id, "completed");

      // Optimistic Update
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "completed", proofUrl: url } : t
        )
      );
      showAlert("Payment completed & proof attached!", "success");
    } catch (e) {
      showAlert("Error processing payment.", "error");
    }
  };

  return {
    transactions,
    stats,
    isLoading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    filters,
    setFilters, // Export filter controls
    handleApprove,
    handleReject,
    handleAddProof,
    handlePayWithProof,
  };
}
