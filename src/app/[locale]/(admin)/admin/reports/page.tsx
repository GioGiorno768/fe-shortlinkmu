"use client";

import Pagination from "@/components/dashboard/Pagination";
import ReportList from "@/components/dashboard/admin/reports/ReportList";
import { useAdminReports } from "@/hooks/admin/useAdminReports";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AbuseReportsPage() {
  const {
    reports,
    stats,
    isLoading,
    filter,
    setFilter,
    handleBlock,
    handleIgnore,
    page,
    setPage,
    totalPages,
  } = useAdminReports();

  return (
    <div className="space-y-8 pb-10 font-figtree text-[12px]">
      {/* 1. Simple Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-red-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-grays text-[1.1em]">Pending</p>
            <h3 className="text-[2em] font-bold text-shortblack">
              {stats?.pendingCount || 0}
            </h3>
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-grays text-[1.1em]">Resolved Today</p>
            <h3 className="text-[2em] font-bold text-shortblack">
              {stats?.resolvedToday || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {["all", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-t-lg font-bold text-[1.2em] transition-colors ${
              filter === f
                ? "bg-white text-bluelight border-b-2 border-bluelight"
                : "text-grays hover:text-shortblack hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* 3. The List */}
      <ReportList
        reports={reports}
        isLoading={isLoading}
        onBlock={handleBlock}
        onIgnore={handleIgnore}
      />

      {/* 4. Pagination */}
      {!isLoading && reports.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
