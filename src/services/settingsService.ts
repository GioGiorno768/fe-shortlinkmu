// src/services/settingsService.ts
import type {
  UserProfile,
  SecuritySettings,
  SavedPaymentMethod,
  UserPreferences,
} from "@/types/type";

// ==========================================
// 1. PROFILE SERVICE
// ==========================================
export async function getUserProfile(): Promise<UserProfile> {
  // NANTI GANTI: fetch('/api/user/profile')
  await new Promise((r) => setTimeout(r, 500));
  return {
    name: "Kevin Ragil",
    email: "kevinragil768@gmail.com",
    phone: "08123456789",
    avatarUrl: "https://avatar.iran.liara.run/public/35",
    username: "Narancia",
  };
}

export async function updateUserProfile(
  data: UserProfile
): Promise<UserProfile> {
  // NANTI GANTI: fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) })
  await new Promise((r) => setTimeout(r, 1000));
  return data;
}

// ==========================================
// 2. SECURITY SERVICE (Ini yang tadi kurang)
// ==========================================
export async function getSecuritySettings(): Promise<SecuritySettings> {
  // NANTI GANTI: fetch('/api/user/security')
  await new Promise((r) => setTimeout(r, 500));
  return {
    twoFactorEnabled: false,
    lastPasswordChange: "2025-10-01",
    isSocialLogin: false,
  };
}

export async function changePassword(
  current: string,
  newPass: string
): Promise<boolean> {
  // NANTI GANTI: fetch('/api/user/change-password', { method: 'POST', body: ... })
  await new Promise((r) => setTimeout(r, 1500));
  // Simulasi validasi
  if (newPass.length < 8) throw new Error("Password too short");
  return true;
}

export async function toggle2FA(enabled: boolean): Promise<boolean> {
  // NANTI GANTI: fetch('/api/user/2fa', { method: 'POST', body: { enabled } })
  await new Promise((r) => setTimeout(r, 800));
  return enabled;
}

// ==========================================
// 3. PAYMENT SERVICE
// ==========================================
export async function getPaymentMethods(): Promise<SavedPaymentMethod[]> {
  // NANTI GANTI: fetch('/api/user/payment-methods')
  await new Promise((r) => setTimeout(r, 800));
  return [
    {
      id: "pm-1",
      provider: "PayPal",
      accountName: "Kevin Ragil",
      accountNumber: "kevin@example.com",
      isDefault: true,
      category: "wallet",
    },
  ];
}

export async function addPaymentMethod(
  data: Omit<SavedPaymentMethod, "id" | "isDefault">
): Promise<SavedPaymentMethod> {
  // NANTI GANTI: fetch('/api/user/payment-methods', { method: 'POST', body: ... })
  await new Promise((r) => setTimeout(r, 1000));

  return {
    id: `pm-${Date.now()}`,
    ...data,
    isDefault: false, // Default false, nanti di hook bisa diatur
  };
}

export async function deletePaymentMethod(id: string): Promise<boolean> {
  // NANTI GANTI: fetch(`/api/user/payment-methods/${id}`, { method: 'DELETE' })
  await new Promise((r) => setTimeout(r, 800));
  return true;
}

export async function setDefaultPaymentMethod(id: string): Promise<boolean> {
  // NANTI GANTI: fetch(`/api/user/payment-methods/${id}/default`, { method: 'PATCH' })
  await new Promise((r) => setTimeout(r, 600));
  return true;
}

// ==========================================
// 4. PREFERENCES SERVICE (Ini yang tadi kurang)
// ==========================================
export async function getUserPreferences(): Promise<UserPreferences> {
  // NANTI GANTI: fetch('/api/user/preferences')
  await new Promise((r) => setTimeout(r, 500));
  return {
    language: "en",
    currency: "USD",
    timezone: "Asia/Jakarta",
    privacy: {
      loginAlert: true,
      cookieConsent: true,
      saveLoginInfo: false,
    },
  };
}

export async function updateUserPreferences(
  data: UserPreferences
): Promise<UserPreferences> {
  // NANTI GANTI: fetch('/api/user/preferences', { method: 'PUT', body: JSON.stringify(data) })
  await new Promise((r) => setTimeout(r, 1000));
  return data;
}
