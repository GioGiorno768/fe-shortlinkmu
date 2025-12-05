"use client";

import { useState, useRef } from "react";
import {
  Filter,
  ChevronDown,
  Check,
  ArrowDownUp,
  User,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { AdminWithdrawalFilters } from "@/types/type";

interface Props {
  filters: AdminWithdrawalFilters;
  setFilters: (f: AdminWithdrawalFilters) => void;
}

export default function WithdrawalFilters({ filters, setFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  const sections = [
    {
      id: "status",
      title: "Status",
      icon: Activity,
      options: [
        { label: "All Status", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Paid", value: "paid" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      id: "sort",
      title: "Sort Date",
      icon: ArrowDownUp,
      options: [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
      ],
    },
    {
      id: "level",
      title: "User Level",
      icon: User,
      options: [
        { label: "All Levels", value: "all" },
        { label: "Highest Level", value: "highest" },
        { label: "Lowest Level", value: "lowest" },
      ],
    },
  ];

  const handleSelect = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const getActiveCount = () => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.level && filters.level !== "all") count++;
    if (filters.sort && filters.sort !== "newest") count++;
    return count;
  };

  const activeCount = getActiveCount();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 min-w-[130px] justify-between group w-full sm:w-auto",
          isOpen || activeCount > 0
            ? "bg-shortblack text-white border-shortblack shadow-lg shadow-shortblack/20"
            : "bg-blues border-blue-100 text-shortblack hover:bg-blue-50"
        )}
      >
        <div className="flex items-center gap-2">
          <Filter
            className={clsx(
              "w-5 h-5",
              isOpen || activeCount > 0 ? "text-white" : "text-bluelight"
            )}
          />
          <span className="font-bold text-[1.1em]">Filter</span>
          {activeCount > 0 && (
            <span className="bg-bluelight text-white text-[0.8em] font-bold px-1.5 py-0.5 rounded-md text-center min-w-[20px]">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 transition-transform duration-200",
            isOpen && "rotate-180",
            isOpen || activeCount > 0 ? "text-white" : "text-grays"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-10 overflow-hidden flex flex-col origin-top-right"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-[1.1em] font-bold text-grays uppercase tracking-wider">
                Options
              </span>
              <button
                onClick={() =>
                  setFilters({ status: "all", sort: "newest", level: "all" })
                }
                className="text-[1em] font-bold text-bluelight hover:underline"
              >
                Reset
              </button>
            </div>

            {/* List Sections */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="overflow-y-auto max-h-[350px] custom-scrollbar-minimal p-2"
            >
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={clsx(
                    "mb-2",
                    idx !== sections.length - 1 &&
                      "border-b border-gray-100 pb-2"
                  )}
                >
                  <div className="px-3 py-2 flex items-center gap-2 text-shortblack font-bold text-[1.1em]">
                    <section.icon className="w-4 h-4 text-grays" />
                    {section.title}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {section.options.map((opt) => {
                      const currentVal = (filters as any)[section.id];
                      const isActive =
                        currentVal === opt.value ||
                        (!currentVal && opt.value === "all");

                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(section.id, opt.value)}
                          className={clsx(
                            "w-full text-left px-3 py-2.5 rounded-lg text-[1.1em] transition-all flex items-center justify-between group",
                            isActive
                              ? "bg-blue-50 text-bluelight font-bold"
                              : "text-grays hover:bg-gray-50 hover:text-shortblack"
                          )}
                        >
                          <span>{opt.label}</span>
                          {isActive && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
