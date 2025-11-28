// src/components/dashboard/LinkList.tsx
"use client";

import { useState, useMemo } from "react";
import { useAlert } from "@/hooks/useAlert";
import type { Shortlink, FilterByType, SortByType, EditableLinkData } from "@/types/type";
import clsx from "clsx";
import LinkFilters from "./LinkFilters";
import LinkItem from "./LinkItem";
import EditLinkModal from "../EditLinkModal";
import ConfirmationModal from "../ConfirmationModal";

interface LinkListProps {
  links: Shortlink[];
  onUpdateLink: (id: string, newData: EditableLinkData) => Promise<void>;
  onDisableLink: (id: string, currentStatus: "active" | "disabled") => Promise<void>;
}

export default function LinkList({ links, onUpdateLink, onDisableLink }: LinkListProps) {
  const { showAlert } = useAlert();

  // --- STATE FILTER & SORT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<FilterByType>("date");
  const [sortBy, setSortBy] = useState<SortByType>("highest");
  
  // --- STATE PAGINATION & UI ---
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const linksPerPage = 10;

  // --- STATE MODAL ---
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Shortlink | null>(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    linkId: "",
    status: "" as "active" | "disabled",
    isLoading: false
  });

  // --- LOGIC FILTERING (Client Side) ---
  const processedLinks = useMemo(() => {
    // 1. Filter
    let filtered = links.filter((link) => {
        const s = searchTerm.toLowerCase();
        const matchSearch = link.title.toLowerCase().includes(s) || link.shortUrl.toLowerCase().includes(s) || link.originalUrl.toLowerCase().includes(s);
        
        if (!matchSearch) return false;
        if (filterBy === "linkEnabled") return link.status === "active";
        if (filterBy === "linkDisabled") return link.status === "disabled";
        if (filterBy === "linkPassword") return link.passwordProtected;
        if (filterBy === "dateExpired") return !!link.dateExpired;
        return true;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
        let valA: any, valB: any;
        switch(filterBy) {
            case "validViews": [valA, valB] = [a.validViews, b.validViews]; break;
            case "totalEarning": [valA, valB] = [a.totalEarning, b.totalEarning]; break;
            case "avgCPM": [valA, valB] = [a.averageCPM, b.averageCPM]; break;
            // Default: Date Created
            default: [valA, valB] = [new Date(a.dateCreated).getTime(), new Date(b.dateCreated).getTime()];
        }
        // Logic Sort (Highest/Lowest)
        if (sortBy === "highest") return valA < valB ? 1 : -1;
        return valA > valB ? 1 : -1;
    });
  }, [links, searchTerm, filterBy, sortBy]);

  // Reset Pagination kalau filter berubah
  if (currentPage > Math.ceil(processedLinks.length / linksPerPage) && currentPage > 1) {
      setCurrentPage(1);
  }

  // Pagination Slice
  const totalPages = Math.ceil(processedLinks.length / linksPerPage);
  const displayedLinks = processedLinks.slice((currentPage - 1) * linksPerPage, currentPage * linksPerPage);

  // Handlers
  const handleEditClick = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) { setEditingLink(link); setEditModalOpen(true); }
  };

  const handleDisableClick = (id: string, status: "active" | "disabled") => {
    setConfirmModal({ isOpen: true, linkId: id, status, isLoading: false });
  };

  const executeDisable = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    await onDisableLink(confirmModal.linkId, confirmModal.status);
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="rounded-xl mt-6 text-[10px]">
      
      {/* COMPONENT: Filter Header */}
      <LinkFilters 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterBy={filterBy} setFilterBy={setFilterBy}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      {/* LIST LOOPING */}
      <div className="space-y-3">
        {displayedLinks.length === 0 ? (
          <p className="text-center text-grays py-8">No links found matching criteria.</p>
        ) : (
          displayedLinks.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              isExpanded={expandedLink === link.id}
              onToggleExpand={() => setExpandedLink(expandedLink === link.id ? null : link.id)}
              onEdit={handleEditClick}
              onToggleStatus={handleDisableClick}
            />
          ))
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
             <button 
                disabled={currentPage===1} 
                onClick={() => setCurrentPage(p => p-1)} 
                className="text-[1.6em] px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-shortblack hover:bg-blues transition-colors"
             >
                Previous
             </button>
             
             <span className="text-[1.6em] px-2 text-grays font-medium">
                Page {currentPage} of {totalPages}
             </span>
             
             <button 
                disabled={currentPage===totalPages} 
                onClick={() => setCurrentPage(p => p+1)} 
                className="text-[1.6em] px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-shortblack hover:bg-blues transition-colors"
             >
                Next
             </button>
        </div>
      )}

      {/* MODALS */}
      <EditLinkModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={editingLink ? { 
            alias: editingLink.shortUrl.split("/").pop() || "", 
            password: editingLink.password, 
            expiresAt: editingLink.dateExpired ? new Date(editingLink.dateExpired).toISOString().slice(0,16) : "", 
            adsLevel: editingLink.adsLevel 
        } : null}
        isUpdating={false}
        onSubmit={async (data) => {
            if(editingLink) {
                await onUpdateLink(editingLink.id, data);
                setEditModalOpen(false);
            }
        }}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeDisable}
        title={confirmModal.status === "active" ? "Disable Link?" : "Enable Link?"}
        description={confirmModal.status === "active" ? "Link ini tidak akan bisa diakses oleh publik. Yakin?" : "Link akan diaktifkan kembali dan bisa diakses publik."}
        confirmLabel={confirmModal.status === "active" ? "Ya, Disable" : "Ya, Enable"}
        type={confirmModal.status === "active" ? "danger" : "success"}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
}