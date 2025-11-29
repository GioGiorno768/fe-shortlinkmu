// src/hooks/useNotifications.ts
"use client";

import { useState, useEffect } from "react";
import * as notifService from "@/services/notificationService";
// Import tipe extended dari service (atau dari types.ts kalau udah dipindah)
import type { ExtendedNotificationItem } from "@/services/notificationService";

export function useNotifications() {
  const [notifications, setNotifications] = useState<
    ExtendedNotificationItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const data = await notifService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Gagal load notifikasi", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Actions
  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notifService.markAsRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notifService.markAllAsRead();
    } catch (e) {
      console.error(e);
    }
  };

  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notifService.deleteNotification(id);
    } catch (e) {
      console.error(e);
    }
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
