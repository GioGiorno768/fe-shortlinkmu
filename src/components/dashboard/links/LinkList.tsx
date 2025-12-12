// src/components/dashboard/links/LinkList.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import LinkItem from "./LinkItem";
import LinkFilters from "./LinkFilters";
import Pagination from "../Pagination";
import type { Shortlink, MemberLinkFilters } from "@/types/type";

interface LinkListProps {
  links: Shortlink[];
  totalPages: number;
  // Filter Props (Controlled from Parent)
  filters: MemberLinkFilters;
  setFilters: (v: MemberLinkFilters) => void;
  page: number;
  setPage: (v: number) => void;
  // Actions
  isLoading: boolean;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: "active" | "disabled") => void;
}

export default function LinkList({
  links,
  totalPages,
  filters,
  setFilters,
  page,
  setPage,
  isLoading,
  onEdit,
  onToggleStatus,
}: LinkListProps) {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  return (
    <div className="rounded-xl mt-6 text-[10px]">
      <LinkFilters filters={filters} setFilters={setFilters} />

      <div className="space-y-3 min-h-[200px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : links.length === 0 ? (
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

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
