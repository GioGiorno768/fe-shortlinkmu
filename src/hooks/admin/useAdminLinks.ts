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
    activeLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // <--- Total filtered links

  // Pagination & Filters (search is now part of filters)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Satu state filter object biar rapi (search included)
  const [filters, setFilters] = useState<AdminLinkFilters>({
    sort: "newest",
    status: "all",
    adsLevel: "all",
    ownerType: "all", // guest, user, all
    search: "", // search is now part of filters
  });

  // Bulk Selection State
  const [selectedItems, setSelectedItems] = useState<Map<string, string>>(
    new Map()
  );
  const [isAllSelected, setIsAllSelected] = useState(false); // <--- New State

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [linksData, statsData] = await Promise.all([
        adminLinkService.getLinks(page, filters),
        adminLinkService.getLinkStats(),
      ]);
      setLinks(linksData.data);
      setTotalPages(linksData.totalPages);
      setTotalCount(linksData.totalCount); // <--- Set Total Count
      setStats(statsData);
    } catch (error) {
      console.error(error);
      showAlert("Failed to load data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, showAlert]);

  useEffect(() => {
    // Debounce search & filter fetch
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setSelectedItems(new Map());
    setIsAllSelected(false); // Reset select all
  }, [filters]);

  // Bulk Actions Logic
  const toggleSelect = (id: string, status: string) => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedItems(new Map([[id, status]]));
      return;
    }

    const newSelected = new Map(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.set(id, status);
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedItems(new Map());
    } else {
      setIsAllSelected(true);
      setSelectedItems(new Map());
      showAlert(
        `Mode Select All aktif: ${totalCount} links terpilih.`,
        "success"
      );
    }
  };

  const deselectAll = () => {
    setSelectedItems(new Map());
    setIsAllSelected(false);
  };

  const handleBulkAction = async (
    action: "activate" | "block",
    targetIds?: string[],
    reason?: string
  ) => {
    const status = action === "activate" ? "active" : "disabled";
    const idsToUpdate = targetIds || Array.from(selectedItems.keys());

    if (idsToUpdate.length === 0 && !isAllSelected) return;

    try {
      // Use single update for individual links (supports reason/notification)
      // Use bulk update for multiple links or select all
      if (targetIds && targetIds.length === 1 && !isAllSelected) {
        // Single link action - use updateLinkStatus which supports reason
        await adminLinkService.updateLinkStatus(targetIds[0], status, reason);
      } else {
        // Bulk action
        await adminLinkService.bulkUpdateLinkStatus({
          ids: idsToUpdate,
          selectAll: isAllSelected && !targetIds,
          filters,
          status,
          reason,
        });
      }

      const count =
        isAllSelected && !targetIds ? totalCount : idsToUpdate.length;
      showAlert(`Success! ${count} links ${status}.`, "success");

      if (!targetIds) {
        setSelectedItems(new Map());
        setIsAllSelected(false);
      }
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
    filters,
    setFilters,
    selectedItems,
    isAllSelected, // <--- Export new state
    toggleSelect,
    selectAll,
    handleBulkAction,
    refreshData: fetchData,
    deselectAll,
    totalCount, // <--- Export
  };
}
