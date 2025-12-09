// src/services/auditLogService.ts
import type { AuditLog, AuditLogStats } from "@/types/type";

// Mock data untuk testing
const mockAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    adminId: "admin-001",
    adminName: "John Doe",
    adminRole: "super-admin",
    action: "suspend",
    targetType: "user",
    targetId: "user-123",
    targetName: "jane_smith",
    description: "Suspended user for violating terms of service",
    status: "success",
    ipAddress: "192.168.1.100",
    location: "Jakarta, Indonesia",
    metadata: {
      reason: "Spam activity detected",
      oldValue: "active",
      newValue: "suspended",
    },
  },
  {
    id: "log-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    adminId: "admin-002",
    adminName: "Sarah Johnson",
    adminRole: "admin",
    action: "approve",
    targetType: "withdrawal",
    targetId: "withdraw-456",
    targetName: "$150.00 withdrawal",
    description: "Approved withdrawal request from user_123",
    status: "success",
    ipAddress: "192.168.1.101",
    location: "Bandung, Indonesia",
  },
  {
    id: "log-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    adminId: "admin-001",
    adminName: "John Doe",
    adminRole: "super-admin",
    action: "delete",
    targetType: "link",
    targetId: "link-789",
    targetName: "short.link/abc123",
    description: "Deleted malicious link",
    status: "success",
    ipAddress: "192.168.1.100",
    location: "Jakarta, Indonesia",
    metadata: {
      reason: "Phishing attempt",
      originalUrl: "https://malicious-site.com",
    },
  },
  {
    id: "log-004",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    adminId: "admin-003",
    adminName: "Mike Wilson",
    adminRole: "admin",
    action: "update",
    targetType: "user",
    targetId: "user-456",
    targetName: "bob_jones",
    description: "Updated user account level",
    status: "success",
    ipAddress: "192.168.1.102",
    location: "Surabaya, Indonesia",
    metadata: {
      oldValue: "level1",
      newValue: "level2",
    },
  },
  {
    id: "log-005",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    adminId: "admin-002",
    adminName: "Sarah Johnson",
    adminRole: "admin",
    action: "reject",
    targetType: "withdrawal",
    targetId: "withdraw-789",
    targetName: "$500.00 withdrawal",
    description:
      "Rejected withdrawal request due to insufficient documentation",
    status: "success",
    ipAddress: "192.168.1.101",
    location: "Bandung, Indonesia",
    metadata: {
      reason: "Missing bank verification",
    },
  },
  {
    id: "log-006",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    adminId: "admin-001",
    adminName: "John Doe",
    adminRole: "super-admin",
    action: "create",
    targetType: "admin",
    targetId: "admin-004",
    targetName: "new_admin",
    description: "Created new admin account",
    status: "success",
    ipAddress: "192.168.1.100",
    location: "Jakarta, Indonesia",
  },
  {
    id: "log-007",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    adminId: "admin-003",
    adminName: "Mike Wilson",
    adminRole: "admin",
    action: "block",
    targetType: "link",
    targetId: "link-999",
    targetName: "short.link/xyz789",
    description: "Blocked link due to abuse report",
    status: "success",
    ipAddress: "192.168.1.102",
    location: "Surabaya, Indonesia",
    metadata: {
      reason: "Multiple abuse reports",
      reportCount: "12",
    },
  },
  {
    id: "log-008",
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    adminId: "admin-002",
    adminName: "Sarah Johnson",
    adminRole: "admin",
    action: "delete",
    targetType: "announcement",
    targetId: "announce-123",
    targetName: "System Maintenance Notice",
    description: "Deleted expired announcement",
    status: "failed",
    ipAddress: "192.168.1.101",
    location: "Bandung, Indonesia",
    metadata: {
      error: "Permission denied",
    },
  },
];

const mockStats: AuditLogStats = {
  totalActivitiesToday: 847,
  activeAdmins: 12,
  criticalActions: 45,
  failedActions: 8,
};

interface GetAuditLogsParams {
  page: number;
  limit: number;
  search?: string;
  dateRange?: string;
  adminFilter?: string;
  actionType?: string;
  targetType?: string;
  status?: string;
}

export const getAuditLogs = async (
  params: GetAuditLogsParams
): Promise<{ logs: AuditLog[]; totalPages: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredLogs = [...mockAuditLogs];

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.description.toLowerCase().includes(searchLower) ||
        log.targetName.toLowerCase().includes(searchLower) ||
        log.adminName.toLowerCase().includes(searchLower)
    );
  }

  if (params.adminFilter && params.adminFilter !== "all") {
    filteredLogs = filteredLogs.filter(
      (log) => log.adminId === params.adminFilter
    );
  }

  if (params.actionType && params.actionType !== "all") {
    filteredLogs = filteredLogs.filter(
      (log) => log.action === params.actionType
    );
  }

  if (params.targetType && params.targetType !== "all") {
    filteredLogs = filteredLogs.filter(
      (log) => log.targetType === params.targetType
    );
  }

  if (params.status && params.status !== "all") {
    filteredLogs = filteredLogs.filter((log) => log.status === params.status);
  }

  if (params.dateRange && params.dateRange !== "all") {
    const now = Date.now();
    let cutoff = now;

    if (params.dateRange === "today") {
      cutoff = now - 1000 * 60 * 60 * 24;
    } else if (params.dateRange === "week") {
      cutoff = now - 1000 * 60 * 60 * 24 * 7;
    } else if (params.dateRange === "month") {
      cutoff = now - 1000 * 60 * 60 * 24 * 30;
    }

    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp).getTime() > cutoff
    );
  }

  const totalPages = Math.ceil(filteredLogs.length / params.limit);
  const startIndex = (params.page - 1) * params.limit;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + params.limit
  );

  return { logs: paginatedLogs, totalPages };
};

export const getAuditLogStats = async (): Promise<AuditLogStats> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockStats;
};

export const getAdminsList = async (): Promise<
  Array<{ id: string; name: string }>
> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const uniqueAdmins = Array.from(
    new Set(mockAuditLogs.map((log) => log.adminId))
  ).map((id) => {
    const log = mockAuditLogs.find((l) => l.adminId === id)!;
    return { id: log.adminId, name: log.adminName };
  });

  return uniqueAdmins;
};
