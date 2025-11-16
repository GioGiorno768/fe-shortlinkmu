// src/app/[locale]/(dashboard)/new-link/page.tsx

import AdsLevelCompare from "@/components/newlink/AdsLevelCompare";
import CreateShortlink from "@/components/newlink/CreateShortlink";

export default function NewLinkPage() {
  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* --- 2. BUNGKUS DALAM SPACE-Y --- */}
      <div className="space-y-6">
        <CreateShortlink />
        <AdsLevelCompare />
      </div>
    </div>
  );
}
