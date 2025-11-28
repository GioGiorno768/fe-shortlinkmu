// src/components/dashboard/links/LinkList.tsx
"use client";

import { useState } from "react";
import type { Shortlink, FilterByType, SortByType } from "@/types/type";
import LinkFilters from "./LinkFilters";
import LinkItem from "./LinkItem";

interface LinkListProps {
  links: Shortlink[];
  totalPages: number;
  // Filter Props (Controlled from Parent)
  search: string;
  setSearch: (v: string) => void;
  filterBy: FilterByType;
  setFilterBy: (v: FilterByType) => void;
  sortBy: SortByType;
  setSortBy: (v: SortByType) => void;
  page: number;
  setPage: (v: number) => void;
  // Actions
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: "active" | "disabled") => void;
}

export default function LinkList({
  links,
  totalPages,
  search,
  setSearch,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  page,
  setPage,
  onEdit,
  onToggleStatus,
}: LinkListProps) {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  return (
    <div className="rounded-xl mt-6 text-[10px]">
      <LinkFilters
        searchTerm={search}
        setSearchTerm={setSearch}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="space-y-3">
        {links.length === 0 ? (
          <p className="text-center text-grays py-8">
            No links found matching criteria.
          </p>
        ) : (
          links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              isExpanded={expandedLink === link.id}
              onToggleExpand={() =>
                setExpandedLink(expandedLink === link.id ? null : link.id)
              }
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="text-[1.6em] px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-blues transition-colors"
          >
            Previous
          </button>
          <span className="text-[1.6em] px-2 text-grays font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="text-[1.6em] px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-blues transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
