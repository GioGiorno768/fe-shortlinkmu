// src/hooks/useLinks.ts
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
  GeneratedLinkData,
  MemberLinkFilters,
} from "@/types/type";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert";

// Query keys for React Query
export const linkKeys = {
  all: ["links"] as const,
  list: (filters: MemberLinkFilters, page: number) =>
    [...linkKeys.all, "list", { ...filters, page }] as const,
};

export function useLinks() {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  // Generated link (after create)
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkData | null>(
    null
  );

  // Filter & Pagination state
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MemberLinkFilters>({
    sort: "newest",
    status: "all",
    adsLevel: "all",
    search: "",
  });

  // Custom setFilters that resets page to 1
  const updateFilters = (newFilters: MemberLinkFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Query: Fetch Links
  const {
    data: linksData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: linkKeys.list(filters, page),
    queryFn: () => linkService.getLinks({ page, filters }),
    staleTime: 30 * 1000, // 30 seconds stale time (links change more frequently)
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });

  // Mutation: Create Link
  const createMutation = useMutation({
    mutationFn: linkService.createLink,
    onSuccess: (newLink) => {
      setGeneratedLink({
        shortUrl: newLink.shortUrl,
        originalUrl: newLink.originalUrl,
      });
      // Invalidate and refetch links list
      queryClient.invalidateQueries({ queryKey: linkKeys.all });
      showAlert("Shortlink berhasil dibuat!", "success");
    },
    onError: () => {
      showAlert("Gagal membuat link.", "error");
    },
  });

  // Mutation: Update Link
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditableLinkData }) =>
      linkService.updateLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.all });
      showAlert("Link berhasil diperbarui.", "success");
    },
    onError: () => {
      showAlert("Gagal memperbarui link.", "error");
    },
  });

  // Mutation: Toggle Status
  const toggleMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "disabled";
    }) => linkService.toggleLinkStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.all });
      showAlert("Status link berhasil diubah.", "info");
    },
    onError: () => {
      showAlert("Gagal mengubah status.", "error");
    },
  });

  // Wrapper functions for mutations
  const createLink = async (formData: CreateLinkFormData): Promise<boolean> => {
    try {
      await createMutation.mutateAsync(formData);
      return true;
    } catch {
      return false;
    }
  };

  const updateLink = async (id: string, data: EditableLinkData) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const toggleLinkStatus = async (
    id: string,
    status: "active" | "disabled"
  ) => {
    await toggleMutation.mutateAsync({ id, status });
  };

  return {
    // Data
    links: linksData?.data ?? [],
    totalPages: linksData?.totalPages ?? 1,
    generatedLink,

    // Loading states
    isLoading, // Initial loading
    isFetching, // Background refetching
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending,

    // Pagination & Filters
    page,
    setPage,
    filters,
    setFilters: updateFilters,

    // Actions
    createLink,
    updateLink,
    toggleLinkStatus,
  };
}
