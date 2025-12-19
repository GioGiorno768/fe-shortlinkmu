// src/hooks/useSettings.ts
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as settingsService from "@/services/settingsService";
import { useAlert } from "@/hooks/useAlert";
import type {
  UserProfile,
  SavedPaymentMethod,
  UserPreferences,
} from "@/types/type";

// =======================
// 1. HOOK PROFILE
// =======================
export function useProfileLogic(type: "user" | "admin" = "user") {
  const { showAlert } = useAlert();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (data: UserProfile) => {
    setIsUpdating(true);
    try {
      if (type === "admin") {
        await settingsService.updateAdminProfile(data);
      } else {
        await settingsService.updateUserProfile(data);
      }
      showAlert("Profil berhasil diperbarui!", "success");
      // Refresh page after 1 second to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal menyimpan profil.", "error");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating };
}

// ... (Security and Payment hooks remain unchanged) ...

// =======================
// 4. HOOK PREFERENCES
// =======================

// =======================
// 2. HOOK SECURITY (Ini yang tadi kurang)
// =======================
export function useSecurityLogic() {
  const { showAlert } = useAlert();
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePass = async (
    current: string,
    newPass: string,
    confirmPass: string
  ) => {
    setIsUpdating(true);
    try {
      await settingsService.changePassword(current, newPass, confirmPass);
      showAlert("Password berhasil diubah!", "success");
      return true;
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Gagal mengubah password.";
      showAlert(errorMsg, "error");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggle2FAStatus = async (enabled: boolean) => {
    try {
      await settingsService.toggle2FA(enabled);
      showAlert(
        `2FA ${enabled ? "diaktifkan" : "dinonaktifkan"}.`,
        enabled ? "success" : "warning"
      );
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal mengubah status 2FA.", "error");
      return false;
    }
  };

  return { updatePass, toggle2FAStatus, isUpdating };
}

// =======================
// 3. HOOK PAYMENT (React Query)
// =======================

// Query keys for payment methods
export const paymentKeys = {
  all: ["payment-methods"] as const,
  list: () => [...paymentKeys.all, "list"] as const,
};

export function usePaymentLogic() {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  // Fetch payment methods with React Query
  const {
    data: methods = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: paymentKeys.list(),
    queryFn: settingsService.getPaymentMethods,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation: Add payment method
  const addMutation = useMutation({
    mutationFn: (data: Omit<SavedPaymentMethod, "id" | "isDefault">) =>
      settingsService.addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      showAlert("Metode pembayaran ditambahkan!", "success");
    },
    onError: () => {
      showAlert("Gagal menambah metode.", "error");
    },
  });

  // Mutation: Remove payment method
  const removeMutation = useMutation({
    mutationFn: (id: string) => settingsService.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      showAlert("Metode pembayaran dihapus.", "info");
    },
    onError: () => {
      showAlert("Gagal menghapus metode.", "error");
    },
  });

  // Mutation: Set as default
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => settingsService.setDefaultPaymentMethod(id),
    onMutate: async (id: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: paymentKeys.list() });
      const previousMethods = queryClient.getQueryData<SavedPaymentMethod[]>(
        paymentKeys.list()
      );
      queryClient.setQueryData<SavedPaymentMethod[]>(
        paymentKeys.list(),
        (old) => old?.map((m) => ({ ...m, isDefault: m.id === id })) ?? []
      );
      return { previousMethods };
    },
    onSuccess: () => {
      showAlert("Metode utama diperbarui.", "success");
    },
    onError: (_, __, context) => {
      // Revert on error
      if (context?.previousMethods) {
        queryClient.setQueryData(paymentKeys.list(), context.previousMethods);
      }
      showAlert("Gagal mengatur default.", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });

  // Action wrappers for backwards compatibility
  const addMethod = async (
    data: Omit<SavedPaymentMethod, "id" | "isDefault">
  ) => {
    try {
      await addMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const removeMethod = async (id: string) => {
    try {
      await removeMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      await setDefaultMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const isProcessing =
    addMutation.isPending ||
    removeMutation.isPending ||
    setDefaultMutation.isPending;

  return {
    methods,
    isLoading,
    error: error ? "Gagal memuat metode pembayaran." : null,
    addMethod,
    removeMethod,
    setAsDefault,
    isProcessing,
  };
}

export function usePreferencesLogic(type: "user" | "admin" = "user") {
  const { showAlert } = useAlert();
  const [isSaving, setIsSaving] = useState(false);

  const savePreferences = async (data: UserPreferences) => {
    setIsSaving(true);
    try {
      if (type === "admin") {
        await settingsService.updateAdminPreferences(data);
      } else {
        await settingsService.updateUserPreferences(data);
      }
      showAlert("Pengaturan disimpan!", "success");
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal menyimpan pengaturan.", "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { savePreferences, isSaving };
}
