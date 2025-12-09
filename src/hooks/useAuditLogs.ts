// src/hooks/useAuditLogs.ts
import { useState, useEffect, useCallback } from "react";
import type { AuditLog, AuditLogStats } from "@/types/type";
import {
  getAuditLogs,
  getAuditLogStats,
  getAdminsList,
} from "@/services/auditLogService";
import { useAlert } from "@/hooks/useAlert";

export function useAuditLogs() {
  const { showAlert } = useAlert();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [adminsList, setAdminsList] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [actionType, setActionType] = useState("all");
  const [targetType, setTargetType] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { logs: fetchedLogs, totalPages: pages } = await getAuditLogs({
        page,
        limit: 10,
        search,
        dateRange,
        adminFilter,
        actionType,
        targetType,
        status,
      });

      setLogs(fetchedLogs);
      setTotalPages(pages);
    } catch (error) {
      showAlert("Failed to fetch audit logs", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, dateRange, adminFilter, actionType, targetType, status]);

  const fetchStats = useCallback(async () => {
    try {
      const fetchedStats = await getAuditLogStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const admins = await getAdminsList();
      setAdminsList(admins);
    } catch (error) {
      console.error("Failed to fetch admins list:", error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchStats();
    fetchAdmins();
  }, []);

  return {
    logs,
    stats,
    adminsList,
    isLoading,
    page,
    setPage,
    totalPages,
    // Filters
    search,
    setSearch,
    dateRange,
    setDateRange,
    adminFilter,
    setAdminFilter,
    actionType,
    setActionType,
    targetType,
    setTargetType,
    status,
    setStatus,
  };
}
