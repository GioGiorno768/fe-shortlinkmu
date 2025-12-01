"use client";

import type { RecentWithdrawal, RecentUser } from "@/types/type";
import RecentWithdrawalsCard from "./RecentWithdrawalsCard";
import NewUsersCard from "./NewUsersCard";

interface RecentActivitiesProps {
  withdrawals: RecentWithdrawal[];
  users: RecentUser[];
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
      <NewUsersCard
        users={users}
        isLoading={isLoading}
        currentFilter={currentUserFilter}
        onFilterChange={onUserFilterChange}
      />
    </div>
  );
}
