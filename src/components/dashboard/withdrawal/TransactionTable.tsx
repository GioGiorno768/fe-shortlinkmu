// src/components/dashboard/withdrawal/TransactionTable.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  XCircle,
  ChevronDown,
  Calendar,
  Wallet,
  ExternalLink,
  Filter,
} from "lucide-react";
import clsx from "clsx";
import type { Transaction } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion, AnimatePresence } from "motion/react";
import Pagination from "../Pagination";

interface TransactionTableProps {
  transactions: Transaction[];
  onCancel: (id: string) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  sortOrder: "newest" | "oldest";
  setSortOrder: (s: "newest" | "oldest") => void;
  methodFilter: string;
  setMethodFilter: (m: string) => void;
  availableMethods?: string[]; // List of payment methods for filter
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
  sortOrder,
  setSortOrder,
  methodFilter,
  setMethodFilter,
  availableMethods = [],
  isLoading,
}: TransactionTableProps) {
  const { format: formatCurrency } = useCurrency();

  // Dropdown states (for UI only)
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

  // Refs for click outside detection
  const sortRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        methodRef.current &&
        !methodRef.current.contains(event.target as Node)
      ) {
        setIsMethodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      case "cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  // Use availableMethods for dropdown, or extract from current transactions as fallback
  const paymentMethods = useMemo(() => {
    if (availableMethods.length > 0) {
      return ["all", ...availableMethods];
    }
    // Fallback: extract from visible transactions
    const methods = new Set(transactions.map((tx) => tx.method));
    return ["all", ...Array.from(methods)];
  }, [availableMethods, transactions]);

  const getTotalAmount = (tx: Transaction) => {
    return (
      (parseFloat(String(tx.amount)) || 0) + (parseFloat(String(tx.fee)) || 0)
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 font-figtree">
      {/* Header with Filters */}
      <div className="p-6 md:p-8 border-b border-gray-100">
        <div className="flex flex-col gap-6">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <h3 className="text-[1.8em] font-bold text-shortblack">
              Transaction History
            </h3>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <input
                type="text"
                placeholder="Search by Transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsMethodOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-[1.4em] min-w-[140px] justify-between"
              >
                <Calendar className="w-4 h-4 text-grays" />
                <span className="text-shortblack font-medium">
                  {sortOrder === "newest" ? "Terbaru" : "Terlama"}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-grays transition-transform",
                    isSortOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setSortOrder("newest");
                        setIsSortOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                        sortOrder === "newest"
                          ? "bg-blues text-bluelight font-medium"
                          : "text-shortblack"
                      )}
                    >
                      Terbaru
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder("oldest");
                        setIsSortOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                        sortOrder === "oldest"
                          ? "bg-blues text-bluelight font-medium"
                          : "text-shortblack"
                      )}
                    >
                      Terlama
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Method Filter Dropdown */}
            <div className="relative" ref={methodRef}>
              <button
                onClick={() => {
                  setIsMethodOpen(!isMethodOpen);
                  setIsSortOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-[1.4em] min-w-[140px] justify-between"
              >
                <Filter className="w-4 h-4 text-grays" />
                <span className="text-shortblack font-medium truncate max-w-[80px]">
                  {methodFilter === "all" ? "Semua" : methodFilter}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-grays transition-transform",
                    isMethodOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {isMethodOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {paymentMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setMethodFilter(method);
                          setIsMethodOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                          methodFilter === method
                            ? "bg-blues text-bluelight font-medium"
                            : "text-shortblack"
                        )}
                      >
                        {method === "all" ? "Semua Metode" : method}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-12 text-center text-grays text-[1.4em]">
            Loading data...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 md:p-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left: Date, ID, Method */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Date & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[1.3em] text-grays">
                      {formatDate(tx.date)}
                    </span>
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-[1.1em] font-semibold border capitalize",
                        getStatusStyle(tx.status)
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>

                  {/* Transaction ID */}
                  <div className="text-[1.2em] font-mono text-grays mb-3">
                    {tx.txId || `#${tx.id}`}
                  </div>

                  {/* Method Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Wallet className="w-4 h-4 text-bluelight" />
                    <span className="text-[1.4em] font-semibold text-shortblack">
                      {tx.method}
                    </span>
                    <span className="text-[1.3em] text-grays">·</span>
                    {tx.accountName && (
                      <>
                        <span className="text-[1.3em] text-shortblack font-medium">
                          {tx.accountName}
                        </span>
                        <span className="text-[1.3em] text-grays">·</span>
                      </>
                    )}
                    <span className="text-[1.3em] text-grays font-mono">
                      {tx.account}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Amount */}
                  <div className="text-right">
                    <div className="text-[1.6em] font-bold text-shortblack">
                      {formatCurrency(getTotalAmount(tx))}
                    </div>
                    <div className="text-[1.2em] text-grays">
                      Fee: {formatCurrency(parseFloat(String(tx.fee)) || 0)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {tx.status === "pending" && (
                      <button
                        onClick={() => onCancel(tx.id)}
                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Batalkan"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    {tx.txId && (
                      <button
                        className="p-2.5 text-bluelight hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Lihat Detail"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="text-grays text-[1.4em]">
              {search || methodFilter !== "all"
                ? "Tidak ada transaksi yang cocok dengan filter."
                : "Belum ada riwayat transaksi."}
            </div>
          </div>
        )}
      </div>

      {/* Footer Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
