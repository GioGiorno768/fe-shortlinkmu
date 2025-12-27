// src/services/paymentTemplateAdminService.ts
// Service for managing payment method templates (Super Admin)

import apiClient from "./apiClient";

export interface PaymentMethodTemplate {
  id: number;
  name: string;
  type: "wallet" | "bank" | "crypto";
  currency: string;
  input_type: "phone" | "email" | "account_number" | "crypto_address";
  input_label: string;
  icon: string | null;
  fee: number;
  min_amount: number;
  max_amount: number;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type CreatePaymentTemplateData = Omit<
  PaymentMethodTemplate,
  "id" | "created_at" | "updated_at"
>;

export type UpdatePaymentTemplateData = Partial<CreatePaymentTemplateData>;

// ============== CONSTANTS ==============

export const PAYMENT_TYPES = [
  { value: "wallet", label: "Digital Wallet" },
  { value: "bank", label: "Bank / Digital Bank" },
  { value: "crypto", label: "Cryptocurrency" },
] as const;

export const INPUT_TYPES = [
  { value: "phone", label: "Phone Number", forTypes: ["wallet"] },
  { value: "email", label: "Email Address", forTypes: ["wallet"] },
  { value: "account_number", label: "Account Number", forTypes: ["bank"] },
  { value: "crypto_address", label: "Wallet Address", forTypes: ["crypto"] },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "IDR", label: "IDR - Indonesian Rupiah", symbol: "Rp" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "SGD", label: "SGD - Singapore Dollar", symbol: "S$" },
  { value: "MYR", label: "MYR - Malaysian Ringgit", symbol: "RM" },
  { value: "PHP", label: "PHP - Philippine Peso", symbol: "₱" },
  { value: "THB", label: "THB - Thai Baht", symbol: "฿" },
  { value: "VND", label: "VND - Vietnamese Dong", symbol: "₫" },
  { value: "BTC", label: "BTC - Bitcoin", symbol: "₿" },
  { value: "USDT", label: "USDT - Tether", symbol: "$" },
] as const;

// ============== API RESPONSE TYPE ==============

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ============== API FUNCTIONS ==============

export async function getPaymentTemplates(filters?: {
  type?: string;
  is_active?: boolean;
}): Promise<PaymentMethodTemplate[]> {
  const response = await apiClient.get<ApiResponse<PaymentMethodTemplate[]>>(
    "/super-admin/payment-templates",
    { params: filters }
  );
  return response.data.data;
}

export async function createPaymentTemplate(
  data: CreatePaymentTemplateData
): Promise<PaymentMethodTemplate> {
  const response = await apiClient.post<ApiResponse<PaymentMethodTemplate>>(
    "/super-admin/payment-templates",
    data
  );
  return response.data.data;
}

export async function updatePaymentTemplate(
  id: number,
  data: UpdatePaymentTemplateData
): Promise<PaymentMethodTemplate> {
  const response = await apiClient.put<ApiResponse<PaymentMethodTemplate>>(
    `/super-admin/payment-templates/${id}`,
    data
  );
  return response.data.data;
}

export async function deletePaymentTemplate(id: number): Promise<void> {
  await apiClient.delete(`/super-admin/payment-templates/${id}`);
}

export async function togglePaymentTemplateActive(
  id: number
): Promise<PaymentMethodTemplate> {
  const response = await apiClient.patch<ApiResponse<PaymentMethodTemplate>>(
    `/super-admin/payment-templates/${id}/toggle`
  );
  return response.data.data;
}

// ============== HELPER FUNCTIONS ==============

export function getInputTypesForPaymentType(type: string) {
  return INPUT_TYPES.filter((it) =>
    (it.forTypes as readonly string[]).includes(type)
  );
}

export function formatAmount(amount: number, currency: string): string {
  const curr = CURRENCIES.find((c) => c.value === currency);
  const symbol = curr?.symbol || "$";

  if (["IDR", "VND"].includes(currency)) {
    return `${symbol}${amount.toLocaleString("id-ID")}`;
  }
  if (["BTC"].includes(currency)) {
    return `${amount} ${currency}`;
  }
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
}
