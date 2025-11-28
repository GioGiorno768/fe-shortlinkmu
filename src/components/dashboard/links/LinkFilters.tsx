"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { FilterByType, SortByType } from "@/types/type";

interface LinkFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterBy: FilterByType;
  setFilterBy: (val: FilterByType) => void;
  sortBy: SortByType;
  setSortBy: (val: SortByType) => void;
}

export default function LinkFilters({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
}: LinkFiltersProps) {
  // State UI Lokal buat Dropdown
  const [openDropdown, setOpenDropdown] = useState<"filter" | "sort" | null>(
    null
  );
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Label Filter (Sama kayak aslinya)
  const filterOptions: { key: FilterByType; label: string }[] = [
    { key: "date", label: "By Date" },
    { key: "topLinks", label: "By Top Links" },
    { key: "dateExpired", label: "By Date Expired" },
    { key: "validViews", label: "By Valid Views" },
    { key: "totalEarning", label: "By Total Earning" },
    { key: "avgCPM", label: "By AVG CPM" },
    { key: "linkPassword", label: "By Link Password" },
    { key: "linkDisabled", label: "By Link Disabled" },
    { key: "linkEnabled", label: "By Link Enabled" },
  ];

  // Logic tutup dropdown kalau klik luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        openDropdown === "filter"
      ) {
        setOpenDropdown(null);
      }
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node) &&
        openDropdown === "sort"
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Logic kapan tombol Sort muncul
  const showSortDropdown = ["validViews", "totalEarning", "avgCPM"].includes(
    filterBy
  );

  return (
    <div className="flex flex-col bg-white md:flex-row items-center justify-between gap-4 mb-6 shadow-sm shadow-slate-500/50 p-6 rounded-xl">
      {/* SEARCH BAR */}
      <div className="relative w-full md:max-w-xs">
        <Search
          className="w-5 h-5 text-grays absolute left-4 top-1/2 -translate-y-1/2"
          strokeWidth={2.5}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full text-[1.6em] px-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
        />
      </div>

      {/* BUTTON GROUP */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* SORT DROPDOWN */}
        <AnimatePresence>
          {showSortDropdown && (
            <motion.div
              ref={sortRef}
              className="relative z-20"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "sort" ? null : "sort")
                }
                className="flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-blues transition-colors"
              >
                <span>{sortBy === "highest" ? "Highest" : "Lowest"}</span>
                <ChevronDown
                  className={clsx(
                    "w-5 h-5 text-grays transition-transform",
                    openDropdown === "sort" && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "sort" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 p-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100"
                  >
                    <button
                      onClick={() => {
                        setSortBy("highest");
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left text-[1.5em] px-3 py-2 rounded-md hover:bg-blues"
                    >
                      Highest
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("lowest");
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left text-[1.5em] px-3 py-2 rounded-md hover:bg-blues"
                    >
                      Lowest
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTER DROPDOWN */}
        <div ref={filterRef} className="relative w-full md:w-auto z-20">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "filter" ? null : "filter")
            }
            className="flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-blues transition-colors"
          >
            <span>{filterOptions.find((f) => f.key === filterBy)?.label}</span>
            <SlidersHorizontal className="w-5 h-5 text-grays" />
          </button>

          <AnimatePresence>
            {openDropdown === "filter" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full right-0 mt-2 p-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar-minimal"
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setFilterBy(opt.key);
                      setOpenDropdown(null);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.5em] px-3 py-2 rounded-md",
                      filterBy === opt.key
                        ? "text-bluelight font-semibold bg-blue-dashboard"
                        : "text-shortblack hover:bg-blues"
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
  );
}
