"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  Copy,
  Check,
  Link2,
  Eye,
  DollarSign,
  Globe,
} from "lucide-react";
import clsx from "clsx";
import type { AdminLink } from "@/types/type";
import { Link, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface RecentLinksCardProps {
  links: AdminLink[];
  isLoading: boolean;
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function RecentLinksCard({
  links,
  isLoading,
  currentFilter = "all",
  onFilterChange,
}: RecentLinksCardProps) {
  // Fallback translation or use existing if available.
  // For now assuming we might need to add keys, but I'll use hardcoded text for new parts if keys missing.
  // Using "AdminDashboard.RecentLinks" scope if possible, or generic.
  const t = useTranslations("AdminDashboard");
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setActiveDropdown(false);
  };

  // Limit to 7 items
  const displayedLinks = links.slice(0, 7);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 h-[400px] animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative flex flex-col h-full text-[10px]"
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-[2em] md:text-[2em] font-bold text-shortblack">
          Recent Links
        </h3>
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <MoreHorizontal className="w-6 h-6 text-grays" />
          </button>
          <AnimatePresence>
            {activeDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-[1.4em] font-semibold text-grays border-b border-gray-50 mb-1">
                    Filter Status
                  </div>
                  {[
                    { label: "All Links", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Disabled", value: "disabled" },
                    { label: "Expired", value: "expired" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleFilterClick(item.value)}
                      className={clsx(
                        "w-full text-left px-3 py-2 text-[1.4em] rounded-lg transition-colors",
                        currentFilter === item.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-shortblack hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        onWheel={(e) => e.stopPropagation()}
        className="space-y-3 overflow-y-auto pr-2 h-[400px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {displayedLinks.length === 0 ? (
          <p className="text-center text-grays py-8 text-[1.4em]">
            No recent links found.
          </p>
        ) : (
          displayedLinks.map((link) => (
            <div
              key={link.id}
              onClick={() =>
                router.push(`/admin/links?search=${link.shortUrl}`)
              }
              className="flex md:items-center items-start md:flex-row flex-col justify-between md:p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100 relative"
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden shrink-0">
                  <Link2 className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[1.4em] md:text-[1.6em] font-bold text-shortblack group-hover:text-bluelight transition-colors truncate">
                      {link.shortUrl}
                    </h4>
                    <button
                      onClick={(e) => handleCopy(e, link.shortUrl, link.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors shrink-0"
                      title="Copy Short URL"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(e, link.originalUrl, link.id);
                    }}
                    className="flex items-center gap-2 mt-1.5 w-full max-w-[280px]"
                  >
                    <input
                      type="text"
                      readOnly
                      value={link.originalUrl}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-[1.1em] text-grays focus:outline-none truncate min-w-0"
                    />
                    <span
                      title={formatFullDate(link.createdAt)}
                      className="whitespace-nowrap text-[1.1em] text-grays shrink-0"
                    >
                      {formatDate(link.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-3 shrink-0 md:ml-2 px-4 md:px-0 ml-9">
                <div className="flex md:flex-col flex-row gap-2 items-end">
                  <div className="flex items-center gap-3 text-[1.2em] md:text-[1.4em] font-medium text-shortblack">
                    <span className="flex items-center gap-1" title="Views">
                      <Eye className="w-3 h-3 text-grays" /> {link.views}
                    </span>
                    <span
                      className="flex items-center gap-1 text-green-600"
                      title="Earnings"
                    >
                      <DollarSign className="w-3 h-3" /> {link.earnings}
                    </span>
                  </div>

                  <div
                    className={clsx(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[1.2em] font-medium mt-1",
                      link.status === "active"
                        ? "bg-blue-50 text-blue-600"
                        : link.status === "disabled"
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <span className="capitalize">{link.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/admin/links"
        className="w-full mt-4 py-3 text-[1.4em] md:text-[1.6em] font-medium text-grays hover:text-bluelight hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
      >
        <span>Manage Links</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
