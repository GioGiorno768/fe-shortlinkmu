import PaymentSection from "@/components/dashboard/settings/PaymentSection";
import type { SavedPaymentMethod } from "@/types/type";

async function fetchPaymentMethods() {
  console.log("MANGGIL API: GET /api/user/payment-methods");
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
  ] as SavedPaymentMethod[];
}

export default async function Page() {
  const data = await fetchPaymentMethods();
  return <PaymentSection initialMethods={data} />;
}
