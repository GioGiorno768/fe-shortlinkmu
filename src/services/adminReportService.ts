import apiClient from "./apiClient";
import type { AbuseReport, AdminReportStats } from "@/types/type";

// Transform API response to frontend type
function transformReport(apiReport: any): AbuseReport {
  return {
    id: String(apiReport.id),
    targetLink: apiReport.link
      ? {
          id: String(apiReport.link.id),
          shortUrl: `short.link/${apiReport.link.code}`,
          originalUrl: apiReport.link.original_url,
          owner:
            apiReport.link.user?.name ||
            apiReport.link.user?.email ||
            "Unknown",
        }
      : {
          id: "unknown",
          shortUrl: apiReport.link_url,
          originalUrl: apiReport.link_url,
          owner: "Unknown",
        },
    reporter: {
      ip: apiReport.ip_address,
      name: apiReport.email || undefined,
    },
    reason: apiReport.reason,
    description: apiReport.details || "",
    status: apiReport.status || "pending",
    date: apiReport.created_at,
  };
}

export async function getReports(
  filter: string = "all",
  page: number = 1
): Promise<{ data: AbuseReport[]; totalPages: number }> {
  try {
    const response = await apiClient.get("/admin/reports", {
      params: {
        status: filter,
        page,
        per_page: 10,
      },
    });

    // Backend paginatedResponse format:
    // { status, message, data: [...items], meta: { last_page, ... } }
    const items = response.data.data || [];
    const meta = response.data.meta || {};
    const lastPage = meta.last_page || 1;

    return {
      data: items.map(transformReport),
      totalPages: lastPage,
    };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { data: [], totalPages: 1 };
  }
}

export async function getReportStats(): Promise<AdminReportStats> {
  try {
    const response = await apiClient.get("/admin/reports/stats");
    const stats = response.data.data;

    return {
      pendingCount: stats.pending_count || 0,
      resolvedToday: stats.resolved_today || 0,
      totalReports: stats.total_reports || 0,
    };
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return {
      pendingCount: 0,
      resolvedToday: 0,
      totalReports: 0,
    };
  }
}

// Action: Block Link (Sekaligus Resolve Report)
export async function blockLinkFromReport(
  reportId: string,
  linkId: string
): Promise<boolean> {
  try {
    await apiClient.patch(`/admin/reports/${reportId}/block-link`);
    return true;
  } catch (error) {
    console.error(`Error blocking link from report ${reportId}:`, error);
    return false;
  }
}

// Action: Ignore Report
export async function ignoreReport(reportId: string): Promise<boolean> {
  try {
    await apiClient.patch(`/admin/reports/${reportId}/ignore`);
    return true;
  } catch (error) {
    console.error(`Error ignoring report ${reportId}:`, error);
    return false;
  }
}

// Action: Mark Resolved (Tanpa Block)
export async function resolveReport(reportId: string): Promise<boolean> {
  try {
    await apiClient.patch(`/admin/reports/${reportId}/resolve`);
    return true;
  } catch (error) {
    console.error(`Error resolving report ${reportId}:`, error);
    return false;
  }
}

// Action: Delete Report
export async function deleteReport(reportId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/admin/reports/${reportId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting report ${reportId}:`, error);
    return false;
  }
}
