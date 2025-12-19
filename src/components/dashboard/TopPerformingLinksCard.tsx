// src/components/dashboard/TopPerformingLinksCard.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  ExternalLink,
  ChevronDown,
  Trophy,
  Medal,
  Link2,
  Eye,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Coins,
  ChartNoAxesColumn,
  Megaphone,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import type { TopPerformingLink } from "@/types/type";

// Terima data lewat props
interface TopPerformingLinksCardProps {
  data: TopPerformingLink[] | null;
}

export default function TopPerformingLinksCard({
  data,
}: TopPerformingLinksCardProps) {
  const t = useTranslations("Dashboard");

  // State UI
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Logic Sorting Client-Side (Pake useMemo biar efisien)
  const sortedLinks = useMemo(() => {
    if (!data) return [];
    // Copy array dulu biar gak mutasi props langsung
    return [...data].sort((a, b) => {
      if (sortBy === "highest") return b.validViews - a.validViews;
      return a.validViews - b.validViews; // Lowest
    });
  }, [data, sortBy]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper Icon Rank
  const getRankIcon = (index: number) => {
    if (sortBy === "lowest") {
      return (
        <span className="text-[1.2em] font-mono text-grays">
          <TrendingDown className="w-5 h-5 text-redshortlink" />
        </span>
      );
    }
    switch (index) {
      case 0:
        return (
          <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
        );
      case 1:
        return <Medal className="w-6 h-6 text-slate-400 fill-slate-400/20" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-500 fill-orange-500/20" />;
      default:
        return <Link2 className="w-5 h-5 text-bluelight" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight flex items-center gap-2">
          {t("topPerformingLinks")}
        </h3>

        {/* Dropdown Filter */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-[1.3em] bg-blues font-medium text-bluelight transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-dashboard"
          >
            {sortBy === "highest" ? "Teratas" : "Terbawah"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-20 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setSortBy("highest");
                    setIsSortOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left text-[1.3em] px-3 py-2 rounded-lg transition-colors",
                    sortBy === "highest"
                      ? "bg-blue-50 text-bluelight font-semibold"
                      : "text-shortblack hover:bg-blues/30"
                  )}
                >
                  <ArrowUpWideNarrow className="w-4 h-4" /> Teratas
                </button>
                <button
                  onClick={() => {
                    setSortBy("lowest");
                    setIsSortOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left text-[1.3em] px-3 py-2 rounded-lg transition-colors",
                    sortBy === "lowest"
                      ? "bg-blue-50 text-bluelight font-semibold"
                      : "text-shortblack hover:bg-blues/30"
                  )}
                >
                  <ArrowDownWideNarrow className="w-4 h-4" /> Terbawah
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- List Content --- */}
      <div className="flex-1 relative min-h-[250px]">
        {!data ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : (
          <div
            onWheel={(e) => e.stopPropagation()}
            className="space-y-0 overflow-y-auto h-[270px] pr-2 custom-scrollbar-minimal"
          >
            {sortedLinks.map((link, index) => (
              <div
                key={link.id}
                className={clsx(
                  "transition-colors duration-200 border-b border-gray-50 last:border-none px-2 rounded-xl",
                  expandedId === link.id && "bg-blues/50"
                )}
              >
                {/* Main Row */}
                <div
                  onClick={() => toggleAccordion(link.id)}
                  className="flex items-center gap-4 py-4 px-2 cursor-pointer group relative z-10"
                >
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p
                        className={clsx(
                          "text-[1.4em] font-medium truncate pr-2 transition-colors",
                          expandedId === link.id
                            ? "text-bluelight font-bold"
                            : "text-shortblack group-hover:text-bluelight"
                        )}
                      >
                        {link.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        onClick={(e) => e.stopPropagation()}
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[1.4em] text-grays truncate max-w-[150px] opacity-80 hover:underline hover:text-bluelight transition-colors"
                      >
                        {link.shortUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-4">
                    <div className="flex justify-end items-center py-1 gap-4">
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/new-link?highlight=${link.id}`}
                        className="text-bluelight hover:underline flex items-center gap-1 font-semibold text-[1.2em] group/link"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                    <ChevronDown
                      className={clsx(
                        "w-4 h-4 text-bluelight transition-transform duration-300",
                        expandedId === link.id && "rotate-180 text-bluelight"
                      )}
                    />
                  </div>
                </div>

                {/* Accordion Detail */}
                <AnimatePresence>
                  {expandedId === link.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="pb-4 pr-4 pl-4">
                        <div className="grid sm:grid-cols-2 grid-cols-2 gap-x-8 gap-y-2 text-[1.3em] pt-1">
                          {/* Views */}
                          <div className="flex items-center gap-4">
                            <Eye className="w-5 h-5 text-bluelight" />
                            <div className="flex flex-col items-start py-1 border-b border-gray-100/80">
                              <span className="text-grays">Views</span>
                              <span className="font-medium text-shortblack">
                                {link.validViews.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {/* Earning */}
                          <div className="flex items-center gap-4">
                            <Coins className="w-5 h-5 text-bluelight" />
                            <div className="flex flex-col items-start py-1 border-b border-gray-100/80">
                              <span className="text-grays">Earnings</span>
                              <span className="font-medium text-shortblack">
                                ${link.totalEarnings.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {/* CPM */}
                          <div className="flex items-center gap-4">
                            <ChartNoAxesColumn className="w-5 h-5 text-bluelight" />
                            <div className="flex flex-col items-start py-1 border-b border-gray-100/80">
                              <span className="text-grays">CPM</span>
                              <span className="font-medium text-shortblack">
                                ${link.cpm.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {/* Ads Level */}
                          <div className="flex items-center gap-4">
                            <Megaphone className="w-5 h-5 text-bluelight" />
                            <div className="flex flex-col items-start py-1">
                              <span className="text-grays">Ads Level</span>
                              <span className="font-medium text-shortblack capitalize">
                                {link.adsLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className=" text-center">
        <Link
          href="/new-link"
          className="text-[1.3em] font-semibold text-grays hover:text-bluelight flex items-center justify-center gap-1 transition-colors"
        >
          Lihat Semua Link <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
