"use client";

import { useState, useEffect, useCallback } from "react";
import * as notifService from "@/services/notificationService";
import type { NotificationItem } from "@/types/type";

/**
 * Notification hook with client-side caching
 * - Fetches ALL notifications once
 * - Filters client-side (instant, no loading per filter)
 * - Revalidates on refresh() call
 */
export function useNotifications() {
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");

  // Fetch all notifications (called once on mount)
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch ALL notifications (no category filter to backend)
      const data = await notifService.getNotifications();
      setAllNotifications(data);
    } catch (error) {
      console.error("Gagal load notifikasi", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filter client-side (INSTANT - no API call)
  const filteredNotifications =
    category === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.category === category);

  // Change filter (instant, no loading)
  const filterByCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  // Refresh - refetch from server
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification as read
  const markRead = async (id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await notifService.markAsRead(id);
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await notifService.markAllAsRead();
  };

  // Remove notification
  const removeNotification = async (id: string) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
    await notifService.deleteNotification(id);
  };

  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  return {
    notifications: filteredNotifications, // Already filtered
    allNotifications, // Raw data if needed
    unreadCount,
    isLoading,
    category,
    markRead,
    markAllRead,
    removeNotification,
    filterByCategory,
    refresh,
  };
}
