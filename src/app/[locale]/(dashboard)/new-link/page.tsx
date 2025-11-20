// src/app/[locale]/(dashboard)/new-link/page.tsx

import CreateShortlink from "@/components/dashboard/CreateShortlink";
// 1. IMPORT KOMPONEN BARU LU
import LinkList from "@/components/dashboard/LinkList";

export default function NewLinkPage() {
  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      <div className="space-y-6">
        <CreateShortlink />

        {/* 2. TAMBAHIN KOMPONENNYA DI SINI */}
        <LinkList />
      </div>
    </div>
  );
}
