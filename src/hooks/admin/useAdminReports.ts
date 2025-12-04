import { useState, useEffect, useCallback } from "react";
import * as reportService from "@/services/adminReportService";
import { useAlert } from "@/hooks/useAlert";
import type { AbuseReport, AdminReportStats } from "@/types/type";

export function useAdminReports() {
  const { showAlert } = useAlert();
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [stats, setStats] = useState<AdminReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reportData, stat] = await Promise.all([
        reportService.getReports(filter, page),
        reportService.getReportStats(),
      ]);
      setReports(reportData.data);
      setTotalPages(reportData.totalPages);
      setStats(stat);
    } catch (e) {
      showAlert("Gagal memuat laporan.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleResolve = async (reportId: string) => {
    try {
      await reportService.resolveReport(reportId);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
      );
      showAlert("Laporan ditandai selesai.", "success");
    } catch (e) {
      showAlert("Gagal menyelesaikan laporan.", "error");
    }
  };

  const handleIgnore = async (reportId: string) => {
    try {
      await reportService.ignoreReport(reportId);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "ignored" } : r))
      );
      showAlert("Laporan diabaikan.", "info");
    } catch (e) {
      showAlert("Gagal mengabaikan laporan.", "error");
    }
  };

  return {
    reports,
    stats,
    isLoading,
    filter,
    setFilter,
    handleResolve,
    handleIgnore,
    page,
    setPage,
    totalPages,
  };
}
