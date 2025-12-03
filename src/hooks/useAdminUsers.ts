"use client";

import { useState, useEffect } from "react";
import * as adminUserService from "@/services/adminUserService";
import type { AdminUser, UserStatus, AdminUserStats } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

export function useAdminUsers() {
  const { showAlert } = useAlert();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // <--- Total filtered users
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        // Fetch Paralel: Data Tabel & Data Stats
        const [listRes, statsRes] = await Promise.all([
          adminUserService.getUsers({ page, search, status: statusFilter }),
          adminUserService.getUserStats(),
        ]);

        setUsers(listRes.data);
        setTotalPages(listRes.totalPages);
        setTotalCount(listRes.totalCount); // <--- Set Total Count
        setStats(statsRes);
      } catch (err) {
        console.error(err);
        showAlert("Gagal memuat data user.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter]); // Re-fetch kalau filter berubah

  // Reset page & selection kalau filter ganti
  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [search, statusFilter]);

  const toggleStatus = async (id: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === "active" ? "process" : "active";
    try {
      await adminUserService.updateUserStatus(id, newStatus);
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showAlert(
        `User ${newStatus === "active" ? "diaktifkan" : "sedang diproses"}.`,
        "success"
      );
    } catch (error) {
      showAlert("Gagal update status.", "error");
    }
  };

  // --- SELECTION HANDLERS ---
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = async () => {
    // If all currently filtered users are selected, deselect all
    if (selectedIds.size === totalCount && totalCount > 0) {
      setSelectedIds(new Set());
    } else {
      // Select ALL users matching filter (across all pages)
      try {
        const allIds = await adminUserService.getAllUserIds({
          search,
          status: statusFilter,
        });
        setSelectedIds(new Set(allIds));
        showAlert(`${allIds.length} user terpilih.`, "success");
      } catch (error) {
        showAlert("Gagal memilih semua user.", "error");
      }
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const sendMessage = async (
    subject: string,
    message: string,
    type: "warning" | "info"
  ) => {
    setIsSending(true);
    try {
      await adminUserService.sendNotification(
        Array.from(selectedIds),
        subject,
        message,
        type
      );
      showAlert(`Pesan terkirim ke ${selectedIds.size} user!`, "success");
      clearSelection();
    } catch (error) {
      showAlert("Gagal mengirim pesan.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return {
    users,
    stats,
    totalPages,
    totalCount, // <--- Export
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    toggleStatus,
    // Selection
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    sendMessage,
    isSending,
  };
}
