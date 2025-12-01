import { useState, useEffect, useCallback } from "react";
import * as adminLinkService from "@/services/adminLinkService";
import { useAlert } from "@/hooks/useAlert";
import type {
  AdminLink,
  AdminLinkFilters,
  AdminLinkStats,
  LinkStatus,
} from "@/types/type";

export function useAdminLinks() {
  const { showAlert } = useAlert();

  const [stats, setStats] = useState<AdminLinkStats>({
    totalLinks: 0,
    newToday: 0,
    disabledLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const statsData = await adminLinkService.getLinkStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch links data:", error);
      showAlert("Failed to load links data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    isLoading,
    refreshData: fetchData,
  };
}
