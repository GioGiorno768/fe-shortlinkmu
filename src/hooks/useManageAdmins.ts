"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/adminService";
import type { Admin, AdminStats } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

export function useManageAdmins() {
  const { showAlert } = useAlert();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Create Admin State
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [listRes, statsRes] = await Promise.all([
          adminService.getAdmins({
            page,
            search,
            status: statusFilter,
            role: roleFilter,
          }),
          adminService.getAdminStats(),
        ]);

        setAdmins(listRes.data);
        setTotalPages(listRes.totalPages);
        setTotalCount(listRes.totalCount);
        setStats(statsRes);
      } catch (err) {
        console.error(err);
        showAlert("Failed to load admins data.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, roleFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, roleFilter]);

  const createAdmin = async (data: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }) => {
    setIsCreating(true);
    try {
      const newAdmin = await adminService.createAdmin(data);
      setAdmins((prev) => [newAdmin, ...prev]);
      showAlert("Admin created successfully!", "success");
      return true;
    } catch (error) {
      showAlert("Failed to create admin.", "error");
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (
    id: string,
    currentStatus: "active" | "suspended"
  ) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await adminService.updateAdminStatus(id, newStatus);
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      showAlert(
        `Admin ${newStatus === "active" ? "activated" : "suspended"}.`,
        "success"
      );
    } catch (error) {
      showAlert("Failed to update status.", "error");
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      await adminService.deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      showAlert("Admin deleted successfully.", "success");
    } catch (error) {
      showAlert("Failed to delete admin.", "error");
    }
  };

  return {
    admins,
    stats,
    totalPages,
    totalCount,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    createAdmin,
    isCreating,
    toggleStatus,
    deleteAdmin,
  };
}
