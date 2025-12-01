"use client";

import UserTable from "@/components/dashboard/admin/users/UserTable";
import UserStatsRow from "@/components/dashboard/admin/users/UserStatsRow";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function ManageUsersPage() {
  // Panggil Hook Sakti kita 🪄
  // Ambil semua data & fungsi kontrol dari sini
  const {
    users,
    stats,
    isLoading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    toggleStatus,
  } = useAdminUsers();

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* 1. Quick Stats Row (Head-up Display) */}
      {/* Nampilin Total User, Active, Banned, Balance */}
      <UserStatsRow stats={stats} isLoading={isLoading} />

      {/* 2. Main User Table (Core Data) */}
      {/* Tabel lengkap dengan fitur search, filter, dan action */}
      <UserTable
        users={users}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}
