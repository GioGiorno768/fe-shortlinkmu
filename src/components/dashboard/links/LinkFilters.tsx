"use client";

import { useState, useRef } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { MemberLinkFilters } from "@/types/type";

interface LinkFiltersProps {
  filters: MemberLinkFilters;
  setFilters: (f: MemberLinkFilters) => void;
}

export default function LinkFilters({ filters, setFilters }: LinkFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  const sections = [
    {
      title: "Sort By",
      key: "sort",
      options: [
        { label: "Newest Created", value: "newest" },
        { label: "Oldest Created", value: "oldest" },
        { label: "Highest Views", value: "most_views" },
        { label: "Lowest Views", value: "least_views" },
        { label: "Highest Earnings", value: "most_earnings" },
        { label: "Lowest Earnings", value: "least_earnings" },
      ],
    },
    {
      title: "Status",
      key: "status",
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Disabled", value: "disabled" },
        { label: "Expired", value: "expired" },
        { label: "Password Protected", value: "password" },
      ],
    },
    {
      title: "Ads Level",
      key: "adsLevel",
      options: [
        { label: "All Levels", value: "all" },
        { label: "No Ads", value: "noAds" },
        { label: "Level 1", value: "level1" },
        { label: "Level 2", value: "level2" },
        { label: "Level 3", value: "level3" },
        { label: "Level 4", value: "level4" },
      ],
    },
  ];

  const handleSelect = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setIsOpen(false);
  };

  const activeLabels = [
    sections[0].options.find((o) => o.value === filters.sort)?.label,
    filters.status !== "all"
      ? sections[1].options.find((o) => o.value === filters.status)?.label
      : null,
    filters.adsLevel !== "all"
      ? sections[2].options.find((o) => o.value === filters.adsLevel)?.label
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col bg-white md:flex-row items-center justify-between gap-4 mb-6 shadow-sm shadow-slate-500/50 p-6 rounded-xl">
      {/* SEARCH BAR - Integrated here or passed? 
          Wait, Admin LinkFilters has search input inside "LinkList" toolbar, 
          but here in member LinkFilters.tsx (old) it had search input.
          The Admin 'LinkFilters' component ONLY handled the dropdown.
          The member 'LinkFilters' (old) was a Toolbar + Dropdown.
          
          I should recreate the Toolbar structure here because LinkList uses it as a single block.
      */}

      {/* SEARCH BAR */}
      <div className="relative w-full md:max-w-xs">
        {/* Re-using Search Input from old LinkFilters but with new state */}
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search..."
          className="w-full text-[1.6em] px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight bg-blues"
        />
      </div>

      {/* FILTER DROPDOWN */}
      <div className="relative w-full md:w-auto z-20" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blues border border-blue-100 text-[1.4em] font-medium text-shortblack hover:bg-blue-50 transition-colors w-full sm:w-auto justify-between min-w-[200px]"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Filter className="w-5 h-5 text-bluelight shrink-0" />
            <span className="truncate">{activeLabels || "Filters"}</span>
          </div>
          <ChevronDown
            className={clsx(
              "w-5 h-5 text-grays transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden flex flex-col"
            >
              <div
                onWheel={(e) => e.stopPropagation()}
                className="max-h-[350px] overflow-y-auto custom-scrollbar-minimal p-2"
              >
                {sections.map((section) => (
                  <div key={section.title} className="mb-4 last:mb-0">
                    <h4 className="text-[1.1em] font-bold text-grays uppercase tracking-wider px-3 py-2">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.options.map((opt) => {
                        const isSelected =
                          (filters as any)[section.key] === opt.value ||
                          (!(filters as any)[section.key] &&
                            opt.value === "all");
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(section.key, opt.value)}
                            className={clsx(
                              "w-full text-left px-3 py-2 rounded-lg text-[1.3em] transition-colors flex items-center justify-between group",
                              isSelected
                                ? "bg-blue-50 text-bluelight font-semibold"
                                : "text-shortblack hover:bg-slate-50"
                            )}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="h-px bg-gray-100 mt-3 mx-2" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
