// src/app/[locale]/(admin)/admin/withdrawals/page.tsx
"use client";

import WithdrawalList from "@/components/dashboard/admin/withdrawal/WithdrawalList";
import WithdrawalStatsCard from "@/components/dashboard/admin/withdrawal/WithdrawalStatsCard";
import { useAdminWithdrawals } from "@/hooks/admin/useAdminWithdrawals";

export default function WithdrawalPage() {
  // 1. Panggil Hook Sakti
  const {
    stats,
    transactions,
    isLoading,
    // Filter & Search
    search,
    setSearch,
    filters,
    setFilters,
    // Pagination
    page,
    setPage,
    totalPages,
    // Actions
    handleApprove,
    handleReject,
    handleAddProof,
    handlePayWithProof,
  } = useAdminWithdrawals();

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* 2. Stats Row (Financial Overview) */}
      <WithdrawalStatsCard stats={stats} isLoading={isLoading} />

      {/* 3. Main List (Search + Filter + Table + Pagination) */}
      <WithdrawalList
        transactions={transactions}
        isLoading={isLoading}
        // State Props
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        // Action Props
        onApprove={handleApprove}
        onReject={handleReject}
        onAddProof={handleAddProof}
        onPayWithProof={handlePayWithProof}
      />
    </div>
  );
}
