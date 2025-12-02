import { useState, useEffect, useCallback } from "react";
import * as adminLinkService from "@/services/adminLinkService";
import { useAlert } from "@/hooks/useAlert";
import type { AdminLink, AdminLinkFilters, AdminLinkStats } from "@/types/type";

export function useAdminLinks() {
  const { showAlert } = useAlert();

  const [links, setLinks] = useState<AdminLink[]>([]);
  const [stats, setStats] = useState<AdminLinkStats>({
    totalLinks: 0,
    newToday: 0,
    disabledLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  // Satu state filter object biar rapi
  const [filters, setFilters] = useState<AdminLinkFilters>({
    sort: "newest",
    status: "all",
    adsLevel: "all",
  });

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [linksData, statsData] = await Promise.all([
        adminLinkService.getLinks(page, { ...filters, search }),
        adminLinkService.getLinkStats(),
      ]);
      setLinks(linksData.data);
      setTotalPages(linksData.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      showAlert("Failed to load data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, search, showAlert]);

  useEffect(() => {
    // Debounce search & filter fetch
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  // Bulk Actions Logic
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const selectAll = async () => {
    if (selectedIds.size === stats.totalLinks) {
      setSelectedIds(new Set()); // Deselect all
    } else {
      // Fetch ALL IDs matching current filters
      try {
        const allIds = await adminLinkService.getAllLinkIds({
          ...filters,
          search,
        });
        setSelectedIds(new Set(allIds));
      } catch (error) {
        console.error("Failed to select all:", error);
        showAlert("Failed to select all links", "error");
      }
    }
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkAction = async (
    action: "activate" | "block",
    targetIds?: string[],
    reason?: string
  ) => {
    const status = action === "activate" ? "active" : "disabled";
    const idsToUpdate = targetIds || Array.from(selectedIds);

    if (idsToUpdate.length === 0) return;

    try {
      await adminLinkService.bulkUpdateLinkStatus(idsToUpdate, status, reason);
      showAlert(`Success! ${idsToUpdate.length} links ${status}.`, "success");
      if (!targetIds) setSelectedIds(new Set()); // Reset selection only if bulk action
      fetchData(); // Refresh data
    } catch (error) {
      showAlert("Action failed.", "error");
    }
  };

  return {
    links,
    stats,
    isLoading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    filters,
    setFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    handleBulkAction,
    refreshData: fetchData,
    deselectAll,
  };
}
