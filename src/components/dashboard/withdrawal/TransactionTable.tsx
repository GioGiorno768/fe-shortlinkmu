// src/components/dashboard/withdrawal/TransactionTable.tsx
"use client";

import {
  Search,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import type { Transaction } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

interface TransactionTableProps {
  transactions: Transaction[];
  onCancel: (id: string) => void;
  // Props Kontrol dari Hook
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  isLoading?: boolean;
}

export default function TransactionTable({
  transactions,
  onCancel,
  page,
  setPage,
  totalPages,
  search,
  setSearch,
  isLoading,
}: TransactionTableProps) {
  // 💱 Use global currency context
  const { format: formatCurrency } = useCurrency();
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8 font-figtree">
      {/* Header & Search */}
      <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
        <h3 className="text-[1.8em] font-bold text-shortblack">
          Transaction History
        </h3>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Search ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-blues text-bluelight rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blues text-grays uppercase text-[1.2em] font-bold tracking-wider">
            <tr>
              <th className="px-4 md:px-8 py-3 md:py-5">Date & ID</th>
              <th className="px-4 md:px-8 py-3 md:py-5">Method</th>
              <th className="px-4 md:px-8 py-3 md:py-5">Amount</th>
              <th className="px-4 md:px-8 py-3 md:py-5 text-center">Status</th>
              <th className="px-4 md:px-8 py-3 md:py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-grays text-[1.4em]"
                >
                  Loading data...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 md:px-8 py-3 md:py-5">
                    <div className="font-bold text-shortblack text-[1.4em] sm:w-fit w-[8em]">
                      {formatDate(tx.date)}
                    </div>
                    <div className="text-grays text-[1.2em] font-mono">
                      #{tx.id}
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-5">
                    <div className="text-shortblack text-[1.4em] font-medium">
                      {tx.method}
                    </div>
                    <div className="text-grays text-[1.2em]">{tx.account}</div>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-5 font-bold text-shortblack text-[1.4em]">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-5 text-center">
                    <span
                      className={clsx(
                        "px-4 py-1.5 rounded-full text-[1.2em] font-bold border uppercase tracking-wide",
                        getStatusColor(tx.status)
                      )}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tx.status === "pending" && (
                        <button
                          onClick={() => onCancel(tx.id)}
                          className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Batalkan Request"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      {tx.txId && (
                        <button
                          className="text-bluelight hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                          title="Lihat Bukti"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-grays text-[1.4em]"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-[1.4em] font-medium px-4 text-grays">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
