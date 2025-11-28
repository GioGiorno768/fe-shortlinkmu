// src/hooks/useLinks.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
} from "@/types/type";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert"; // Pake alert lu yang keren itu

export function useLinks() {
  const { showAlert } = useAlert();
  const [links, setLinks] = useState<Shortlink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false); // Buat loading pas create/edit

  // Fetch Initial Data
  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
      showAlert("Gagal memuat data link.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Handle Create
  const handleCreate = async (
    formData: CreateLinkFormData
  ): Promise<boolean> => {
    setIsMutating(true);
    try {
      const newLink = await linkService.createLink(formData);
      setLinks((prev) => [newLink, ...prev]); // Update UI Optimis/Langsung
      showAlert("Shortlink berhasil dibuat!", "success");
      return true;
    } catch (error) {
      showAlert("Gagal membuat link.", "error");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  // Handle Update
  const handleUpdate = async (id: string, newData: EditableLinkData) => {
    // Kita gak perlu set loading full screen, cukup update di background atau modal
    try {
      const updated = await linkService.updateLink(id, newData);
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
      showAlert("Link berhasil diperbarui.", "success");
    } catch (error) {
      showAlert("Gagal memperbarui link.", "error");
    }
  };

  // Handle Disable/Enable
  const handleToggleStatus = async (
    id: string,
    currentStatus: "active" | "disabled"
  ) => {
    try {
      const updated = await linkService.toggleLinkStatus(id, currentStatus);
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));

      const statusText =
        updated.status === "active" ? "diaktifkan" : "dinonaktifkan";
      showAlert(
        `Link berhasil ${statusText}.`,
        updated.status === "active" ? "success" : "warning"
      );
    } catch (error) {
      showAlert("Gagal mengubah status link.", "error");
    }
  };

  return {
    links,
    isLoading,
    isMutating,
    refresh: fetchLinks,
    createLink: handleCreate,
    updateLink: handleUpdate,
    toggleLinkStatus: handleToggleStatus,
  };
}
