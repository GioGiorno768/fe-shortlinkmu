// src/hooks/useLinks.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
  FilterByType,
  SortByType,
  GeneratedLinkData,
  MemberLinkFilters,
} from "@/types/type";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert";

export function useLinks() {
  const { showAlert } = useAlert();

  // Data
  const [links, setLinks] = useState<Shortlink[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkData | null>(
    null
  );

  // Filter
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MemberLinkFilters>({
    sort: "newest",
    status: "all",
    adsLevel: "all",
    search: "",
  });

  // Backward compatibility / Helper for UI if needed, but best to use filters directly
  // const [search, setSearch] = useState(""); // Merged into filters

  // Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Debounced Search updater (optional, or handle in component)
  // For now we assume setFilters updates state immediately, and we depend on debouncing fetch or use effect

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await linkService.getLinks({
        page,
        filters,
      });
      setLinks(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      showAlert("Gagal memuat data link.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, showAlert]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchLinks]);

  // Reset page kalau filter berubah
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const createLink = async (formData: CreateLinkFormData): Promise<boolean> => {
    setIsMutating(true);
    try {
      const newLink = await linkService.createLink(formData);
      setGeneratedLink({
        shortUrl: newLink.shortUrl,
        originalUrl: newLink.originalUrl,
      });
      fetchLinks(); // Refresh list
      showAlert("Shortlink berhasil dibuat!", "success");
      return true;
    } catch (error) {
      showAlert("Gagal membuat link.", "error");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, newData: EditableLinkData) => {
    setIsMutating(true);
    try {
      await linkService.updateLink(id, newData);
      fetchLinks(); // Refresh data biar tabel update
      showAlert("Link berhasil diperbarui.", "success");
    } catch (error) {
      showAlert("Gagal memperbarui link.", "error");
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    status: "active" | "disabled"
  ) => {
    try {
      await linkService.toggleLinkStatus(id, status);
      // Refetch data to ensure UI reflects backend truth with loading state
      fetchLinks();
      showAlert(`Status link berhasil diubah.`, "info");
    } catch (error) {
      showAlert("Gagal mengubah status.", "error");
    }
  };

  return {
    links,
    totalPages,
    generatedLink,
    isLoading,
    isMutating,
    page,
    setPage,
    filters,
    setFilters,
    createLink,
    updateLink: handleUpdate,
    toggleLinkStatus: handleToggleStatus,
  };
}
