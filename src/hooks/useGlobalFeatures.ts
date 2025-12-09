import { useState, useEffect, useCallback } from "react";
import { useAlert } from "@/hooks/useAlert";
import {
  getGlobalFeatures,
  createGlobalFeature,
  updateGlobalFeature,
  deleteGlobalFeature,
  type GlobalFeature,
} from "@/services/adLevelService";

export function useGlobalFeatures() {
  const { showAlert } = useAlert();
  const [features, setFeatures] = useState<GlobalFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeatures = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getGlobalFeatures();
      setFeatures(data);
    } catch (error) {
      showAlert("Failed to load features", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleCreate = useCallback(
    async (name: string, description?: string) => {
      try {
        setIsLoading(true);
        const newFeature = await createGlobalFeature({ name, description });
        setFeatures((prev) => [...prev, newFeature]);
        showAlert(`Feature "${name}" created successfully!`, "success");
      } catch (error) {
        showAlert("Failed to create feature", "error");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [showAlert]
  );

  const handleUpdate = useCallback(
    async (id: string, name: string, description?: string) => {
      try {
        setIsLoading(true);
        const updated = await updateGlobalFeature(id, { name, description });
        setFeatures((prev) => prev.map((f) => (f.id === id ? updated : f)));
        showAlert(`Feature updated successfully!`, "success");
      } catch (error) {
        showAlert("Failed to update feature", "error");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [showAlert]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this feature? This will remove it from all ad levels."
        )
      ) {
        return;
      }

      try {
        setIsLoading(true);
        await deleteGlobalFeature(id);
        setFeatures((prev) => prev.filter((f) => f.id !== id));
        showAlert("Feature deleted successfully!", "success");
      } catch (error) {
        showAlert("Failed to delete feature", "error");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [showAlert]
  );

  return {
    features,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchFeatures,
  };
}
