// src/app/[locale]/(admin)/admin/links/page.tsx
"use client";

import LinkStatsRow from "@/components/dashboard/admin/links/LinkStatsRow";
import LinkList from "@/components/dashboard/admin/links/LinkList"; // New Component
import { useAdminLinks } from "@/hooks/admin/useAdminLinks";

export default function AdminLinksPage() {
  const {
    stats,
    links,
    isLoading,
    search,
    setSearch,
    filters,
    setFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    handleBulkAction,
  } = useAdminLinks();

  return (
    <div className="space-y-8 pb-24 text-[10px]">
      {" "}
      {/* pb-24 biar gak ketutup bulk bar */}
      <LinkStatsRow stats={stats} isLoading={isLoading} />
      <LinkList
        links={links}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        handleBulkAction={handleBulkAction}
      />
    </div>
  );
}
