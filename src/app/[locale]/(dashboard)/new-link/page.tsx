// src/app/[locale]/(dashboard)/new-link/page.tsx

import CreateShortlink from "@/components/dashboard/CreateShortlink";

export default function NewLinkPage() {
  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* --- 2. BUNGKUS DALAM SPACE-Y --- */}
      <div className="space-y-6">
        <CreateShortlink />
      </div>
    </div>
  );
}
