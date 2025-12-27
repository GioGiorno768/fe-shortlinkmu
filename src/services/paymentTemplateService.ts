// src/services/paymentTemplateService.ts
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
}

/**
 * Fetch active payment method templates for user selection
 */
export async function getPaymentTemplates(): Promise<PaymentMethodTemplate[]> {
  try {
    const response = await apiClient.get("/payment-templates");
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch payment templates:", error);
    return [];
  }
}

/**
 * Group templates by type for UI display
 */
export function groupTemplatesByType(templates: PaymentMethodTemplate[]) {
  const grouped: Record<string, PaymentMethodTemplate[]> = {
    wallet: [],
    bank: [],
    crypto: [],
  };

  templates.forEach((template) => {
    if (grouped[template.type]) {
      grouped[template.type].push(template);
    }
  });

  return grouped;
}

/**
 * Get input type placeholder based on input_type
 */
export function getInputPlaceholder(inputType: string): string {
  switch (inputType) {
    case "phone":
      return "08xxxxxxxxxx";
    case "email":
      return "email@example.com";
    case "account_number":
      return "1234567890";
    case "crypto_address":
      return "Enter wallet address";
    default:
      return "";
  }
}

/**
 * Get input type for HTML input element
 */
export function getHtmlInputType(inputType: string): string {
  switch (inputType) {
    case "phone":
    case "account_number":
      return "text";
    case "email":
      return "email";
    case "crypto_address":
      return "text";
    default:
      return "text";
  }
}
