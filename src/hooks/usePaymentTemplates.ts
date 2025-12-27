// src/hooks/usePaymentTemplates.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PaymentMethodTemplate,
  CreatePaymentTemplateData,
  UpdatePaymentTemplateData,
  getPaymentTemplates,
  createPaymentTemplate,
  updatePaymentTemplate,
  deletePaymentTemplate,
  togglePaymentTemplateActive,
} from "@/services/paymentTemplateAdminService";
import { useAlert } from "@/hooks/useAlert";

interface UsePaymentTemplatesOptions {
  initialFilter?: { type?: string; is_active?: boolean };
}

export function usePaymentTemplates(options?: UsePaymentTemplatesOptions) {
  const { showAlert } = useAlert();
  const [templates, setTemplates] = useState<PaymentMethodTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ type?: string; is_active?: boolean }>(
    options?.initialFilter || {}
  );

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentTemplates(filter);
      setTemplates(data);
    } catch (err) {
      setError("Failed to fetch payment templates");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Create
  const handleCreate = async (data: CreatePaymentTemplateData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTemplate = await createPaymentTemplate(data);
      setTemplates((prev) => [...prev, newTemplate]);
      showAlert(
        `"${data.name}" has been added successfully!`,
        "success",
        "Payment Method Created"
      );
      return newTemplate;
    } catch (err) {
      setError("Failed to create payment template");
      showAlert("Failed to create payment method", "error", "Error");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update
  const handleUpdate = async (id: number, data: UpdatePaymentTemplateData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await updatePaymentTemplate(id, data);
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showAlert(
        `"${updated.name}" has been updated successfully!`,
        "success",
        "Payment Method Updated"
      );
      return updated;
    } catch (err) {
      setError("Failed to update payment template");
      showAlert("Failed to update payment method", "error", "Error");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const template = templates.find((t) => t.id === id);
      await deletePaymentTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      showAlert(
        `"${template?.name}" has been deleted.`,
        "success",
        "Payment Method Deleted"
      );
    } catch (err) {
      setError("Failed to delete payment template");
      showAlert("Failed to delete payment method", "error", "Error");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await togglePaymentTemplateActive(id);
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showAlert(
        `"${updated.name}" is now ${
          updated.is_active ? "active" : "inactive"
        }.`,
        updated.is_active ? "success" : "warning",
        "Status Updated"
      );
      return updated;
    } catch (err) {
      setError("Failed to toggle template status");
      showAlert("Failed to toggle status", "error", "Error");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.is_active).length,
    inactive: templates.filter((t) => !t.is_active).length,
    byType: {
      wallet: templates.filter((t) => t.type === "wallet").length,
      bank: templates.filter((t) => t.type === "bank").length,
      crypto: templates.filter((t) => t.type === "crypto").length,
    },
  };

  return {
    templates,
    isLoading,
    isSubmitting,
    error,
    filter,
    setFilter,
    stats,
    refetch: fetchTemplates,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive,
  };
}
