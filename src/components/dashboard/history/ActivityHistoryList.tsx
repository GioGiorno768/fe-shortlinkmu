"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ActivityItem from "./ActivityItem";
import type { ActivityLog, ActivityType } from "@/types/type";
import clsx from "clsx";

interface ActivityHistoryListProps {
  activities: ActivityLog[];
}

type FilterType = "all" | ActivityType;

export default function ActivityHistoryList({
  activities,
}: ActivityHistoryListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Kita set 10 item per halaman

  // Filter Options
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "login", label: "Login" },
    { id: "security", label: "Keamanan" },
    { id: "link", label: "Link" },
    { id: "payment", label: "Pembayaran" },
  ];

  // 1. Logic Filtering (Search & Kategori)
  const filteredData = useMemo(() => {
    return activities.filter((item) => {
      const matchType = filter === "all" || item.type === filter;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [activities, filter, search]);

  // Reset page ke 1 kalo filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // 2. Logic Pagination (Potong data)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Logic Grouping by Date (Hanya untuk item di halaman ini)
  const groupedData = useMemo(() => {
    const groups: Record<string, ActivityLog[]> = {};
    currentItems.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [currentItems]);

  // Handler Ganti Halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Opsional: Scroll ke atas list pas ganti page
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* --- Header: Search & Filter --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Tabs Filter */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar-minimal">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`
                px-5 py-2.5 rounded-xl text-[1.4em] font-medium transition-all whitespace-nowrap
                ${
                  filter === f.id
                    ? "bg-bluelight text-white shadow-md shadow-blue-200"
                    : "text-grays hover:bg-blues hover:text-shortblack"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grays" />
          <input
            type="text"
            placeholder="Cari aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-blues border-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack placeholder:text-gray-400 transition-all"
          />
        </div>
      </div>

      {/* --- Timeline Content --- */}
      <div className="space-y-8 min-h-[400px]">
        {Object.keys(groupedData).length > 0 ? (
          <>
            {Object.entries(groupedData).map(([date, items], groupIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                {/* Sticky Date Header */}
                <div className="sticky top-[80px] z-10 py-4 bg-slate-50/95 backdrop-blur-sm mb-4">
                  <h3 className="text-[1.4em] font-bold text-shortblack uppercase tracking-wider flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-bluelight"></span>
                    {date}
                  </h3>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <ActivityItem
                      key={item.id}
                      item={item}
                      isLast={
                        index === items.length - 1 &&
                        groupIndex === Object.keys(groupedData).length - 1
                      }
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={clsx(
                        "w-10 h-10 rounded-xl text-[1.4em] font-bold transition-all",
                        currentPage === page
                          ? "bg-bluelight text-white shadow-md shadow-blue-200"
                          : "bg-white border border-gray-200 text-shortblack hover:bg-blues"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <CalendarOff className="w-10 h-10" />
            </div>
            <h3 className="text-[1.8em] font-bold text-shortblack">
              Tidak ada aktivitas ditemukan
            </h3>
            <p className="text-[1.4em] text-grays max-w-md">
              Coba ubah filter atau kata kunci pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
