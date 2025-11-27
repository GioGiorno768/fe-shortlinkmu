"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown, // Tambah icon ini
  Check, // Tambah icon ini buat indikator selected
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

  // State Dropdown Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Options
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "Semua Aktivitas" }, // Ganti label biar lebih jelas
    { id: "login", label: "Login & Session" },
    { id: "security", label: "Keamanan Akun" },
    { id: "link", label: "Manajemen Link" },
    { id: "payment", label: "Pembayaran & Saldo" },
  ];

  // Efek klik luar untuk nutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Logic Filtering
  const filteredData = useMemo(() => {
    return activities.filter((item) => {
      const matchType = filter === "all" || item.type === filter;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [activities, filter, search]);

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // 2. Logic Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Logic Grouping
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper dapetin label filter yang aktif
  const activeLabel = filters.find((f) => f.id === filter)?.label;

  return (
    <div className="space-y-8 font-figtree">
      {/* --- Header: Search & Filter --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Search Input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
          <input
            type="text"
            placeholder="Cari aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight text-[1.4em] text-shortblack placeholder:text-gray-400 transition-all shadow-sm"
          />
        </div>
        {/* DROPDOWN FILTER (Menggantikan Tabs) */}
        <div className="relative w-full md:w-auto z-20" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full md:w-[220px] px-4 py-3 bg-blues rounded-xl text-[1.4em] font-medium text-shortblack hover:bg-blue-100/50 transition-colors border border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-bluelight" />
              <span className="truncate">{activeLabel}</span>
            </div>
            <ChevronDown
              className={clsx(
                "w-5 h-5 text-grays transition-transform duration-200",
                isFilterOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1.5 min-w-[220px]"
              >
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFilter(f.id);
                      setIsFilterOpen(false);
                    }}
                    className={clsx(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[1.3em] transition-colors text-left",
                      filter === f.id
                        ? "bg-blue-50 text-bluelight font-bold"
                        : "text-shortblack hover:bg-gray-50"
                    )}
                  >
                    <span>{f.label}</span>
                    {filter === f.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Timeline Content (Sama kayak sebelumnya) --- */}
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
                <div className="sticky top-[80px] z-10 py-4 bg-slate-50/95 backdrop-blur-sm mb-4">
                  <h3 className="text-[1.4em] font-bold text-shortblack uppercase tracking-wider flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-bluelight"></span>
                    {date}
                  </h3>
                </div>

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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
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
                </div>

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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <CalendarOff className="w-10 h-10" />
            </div>
            <h3 className="text-[2em] font-bold text-shortblack mb-2">
              Tidak ada aktivitas ditemukan
            </h3>
            <p className="text-[1.5em] text-grays max-w-md leading-relaxed">
              Coba ganti filter <b>{activeLabel}</b> atau gunakan kata kunci
              lain.
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="mt-6 text-[1.4em] font-semibold text-bluelight hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
