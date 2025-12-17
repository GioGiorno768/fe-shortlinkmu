// src/services/notificationService.ts
import type {
  NotificationItem,
  Role,
  NotificationCategory,
} from "@/types/type";
import apiClient from "./apiClient";

/**
 * Map backend notification to frontend NotificationItem type
 */
function mapNotification(notification: any): NotificationItem {
  const data = notification.data || {};

  // Map backend type to frontend type
  const typeMap: Record<string, NotificationItem["type"]> = {
    info: "info",
    success: "success",
    warning: "warning",
    danger: "alert",
    alert: "alert",
  };

  // Map category or default to "system"
  const category: NotificationCategory = data.category || "system";

  return {
    id: notification.id,
    title: data.title || "Notification",
    message: data.message || "",
    type: typeMap[data.type] || "info",
    category: category,
    isRead: notification.read_at !== null,
    timestamp: notification.created_at,
    actionUrl: data.url || undefined,
  };
}

/**
 * Get all notifications for the logged-in user
 * @param category - Filter by category (system, payment, link, account, event) or "all" for no filter
 */
export async function getNotifications(
  category?: string
): Promise<NotificationItem[]> {
  try {
    const params = category && category !== "all" ? { category } : {};
    const response = await apiClient.get("/notifications", { params });

    // Handle both array response (new) and paginated response (old)
    const notifications = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.data || [];

    return notifications.map(mapNotification);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiClient.get("/notifications/unread");
    return response.data.data?.unread_count ?? 0;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(id: string): Promise<boolean> {
  try {
    await apiClient.post(`/notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<boolean> {
  try {
    await apiClient.post("/notifications/read-all");
    return true;
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/notifications/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return false;
  }
}
