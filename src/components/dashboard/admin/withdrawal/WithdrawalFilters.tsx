"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Activity, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import type { AdminWithdrawalFilters } from "@/types/type";

interface Props {
  filters: AdminWithdrawalFilters;
  setFilters: (f: AdminWithdrawalFilters) => void;
}

export default function WithdrawalFilters({ filters, setFilters }: Props) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (
        levelRef.current &&
        !levelRef.current.contains(event.target as Node)
      ) {
        setIsLevelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Paid", value: "paid" },
    { label: "Rejected", value: "rejected" },
  ];

  const levelOptions = [
    { label: "All Levels", value: "all" },
    { label: "Highest Level", value: "highest" },
    { label: "Lowest Level", value: "lowest" },
  ];

  const getSortLabel = () => {
    return sortOptions.find((o) => o.value === filters.sort)?.label || "Newest";
  };

  const getStatusLabel = () => {
    return (
      statusOptions.find((o) => o.value === filters.status)?.label ||
      "All Status"
    );
  };

  const getLevelLabel = () => {
    return (
      levelOptions.find((o) => o.value === filters.level)?.label || "All Levels"
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex flex-col gap-5">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-[1.8em] font-bold text-shortblack">
            Manage Withdrawals
          </h3>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Search by account name, email, or transaction ID..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsStatusOpen(false);
                setIsLevelOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-[1.4em] min-w-[130px] justify-between"
            >
              <Calendar className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
                {getSortLabel()}
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
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, sort: opt.value });
                        setIsSortOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                        filters.sort === opt.value
                          ? "bg-blues text-bluelight font-medium"
                          : "text-shortblack"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsSortOpen(false);
                setIsLevelOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-[1.4em] min-w-[140px] justify-between"
            >
              <Activity className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
                {getStatusLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isStatusOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden"
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, status: opt.value });
                        setIsStatusOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                        filters.status === opt.value
                          ? "bg-blues text-bluelight font-medium"
                          : "text-shortblack"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Level Filter Dropdown */}
          <div className="relative" ref={levelRef}>
            <button
              onClick={() => {
                setIsLevelOpen(!isLevelOpen);
                setIsSortOpen(false);
                setIsStatusOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-[1.4em] min-w-[140px] justify-between"
            >
              <User className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
                {getLevelLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isLevelOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isLevelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden"
                >
                  {levelOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, level: opt.value });
                        setIsLevelOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-blues transition-colors",
                        filters.level === opt.value
                          ? "bg-blues text-bluelight font-medium"
                          : "text-shortblack"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
