import { useState, useEffect, useCallback } from "react";
import { WithdrawalDetail } from "@/types/type";
import * as withdrawalService from "@/services/withdrawalService";
import { useAlert } from "@/hooks/useAlert";

export function useWithdrawalDetail(id: string) {
  const [data, setData] = useState<WithdrawalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await withdrawalService.getWithdrawalDetail(id);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch withdrawal detail:", error);
      showAlert("Failed to load transaction details.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [id, showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async () => {
    if (!data) return;
    try {
      await withdrawalService.updateTransactionStatus(data.id, "approved");
      setData((prev) => (prev ? { ...prev, status: "approved" } : null));
      showAlert("Transaction approved successfully!", "success");
    } catch (error) {
      showAlert("Failed to approve transaction.", "error");
    }
  };

  const handleReject = async (reason: string) => {
    if (!data) return;
    try {
      await withdrawalService.updateTransactionStatus(
        data.id,
        "rejected",
        reason
      );
      setData((prev) =>
        prev ? { ...prev, status: "rejected", rejectionReason: reason } : null
      );
      showAlert("Transaction rejected.", "success");
    } catch (error) {
      showAlert("Failed to reject transaction.", "error");
    }
  };

  const handlePayWithProof = async (proofUrl: string) => {
    if (!data) return;
    try {
      await withdrawalService.saveProofLink(data.id, proofUrl);
      await withdrawalService.updateTransactionStatus(data.id, "completed");
      setData((prev) =>
        prev ? { ...prev, status: "completed", proofUrl } : null
      );
      showAlert("Payment completed & proof attached!", "success");
    } catch (error) {
      showAlert("Failed to process payment.", "error");
    }
  };

  return {
    data,
    isLoading,
    handleApprove,
    handleReject,
    handlePayWithProof,
    refresh: fetchData,
  };
}
