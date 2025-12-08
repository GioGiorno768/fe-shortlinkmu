import { useState, useEffect } from "react";
import * as adLevelService from "@/services/adLevelService";
import type { AdLevelConfig, AdFeature } from "@/services/adLevelService";
import { useAlert } from "@/hooks/useAlert";

export function useAdLevels() {
  const [levels, setLevels] = useState<AdLevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  // Fetch all levels
  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      const data = await adLevelService.getAdLevels();
      setLevels(data);
    } catch (error) {
      showAlert("Failed to load ad levels", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Create new level
  const handleCreate = async (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSubmitting(true);
    try {
      const newLevel = await adLevelService.createAdLevel(data);
      setLevels((prev) => [...prev, newLevel]);
      showAlert("Ad level created successfully", "success");
      return newLevel;
    } catch (error) {
      showAlert("Failed to create ad level", "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing level
  const handleUpdate = async (
    id: string,
    data: Partial<Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">>
  ) => {
    setIsSubmitting(true);
    try {
      const updated = await adLevelService.updateAdLevel(id, data);
      setLevels((prev) =>
        prev.map((level) => (level.id === id ? updated : level))
      );
      showAlert("Ad level updated successfully", "success");
      return updated;
    } catch (error) {
      showAlert("Failed to update ad level", "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete level
  const handleDelete = async (id: string) => {
    try {
      await adLevelService.deleteAdLevel(id);
      setLevels((prev) => prev.filter((level) => level.id !== id));
      showAlert("Ad level deleted successfully", "success");
    } catch (error) {
      showAlert("Failed to delete ad level", "error");
      throw error;
    }
  };

  // Get next level number
  const getNextLevelNumber = (): number => {
    if (levels.length === 0) return 1;
    const maxLevel = Math.max(...levels.map((l) => l.levelNumber));
    return maxLevel + 1;
  };

  return {
    levels,
    isLoading,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    getNextLevelNumber,
    refreshLevels: fetchLevels,
  };
}
