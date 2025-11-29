import PaymentSection from "@/components/dashboard/settings/PaymentSection";
import * as settingsService from "@/services/settingsService";

export default async function Page() {
  const data = await settingsService.getPaymentMethods();
  return <PaymentSection initialMethods={data} />;
}
