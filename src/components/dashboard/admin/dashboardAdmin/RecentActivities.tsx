"use client";

import type { RecentWithdrawal, RecentUser, AdminLink } from "@/types/type";
import RecentWithdrawalsCard from "./RecentWithdrawalsCard";
import RecentLinksCard from "./RecentLinksCard";

interface RecentActivitiesProps {
  withdrawals: RecentWithdrawal[];
  users: RecentUser[];
  links?: AdminLink[]; // Optional for now to avoid breaking if not passed immediately
  isLoading: boolean;
  currentWithdrawalFilter?: string;
  onWithdrawalFilterChange?: (filter: string) => void;
  currentUserFilter?: string;
  onUserFilterChange?: (filter: string) => void;
  onApproveWithdrawal?: (id: string) => void;
}

export default function RecentActivities({
  withdrawals,
  users,
  links = [],
  isLoading,
  currentWithdrawalFilter = "all",
  onWithdrawalFilterChange,
  currentUserFilter = "all",
  onUserFilterChange,
  onApproveWithdrawal,
}: RecentActivitiesProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8 font-figtree text-[10px]">
      <RecentWithdrawalsCard
        withdrawals={withdrawals}
        isLoading={isLoading}
        currentFilter={currentWithdrawalFilter}
        onFilterChange={onWithdrawalFilterChange}
        onApprove={onApproveWithdrawal}
      />
      <RecentLinksCard
        links={links}
        isLoading={isLoading}
        currentFilter={currentUserFilter}
        onFilterChange={onUserFilterChange}
      />
    </div>
  );
}
