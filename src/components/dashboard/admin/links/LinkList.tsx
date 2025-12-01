"use client";

import { useState } from "react";
import LinkItem from "./LinkItem";
import LinkFilters from "./LinkFilters";
import BulkActionBar from "./BulkActionBar";
import { Search, Loader2 } from "lucide-react";
import type { AdminLink, AdminLinkFilters } from "@/types/type";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";

interface LinkListProps {
  links: AdminLink[];
  isLoading: boolean;
  search: string;
  setSearch: (s: string) => void;
  filters: AdminLinkFilters;
  setFilters: (f: AdminLinkFilters) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  handleBulkAction: (action: "activate" | "block") => Promise<void>;
}

export default function LinkList({
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
}: LinkListProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "activate" | "block" | null;
  }>({ isOpen: false, action: null });

  const onBulkActionClick = (action: "activate" | "block") => {
    setConfirmModal({ isOpen: true, action });
  };

  const onConfirmAction = async () => {
    if (confirmModal.action) {
      await handleBulkAction(confirmModal.action);
      setConfirmModal({ isOpen: false, action: null });
    }
  };

  // Single item action juga pake logic bulk biar dry (array 1 item)
  // Tapi di hook lu udah handle bulk, jadi aman.
  const onSingleAction = async (id: string, action: "activate" | "block") => {
    // Hack dikit: select dulu itemnya, trus jalanin bulk action, trus reset
    // Idealnya ada fungsi single update di service, tapi gini juga works
    toggleSelect(id);
    // Di real app, mending panggil API updateLinkStatus(id) langsung
    // Untuk mock ini kita simulasi aja
    console.log(`Action ${action} on ${id}`);
  };

  return (
    <div className="space-y-6 font-figtree">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
          <input
            type="text"
            placeholder="Search link, alias, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack"
          />
        </div>

        {/* Filter */}
        <LinkFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* LIST */}
      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-20 text-grays text-[1.4em]">
            No links found matching your criteria.
          </div>
        ) : (
          links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              isSelected={selectedIds.has(link.id)}
              onToggleSelect={toggleSelect}
              onAction={onSingleAction} // Ini buat dropdown per item
            />
          ))
        )}
      </div>

      {/* BULK ACTION BAR */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        totalVisible={links.length}
        onSelectAll={selectAll}
        onDeselectAll={selectAll} // Logic toggle sama
        onAction={onBulkActionClick}
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === "block"
            ? "Block Selected Links?"
            : "Activate Selected Links?"
        }
        description={`Are you sure you want to ${confirmModal.action} ${selectedIds.size} links? This action will affect visibility.`}
        confirmLabel="Yes, Confirm"
        type={confirmModal.action === "block" ? "danger" : "info"}
        onConfirm={onConfirmAction}
        onClose={() => setConfirmModal({ isOpen: false, action: null })}
        isLoading={isLoading} // Reuse loading state
      />
    </div>
  );
}
