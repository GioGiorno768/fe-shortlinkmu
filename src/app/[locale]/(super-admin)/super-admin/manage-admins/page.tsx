"use client";

import { useState } from "react";
import { useManageAdmins } from "@/hooks/useManageAdmins";
import CreateAdminCard from "@/components/dashboard/super-admin/CreateAdminCard";
import SharedStatsGrid from "@/components/dashboard/SharedStatsGrid";
import AdminFilterBar from "@/components/dashboard/super-admin/AdminFilterBar";
import AdminListCard from "@/components/dashboard/super-admin/AdminListCard";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import Pagination from "@/components/dashboard/Pagination";
import { Loader2, Users, UserCheck, Ban } from "lucide-react";

export default function ManageAdminsPage() {
  const {
    admins,
    stats,
    totalPages,
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
  } = useManageAdmins();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [adminToSuspend, setAdminToSuspend] = useState<{
    id: string;
    name: string;
    currentStatus: "active" | "suspended";
  } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setAdminToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteAdmin(adminToDelete.id);
      setDeleteModalOpen(false);
      setAdminToDelete(null);
    }
  };

  const handleSuspendClick = (
    id: string,
    name: string,
    currentStatus: "active" | "suspended"
  ) => {
    setAdminToSuspend({ id, name, currentStatus });
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (adminToSuspend) {
      toggleStatus(adminToSuspend.id, adminToSuspend.currentStatus);
      setSuspendModalOpen(false);
      setAdminToSuspend(null);
    }
  };

  // Format stats for SharedStatsGrid
  const statsData = stats
    ? [
        {
          id: "total-admins",
          title: "Total Admins",
          value: stats.totalAdmins.count.toString(),
          subLabel: "registered",
          icon: Users,
          color: "blue" as const,
        },
        {
          id: "active-today",
          title: "Active Today",
          value: stats.activeToday.count.toString(),
          subLabel: "online now",
          icon: UserCheck,
          color: "green" as const,
        },
        {
          id: "suspended",
          title: "Suspended",
          value: stats.suspendedAdmins.count.toString(),
          subLabel: "restricted",
          icon: Ban,
          color: "red" as const,
        },
      ]
    : [];

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-shortblack mb-2">
          Manage Admins
        </h1>
        <p className="text-grays text-base">
          Create and manage platform administrators
        </p>
      </div>

      {/* Stats Cards */}
      <SharedStatsGrid cards={statsData} isLoading={isLoading} columns={3} />

      {/* Create Admin Card */}
      <CreateAdminCard onCreate={createAdmin} isCreating={isCreating} />

      {/* Filter Bar */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
      />

      {/* Admin List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-shortblack">
            Administrators ({admins.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-grays text-lg">No admins found.</p>
            <p className="text-grays text-sm mt-2">
              Try adjusting your filters or create a new admin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {admins.map((admin) => (
              <AdminListCard
                key={admin.id}
                admin={admin}
                onToggleStatus={(id, status) =>
                  handleSuspendClick(id, admin.name, status)
                }
                onDelete={(id) => handleDeleteClick(id, admin.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Admin"
        description={`Are you sure you want to delete admin "${adminToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
      />

      {/* Suspend/Unsuspend Confirmation Modal */}
      <ConfirmationModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
        title={
          adminToSuspend?.currentStatus === "suspended"
            ? "Unsuspend Admin"
            : "Suspend Admin"
        }
        description={
          adminToSuspend?.currentStatus === "suspended"
            ? `Are you sure you want to unsuspend admin "${adminToSuspend?.name}"? They will regain access to the platform.`
            : `Are you sure you want to suspend admin "${adminToSuspend?.name}"? They will lose access to the platform.`
        }
        confirmLabel={
          adminToSuspend?.currentStatus === "suspended"
            ? "Unsuspend"
            : "Suspend"
        }
        cancelLabel="Cancel"
        type={
          adminToSuspend?.currentStatus === "suspended" ? "success" : "warning"
        }
      />
    </div>
  );
}
