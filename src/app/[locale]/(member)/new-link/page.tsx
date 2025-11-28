// src/app/[locale]/(member)/new-link/page.tsx
"use client";

import CreateShortlink from "@/components/dashboard/CreateShortlink";
import LinkList from "@/components/dashboard/links/LinkList";
import { useLinks } from "@/hooks/useLinks"; // Import Hook kita
import { Loader2 } from "lucide-react";

export default function NewLinkPage() {
  // Panggil semua logika dari Hook
  const {
    links,
    isLoading,
    isMutating,
    createLink,
    updateLink,
    toggleLinkStatus,
  } = useLinks();

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-6 pb-10">
      {/* Form Create Link
        Kita pass `isMutating` biar tombolnya loading pas lagi submit ke API 
      */}
      <CreateShortlink
        generatedLink={null} // Nanti bisa diatur di hook kalau mau nampilin hasil generate
        isLoading={isMutating}
        error={null}
        onSubmit={createLink}
      />

      {/* List Link */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
        </div>
      ) : (
        <LinkList
          links={links}
          onUpdateLink={updateLink}
          onDisableLink={toggleLinkStatus}
        />
      )}
    </div>
  );
}
