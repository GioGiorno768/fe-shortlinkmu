// src/hooks/useSettings.ts
"use client";

import { useState } from "react";
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
export function useProfileLogic() {
  const { showAlert } = useAlert();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (data: UserProfile) => {
    setIsUpdating(true);
    try {
      await settingsService.updateUserProfile(data);
      showAlert("Profil berhasil diperbarui!", "success");
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

// =======================
// 2. HOOK SECURITY (Ini yang tadi kurang)
// =======================
export function useSecurityLogic() {
  const { showAlert } = useAlert();
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePass = async (current: string, newPass: string) => {
    setIsUpdating(true);
    try {
      await settingsService.changePassword(current, newPass);
      showAlert("Password berhasil diubah!", "success");
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal mengubah password.", "error");
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
// 3. HOOK PAYMENT
// =======================
export function usePaymentLogic(initialMethods: SavedPaymentMethod[]) {
  const { showAlert } = useAlert();
  const [methods, setMethods] = useState<SavedPaymentMethod[]>(initialMethods);
  const [isProcessing, setIsProcessing] = useState(false);

  // Tambah Metode
  const addMethod = async (
    data: Omit<SavedPaymentMethod, "id" | "isDefault">
  ) => {
    setIsProcessing(true);
    try {
      // Logic: Kalau list kosong, otomatis jadi default
      const isFirst = methods.length === 0;

      const newMethod = await settingsService.addPaymentMethod(data);

      // Override isDefault jika dia satu-satunya
      const finalMethod = { ...newMethod, isDefault: isFirst };

      setMethods((prev) => [...prev, finalMethod]);
      showAlert("Metode pembayaran ditambahkan!", "success");
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal menambah metode.", "error");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Hapus Metode
  const removeMethod = async (id: string) => {
    setIsProcessing(true);
    try {
      await settingsService.deletePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
      showAlert("Metode pembayaran dihapus.", "info");
      return true;
    } catch (error) {
      console.error(error);
      showAlert("Gagal menghapus metode.", "error");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Set Default
  const setAsDefault = async (id: string) => {
    // Optimistic Update
    const previousMethods = [...methods];
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));

    try {
      await settingsService.setDefaultPaymentMethod(id);
      showAlert("Metode utama diperbarui.", "success");
    } catch (error) {
      console.error(error);
      // Revert kalau gagal
      setMethods(previousMethods);
      showAlert("Gagal mengatur default.", "error");
    }
  };

  return {
    methods,
    addMethod,
    removeMethod,
    setAsDefault,
    isProcessing,
  };
}

// =======================
// 4. HOOK PREFERENCES (Ini yang tadi kurang)
// =======================
export function usePreferencesLogic() {
  const { showAlert } = useAlert();
  const [isSaving, setIsSaving] = useState(false);

  const savePreferences = async (data: UserPreferences) => {
    setIsSaving(true);
    try {
      await settingsService.updateUserPreferences(data);
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
