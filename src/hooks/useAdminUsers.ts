"use client";

import { useState, useEffect } from "react";
import * as adminUserService from "@/services/adminUserService";
import type { AdminUser, UserStatus, AdminUserStats } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

export function useAdminUsers() {
  const { showAlert } = useAlert();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null); // <--- STATE BARU
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        // Fetch Paralel: Data Tabel & Data Stats
        const [listRes, statsRes] = await Promise.all([
          adminUserService.getUsers({ page, search, status: statusFilter }),
          adminUserService.getUserStats(), // <--- Fetch Stats
        ]);

        setUsers(listRes.data);
        setTotalPages(listRes.totalPages);
        setStats(statsRes); // <--- Set State
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

  // Reset page kalau filter ganti
  useEffect(() => {
    setPage(1);
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

  return {
    users,
    stats,
    totalPages,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    toggleStatus,
  };
}
