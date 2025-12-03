import { useState, useEffect, useCallback } from "react";
import type { AdminAnnouncement, AdminAnnouncementStats } from "@/types/type";
import {
  getAnnouncements,
  getAnnouncementStats,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/adminAnnouncementService";

export function useAdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [stats, setStats] = useState<AdminAnnouncementStats>({
    activeCount: 0,
    totalCount: 0,
    scheduledCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        getAnnouncements(),
        getAnnouncementStats(),
      ]);
      setAnnouncements(data);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (
    data: Omit<AdminAnnouncement, "id" | "createdAt">
  ) => {
    setIsSubmitting(true);
    try {
      await createAnnouncement(data);
      await fetchData();
    } catch (error) {
      console.error("Failed to create announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<AdminAnnouncement>) => {
    setIsSubmitting(true);
    try {
      await updateAnnouncement(id, data);
      await fetchData();
    } catch (error) {
      console.error("Failed to update announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setIsSubmitting(true);
    try {
      await deleteAnnouncement(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // Optimistic update
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    try {
      await updateAnnouncement(id, { status: newStatus });
      // Refresh stats quietly
      const newStats = await getAnnouncementStats();
      setStats(newStats);
    } catch (error) {
      // Revert if failed
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: currentStatus as any } : a
        )
      );
      console.error("Failed to toggle status:", error);
    }
  };

  return {
    announcements,
    stats,
    isLoading,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
    refresh: fetchData,
  };
}
