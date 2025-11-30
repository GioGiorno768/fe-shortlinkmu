"use client";

import { useState, useEffect } from "react";
import * as notifService from "@/services/notificationService";
import type { NotificationItem, Role } from "@/types/type";

// Terima parameter role
export function useNotifications(role: Role = "member") {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true); // Reset loading pas role ganti (opsional)
      try {
        // Kirim role ke service
        const data = await notifService.getNotifications(role);
        setNotifications(data);
      } catch (error) {
        console.error("Gagal load notifikasi", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [role]); // Re-fetch kalau role berubah

  // Actions (Sama kayak sebelumnya)
  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await notifService.markAsRead(id);
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await notifService.markAllAsRead();
  };

  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await notifService.deleteNotification(id);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    removeNotification,
  };
}
