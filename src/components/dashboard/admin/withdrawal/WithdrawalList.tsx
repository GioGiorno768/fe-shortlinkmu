"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import WithdrawalItem from "./WithdrawalItem";
import WithdrawalFilters from "./WithdrawalFilters";
import WithdrawalActionModal from "./WithdrawalActionModal";
import type { RecentWithdrawal, AdminWithdrawalFilters } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";
import Pagination from "@/components/dashboard/Pagination";
import * as withdrawalService from "@/services/withdrawalService";

interface Props {
  transactions: RecentWithdrawal[];
  isLoading: boolean;
  search: string;
  setSearch: (s: string) => void;
  filters: AdminWithdrawalFilters;
  setFilters: (f: AdminWithdrawalFilters) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  onApprove: (id: string, currentStatus: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddProof: (id: string, url: string) => void;
  onPayWithProof: (id: string, url: string) => void;
}

export default function WithdrawalList({
  transactions,
  isLoading,
  search,
  setSearch,
  filters,
  setFilters,
  page,
  setPage,
  totalPages,
  onApprove,
  onReject,
  onAddProof,
  onPayWithProof,
}: Props) {
  const { showAlert } = useAlert();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "reject" | "proof" | "pay" | null; // Added "pay"
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleModalSubmit = async (value: string) => {
    if (!modalState.id) return;
    setIsProcessing(true);
    try {
      if (modalState.type === "reject") {
        await onReject(modalState.id, value);
      } else if (modalState.type === "pay") {
        await onPayWithProof(modalState.id, value);
      } else {
        await onAddProof(modalState.id, value);
      }
      setModalState({ isOpen: false, type: null, id: null });
    } finally {
      setIsProcessing(false);
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
            placeholder="Search Transaction ID, Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack"
          />
        </div>

        {/* Filter */}
        <WithdrawalFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* LIST */}
      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-grays text-[1.4em]">
            No transactions found matching your criteria.
          </div>
        ) : (
          transactions.map((trx) => (
            <WithdrawalItem
              key={trx.id}
              trx={trx}
              onApprove={onApprove}
              onReject={onReject}
              onAddProof={onAddProof}
              openRejectModal={(id) =>
                setModalState({ isOpen: true, type: "reject", id })
              }
              openPayModal={(id) =>
                setModalState({ isOpen: true, type: "pay", id })
              }
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && transactions.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* ACTION MODAL */}
      <WithdrawalActionModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSubmit={handleModalSubmit}
        isLoading={isProcessing}
      />
    </div>
  );
}
