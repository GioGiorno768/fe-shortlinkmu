"use client";

import {
  Search,
  ChevronDown,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import clsx from "clsx";
import type { AdminUser, UserStatus } from "@/types/type";
import { useClickOutside } from "@/hooks/useClickOutside";
import UserListCard from "./UserListCard";
import Pagination from "@/components/dashboard/Pagination";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onToggleStatus: (id: string, status: UserStatus) => void;
  // Selection Props
  selectedIds: Set<string>;
  isAllSelected: boolean; // <--- New Prop
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
}

export default function UserTable({
  users,
  isLoading,
  page,
  setPage,
  totalPages,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onToggleStatus,
  selectedIds,
  isAllSelected, // <--- Destructure
  onToggleSelection,
  onSelectAll,
}: UserTableProps) {
  // Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useClickOutside(filterRef, () => setIsFilterOpen(false));

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif Aja" },
    { value: "suspended", label: "Yg Kena Suspend" },
    { value: "process", label: "Lagi Diproses" },
  ];

  const currentFilterLabel =
    filterOptions.find((o) => o.value === statusFilter)?.label ||
    "Semua Status";

  // const isAllSelected = users.length > 0 && selectedIds.size === users.length; // REMOVE THIS LOCAL CALC

  return (
    <div className="space-y-6 font-figtree">
      {/* HEADER & FILTERS */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <h3 className="text-[1.8em] font-bold text-shortblack">
          User Management
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto ">
          {/* Custom Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blues border border-blue-100 text-[1.4em] font-medium text-shortblack hover:bg-blue-50 transition-colors w-full sm:w-auto justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-bluelight" />
                <span>{currentFilterLabel}</span>
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 w-full sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1.5 z-40"
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsFilterOpen(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-lg text-[1.3em] font-medium transition-colors flex items-center justify-between",
                        statusFilter === option.value
                          ? "bg-blue-50 text-bluelight"
                          : "text-shortblack hover:bg-slate-50"
                      )}
                    >
                      {option.label}
                      {statusFilter === option.value && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack transition-all"
            />
          </div>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="p-12 text-center text-grays bg-white rounded-3xl border border-gray-100">
            Lagi loading data user nih...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-grays bg-white rounded-3xl border border-gray-100">
            Gak nemu user yang dicari.
          </div>
        ) : (
          users.map((user) => (
            <UserListCard
              key={user.id}
              user={user}
              isSelected={isAllSelected || selectedIds.has(user.id)} // <--- Update Logic
              onClick={() => onToggleSelection(user.id)}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && users.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
