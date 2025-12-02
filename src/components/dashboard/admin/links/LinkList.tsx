"use client";

import { useState } from "react";
import LinkItem from "./LinkItem";
import LinkFilters from "./LinkFilters";
import BulkActionBar from "./BulkActionBar";
import { Search, Loader2 } from "lucide-react";
import type { AdminLink, AdminLinkFilters } from "@/types/type";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import Pagination from "@/components/dashboard/Pagination";
import MessageModal from "./MessageModal";
import { useAlert } from "@/hooks/useAlert";
import * as adminLinkService from "@/services/adminLinkService";

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
  handleBulkAction: (
    action: "activate" | "block",
    targetIds?: string[],
    reason?: string
  ) => Promise<void>;
  deselectAll: () => void;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  totalLinks: number;
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
  deselectAll,
  page,
  totalPages,
  setPage,
  totalLinks,
}: LinkListProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "activate" | "block" | null;
    targetId: string | null;
  }>({ isOpen: false, action: null, targetId: null });

  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    linkId: string | null;
    linkTitle?: string;
  }>({ isOpen: false, linkId: null });

  const { showAlert } = useAlert();

  const onBulkActionClick = (action: "activate" | "block") => {
    setConfirmModal({ isOpen: true, action, targetId: null });
  };

  const onConfirmAction = async (reason?: string) => {
    if (confirmModal.action) {
      const ids = confirmModal.targetId ? [confirmModal.targetId] : undefined;
      await handleBulkAction(confirmModal.action, ids, reason);
      setConfirmModal({ isOpen: false, action: null, targetId: null });
    }
  };

  const onSingleAction = (id: string, action: "activate" | "block") => {
    setConfirmModal({ isOpen: true, action, targetId: id });
  };

  const onMessageClick = (id: string) => {
    const link = links.find((l) => l.id === id);
    setMessageModal({
      isOpen: true,
      linkId: id,
      linkTitle: link?.title || link?.shortUrl,
    });
  };

  const handleSendMessage = async (
    message: string,
    type: "warning" | "announcement"
  ) => {
    if (!messageModal.linkId) return;

    try {
      await adminLinkService.sendMessageToUser(
        messageModal.linkId,
        message,
        type
      );
      showAlert("Message sent successfully!", "success");
      setMessageModal({ isOpen: false, linkId: null });
    } catch (error) {
      showAlert("Failed to send message.", "error");
    }
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
              onMessage={onMessageClick}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && links.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* BULK ACTION BAR */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        totalItems={totalLinks} // Use totalLinks instead of visible length
        onSelectAll={selectAll}
        onDeselectAll={deselectAll} // Logic toggle sama
        onAction={onBulkActionClick}
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === "block"
            ? confirmModal.targetId
              ? "Block This Link?"
              : "Block Selected Links?"
            : confirmModal.targetId
            ? "Activate This Link?"
            : "Activate Selected Links?"
        }
        description={
          confirmModal.targetId
            ? `Are you sure you want to ${confirmModal.action} this link?`
            : `Are you sure you want to ${confirmModal.action} ${selectedIds.size} links? This action will affect visibility.`
        }
        confirmLabel="Yes, Confirm"
        type={confirmModal.action === "block" ? "danger" : "info"}
        onConfirm={onConfirmAction}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: null, targetId: null })
        }
        isLoading={isLoading} // Reuse loading state
        showReasonInput={confirmModal.action === "block"}
        reasonPlaceholder="Please provide a reason for blocking..."
      />

      {/* MESSAGE MODAL */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, linkId: null })}
        onSend={handleSendMessage}
        linkTitle={messageModal.linkTitle}
        isLoading={isLoading}
      />
    </div>
  );
}
