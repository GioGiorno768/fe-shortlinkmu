"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AnnouncementStatsRow from "@/components/dashboard/admin/announcements/AnnouncementStatsRow";
import AnnouncementList from "@/components/dashboard/admin/announcements/AnnouncementList";
import CreateAnnouncementModal from "@/components/dashboard/admin/announcements/CreateAnnouncementModal";
import { useAdminAnnouncements } from "@/hooks/useAdminAnnouncements";
import type { AdminAnnouncement } from "@/types/type";

export default function AdminAnnouncementsPage() {
  const {
    announcements,
    stats,
    isLoading,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  } = useAdminAnnouncements();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAnnouncement | null>(
    null
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminAnnouncement) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingItem) {
      await handleUpdate(editingItem.id, data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <div className="space-y-8 pb-24 text-[10px]">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2.4em] font-bold text-shortblack">
            Announcements
          </h1>
          <p className="text-gray-400 text-[1.4em]">
            Manage banners and updates for user dashboard.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-shortblack text-white px-6 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Stats Row */}
      <AnnouncementStatsRow stats={stats} isLoading={isLoading} />

      {/* Main List */}
      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal */}
      <CreateAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
