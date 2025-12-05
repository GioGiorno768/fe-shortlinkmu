"use client";

import { useState } from "react";
import { WithdrawalDetail } from "@/types/type";
import WithdrawalHistoryItem from "./WithdrawalHistoryItem";
import Pagination from "@/components/dashboard/Pagination";
import { Clock } from "lucide-react";

interface Props {
  history: WithdrawalDetail["history"];
}

const ITEMS_PER_PAGE = 8;

export default function WithdrawalHistoryTab({ history }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-[1.6em] font-bold text-shortblack">
          No History Yet
        </h3>
        <p className="text-gray-400 text-[1.2em]">
          This user has no previous withdrawal transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentItems.map((item) => (
          <WithdrawalHistoryItem key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
