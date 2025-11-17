import AdsLevelCompare from "@/components/dashboard/AdsLevelCompare";

export default function AdsInfo() {
  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      {/* --- 2. BUNGKUS DALAM SPACE-Y --- */}
      <div className="space-y-6">
        <AdsLevelCompare />
      </div>
    </div>
  );
}
