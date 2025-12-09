"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ChevronDown, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

interface AuditLogFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  adminFilter: string;
  onAdminFilterChange: (value: string) => void;
  actionType: string;
  onActionTypeChange: (value: string) => void;
  targetType: string;
  onTargetTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  adminsList: Array<{ id: string; name: string }>;
}

export default function AuditLogFilterBar({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  adminFilter,
  onAdminFilterChange,
  actionType,
  onActionTypeChange,
  targetType,
  onTargetTypeChange,
  status,
  onStatusChange,
  adminsList,
}: AuditLogFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<
    "date" | "admin" | "action" | "target" | "status" | null
  >(null);

  const dateRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters =
    search ||
    dateRange !== "all" ||
    adminFilter !== "all" ||
    actionType !== "all" ||
    targetType !== "all" ||
    status !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onDateRangeChange("all");
    onAdminFilterChange("all");
    onActionTypeChange("all");
    onTargetTypeChange("all");
    onStatusChange("all");
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = {
        date: dateRef,
        admin: adminRef,
        action: actionRef,
        target: targetRef,
        status: statusRef,
      };
      Object.entries(refs).forEach(([key, ref]) => {
        if (
          ref.current &&
          !ref.current.contains(event.target as Node) &&
          openDropdown === key
        ) {
          setOpenDropdown(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
  ];

  const adminOptions = [
    { value: "all", label: "All Admins" },
    ...adminsList.map((admin) => ({ value: admin.id, label: admin.name })),
  ];

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "create", label: "🆕 Create" },
    { value: "update", label: "✏️ Update" },
    { value: "delete", label: "🗑️ Delete" },
    { value: "suspend", label: "⛔ Suspend" },
    { value: "unsuspend", label: "✅ Unsuspend" },
    { value: "approve", label: "👍 Approve" },
    { value: "reject", label: "👎 Reject" },
    { value: "block", label: "🚫 Block" },
    { value: "unblock", label: "✔️ Unblock" },
  ];

  const targetOptions = [
    { value: "all", label: "All Targets" },
    { value: "user", label: "👤 User" },
    { value: "link", label: "🔗 Link" },
    { value: "withdrawal", label: "💰 Withdrawal" },
    { value: "admin", label: "👨‍💼 Admin" },
    { value: "announcement", label: "📢 Announcement" },
    { value: "ad_level", label: "📊 Ad Level" },
    { value: "system", label: "⚙️ System" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "success", label: "✅ Success" },
    { value: "failed", label: "❌ Failed" },
  ];

  const getDropdownLabel = (
    value: string,
    options: Array<{ value: string; label: string }>
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option?.label || "Select";
  };

  const renderDropdown = (
    ref: React.RefObject<HTMLDivElement | null>,
    type: "date" | "admin" | "action" | "target" | "status",
    value: string,
    options: Array<{ value: string; label: string }>,
    onChange: (val: string) => void,
    icon: React.ReactNode
  ) => (
    <div ref={ref} className="relative min-w-[160px] z-20">
      <button
        type="button"
        onClick={() => setOpenDropdown(openDropdown === type ? null : type)}
        className={clsx(
          "flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-blues transition-all duration-200 font-medium",
          value !== "all" && "border-bluelight bg-blue-50"
        )}
      >
        <span
          className={clsx(
            "flex items-center gap-2",
            value !== "all" && "text-bluelight font-semibold"
          )}
        >
          {icon}
          {getDropdownLabel(value, options)}
        </span>
        <ChevronDown
          className={clsx(
            "w-5 h-5 transition-transform duration-200",
            openDropdown === type && "rotate-180",
            value !== "all" ? "text-bluelight" : "text-gray-400"
          )}
        />
      </button>

      <AnimatePresence>
        {openDropdown === type && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 p-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar-minimal"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpenDropdown(null);
                }}
                className={clsx(
                  "block w-full text-left text-[1.5em] px-3 py-2.5 rounded-lg transition-colors",
                  value === opt.value
                    ? "text-bluelight font-semibold bg-blue-50"
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
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-300"
    >
      {/* Search + Dropdowns Row */}
      <div className="flex flex-col lg:flex-row gap-3 text-[0.9em] font-figtree">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-bluelight transition-colors duration-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by description, target, admin..."
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all duration-200 hover:border-gray-300 text-[1.6em]"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Date Range Dropdown */}
        {renderDropdown(
          dateRef,
          "date",
          dateRange,
          dateOptions,
          onDateRangeChange,
          <Calendar className="w-4 h-4" />
        )}

        {/* Admin Filter Dropdown */}
        {renderDropdown(
          adminRef,
          "admin",
          adminFilter,
          adminOptions,
          onAdminFilterChange,
          <Filter className="w-4 h-4" />
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearFilters}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:shadow-sm text-[1.6em]"
          >
            <X className="w-4 h-4" />
            Clear
          </motion.button>
        )}
      </div>

      {/* Second Row: Action, Target, Status */}
      <div className="flex flex-col md:flex-row gap-3 mt-3 text-[0.9em] font-figtree">
        {/* Action Type Dropdown */}
        {renderDropdown(
          actionRef,
          "action",
          actionType,
          actionOptions,
          onActionTypeChange,
          <Filter className="w-4 h-4" />
        )}

        {/* Target Type Dropdown */}
        {renderDropdown(
          targetRef,
          "target",
          targetType,
          targetOptions,
          onTargetTypeChange,
          <Filter className="w-4 h-4" />
        )}

        {/* Status Dropdown */}
        {renderDropdown(
          statusRef,
          "status",
          status,
          statusOptions,
          onStatusChange,
          <Filter className="w-4 h-4" />
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[1.3em] text-gray-500 font-medium">
              Active filters:
            </span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Search: "{search.substring(0, 20)}
                {search.length > 20 ? "..." : ""}"
              </span>
            )}
            {dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Date: {getDropdownLabel(dateRange, dateOptions)}
              </span>
            )}
            {adminFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Admin: {getDropdownLabel(adminFilter, adminOptions)}
              </span>
            )}
            {actionType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Action: {getDropdownLabel(actionType, actionOptions)}
              </span>
            )}
            {targetType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Target: {getDropdownLabel(targetType, targetOptions)}
              </span>
            )}
            {status !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[1.3em] font-medium">
                Status: {getDropdownLabel(status, statusOptions)}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
