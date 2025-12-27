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
  const [isAllSelected, setIsAllSelected] = useState(false); // <--- New State
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
    setIsAllSelected(false); // Reset select all
  }, [search, statusFilter]);

  const toggleStatus = async (
    id: string,
    currentStatus: UserStatus,
    reason?: string
  ) => {
    // Suspended <-> Active toggle (no more "process" status)
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await adminUserService.updateUserStatus(id, newStatus, reason);
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showAlert(
        `User ${newStatus === "active" ? "activated" : "suspended"}.`,
        "success"
      );
    } catch (error) {
      showAlert("Gagal update status.", "error");
    }
  };

  // --- SELECTION HANDLERS ---
  const toggleSelection = (id: string) => {
    if (isAllSelected) {
      // If we were in "Select All" mode, clicking one row breaks it.
      // Strategy: Deselect everything, then select just this one?
      // Or: Just turn off "Select All" and start fresh?
      // Let's just turn off Select All and select this one.
      setIsAllSelected(false);
      setSelectedIds(new Set([id]));
      return;
    }

    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (isAllSelected) {
      // Deselect All
      setIsAllSelected(false);
      setSelectedIds(new Set());
    } else {
      // Select All (Virtual)
      setIsAllSelected(true);
      setSelectedIds(new Set()); // Clear manual IDs because "All" covers it
      showAlert(
        `Mode Select All aktif: ${totalCount} user terpilih.`,
        "success"
      );
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsAllSelected(false);
  };

  const sendMessage = async (
    subject: string,
    message: string,
    type: "warning" | "info"
  ) => {
    setIsSending(true);
    try {
      await adminUserService.sendNotification({
        userIds: Array.from(selectedIds),
        selectAll: isAllSelected,
        filters: { search, status: statusFilter },
        subject,
        message,
        type,
      });

      const count = isAllSelected ? totalCount : selectedIds.size;
      showAlert(`Pesan dikirim ke ${count} user!`, "success");
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
    isAllSelected, // <--- Export new state
    toggleSelection,
    selectAll,
    clearSelection,
    sendMessage,
    isSending,
  };
}
