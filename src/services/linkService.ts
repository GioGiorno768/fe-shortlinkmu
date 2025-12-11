// src/services/linkService.ts
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
  FilterByType,
  SortByType,
  AdLevel,
} from "@/types/type";
import apiClient from "./apiClient";

export interface GeneratedLinkData {
  shortUrl: string;
  originalUrl: string;
  code: string;
  isGuest: boolean;
  earnPerClick: number;
}

interface GetLinksParams {
  page?: number;
  search?: string;
  filterBy?: FilterByType;
  sortBy?: SortByType;
}

export const getLinks = async (
  params: GetLinksParams
): Promise<{ data: Shortlink[]; totalPages: number }> => {
  try {
    // Map frontend filter/sort to backend params
    let backendFilter = undefined;
    let backendStatus = undefined;

    switch (params.filterBy) {
      case "topLinks":
        backendFilter = "top_links";
        break;
      case "validViews":
        backendFilter = "top_valid";
        break;
      case "totalEarning":
        backendFilter = "top_earned";
        break;
      case "avgCPM":
        backendFilter = "avg_cpm";
        break;
      case "linkPassword":
        backendFilter = "link_password";
        break;
      case "dateExpired":
        // If user wants to see expired links
        backendFilter = "expired";
        break;
      case "linkDisabled":
        backendStatus = "disabled";
        break;
      case "linkEnabled":
        backendStatus = "active";
        break;
      // 'date' uses default backend sorting (latest)
      default:
        break;
    }

    const response = await apiClient.get("/links", {
      params: {
        page: params.page || 1,
        search: params.search,
        filter: backendFilter,
        status: backendStatus,
      },
    });

    const apiData = response.data.data;
    const meta = response.data.meta || { last_page: 1 };

    // Format response to match Shortlink type
    const formattedLinks: Shortlink[] = apiData.map((link: any) => ({
      id: link.id,
      title: link.title || "Untitled",
      shortUrl: link.short_url.replace(
        "http://localhost:8000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ),
      originalUrl: link.original_url,
      dateCreated: link.created_at,
      validViews: link.valid_views || 0,
      totalEarning: parseFloat(link.total_earned || 0),
      totalClicks: link.total_views || 0,
      averageCPM: parseFloat(link.calculated_cpm || 0),
      adsLevel: (link.ad_level ? `level${link.ad_level}` : "level1") as AdLevel,
      password: link.password, // Add this line
      passwordProtected: !!link.password,
      status: link.status,
      dateExpired: link.expired_at,
    }));

    return {
      data: formattedLinks,
      totalPages: meta.last_page,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch links");
  }
};

export const createLink = async (
  data: CreateLinkFormData
): Promise<Shortlink> => {
  try {
    const payload = {
      original_url: data.url,
      title: data.title,
      alias: data.alias || undefined,
      password: data.password || undefined,
      expired_at: data.expiresAt || undefined,
      ad_level: data.adsLevel
        ? parseInt(data.adsLevel.replace("level", ""))
        : 1,
    };

    const response = await apiClient.post("/links", payload);
    const link = response.data.data;

    return {
      id: link.code, // Assuming code can act as temporary ID for frontend
      title: link.title || "Untitled",
      shortUrl: link.short_url.replace(
        "http://localhost:8000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ),
      originalUrl: link.original_url,
      dateCreated: new Date().toISOString(),
      validViews: 0,
      totalEarning: 0,
      totalClicks: 0,
      averageCPM: 0,
      adsLevel: data.adsLevel,
      passwordProtected: !!data.password,
      status: "active",
      dateExpired: data.expiresAt,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create link");
  }
};

export const updateLink = async (
  id: string,
  data: EditableLinkData
): Promise<Shortlink> => {
  try {
    const payload = {
      alias: data.alias,
      password: data.password || null, // Send null to remove password
      expired_at: data.expiresAt || null,
      ad_level: data.adsLevel
        ? parseInt(data.adsLevel.replace("level", ""))
        : 1,
    };

    const response = await apiClient.put(`/links/${id}`, payload);
    const link = response.data.data;

    return {
      id: link.id,
      title: link.title,
      shortUrl: link.short_url.replace(
        "http://localhost:8000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ),
      originalUrl: link.original_url,
      dateCreated: link.created_at,
      validViews: link.valid_views_count || 0,
      totalEarning: link.total_earned || 0,
      totalClicks: link.total_views_count || 0,
      averageCPM: 0,
      adsLevel: (link.ad_level ? `level${link.ad_level}` : "level1") as AdLevel,
      passwordProtected: !!link.password,
      status: link.status,
      dateExpired: link.expired_at,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update link");
  }
};

export const toggleLinkStatus = async (
  id: string,
  status: "active" | "disabled"
): Promise<Shortlink> => {
  try {
    const response = await apiClient.patch(`/links/${id}/toggle-status`);
    // Backend toggle logic flips status, so we just return the new state
    // We construct a partial Shortlink object just to satisfy return type
    return {
      id,
      status: response.data.data.status,
    } as Shortlink;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle status");
  }
};

// --- GUEST SERVICES ---

export const createGuestLink = async (
  originalUrl: string
): Promise<GeneratedLinkData> => {
  try {
    const response = await apiClient.post("/links", {
      original_url: originalUrl,
      is_guest: true, // Force guest mode even if logged in
      // Backend handles rate limiting automatically
    });

    // Response structure from LinkController::store
    // 'data': { short_url, code, title, ... }
    const data = response.data.data;

    return {
      shortUrl: data.short_url.replace(
        "http://localhost:8000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ),
      code: data.code,
      originalUrl: data.original_url || originalUrl, // fallback
      isGuest: data.is_guest,
      earnPerClick: data.earn_per_click,
    };
  } catch (error: any) {
    // Handle specific backend errors
    if (error.response && error.response.status === 429) {
      // Rate limit hit
      throw new Error(
        "Guest limit reached (100 links/3 days). Please register to create more."
      );
    }
    throw error;
  }
};

export const validateContinueToken = async (
  code: string,
  token: string,
  password?: string
): Promise<string> => {
  try {
    const payload: any = { token };
    if (password) {
      payload.password = password;
    }

    const response = await apiClient.post(`/links/${code}/continue`, payload);
    return response.data.data.original_url;
  } catch (error: any) {
    // Pass the specific error for handling (e.g. 401 password required)
    throw error;
  }
};
