// src/components/dashboard/TopPerformingLinksCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Trophy,
  Medal,
  Link2,
  Eye,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Coins,
  DollarSign,
  Currency,
  ChartNoAxesColumn,
  Megaphone,
  TrendingDown,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { AdLevel } from "@/types/type";

// --- TIPE DATA ---
interface TopLinkData {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  validViews: number;
  totalEarnings: number;
  cpm: number;
  adsLevel: AdLevel;
}

// --- MOCK API ---
async function fetchTopLinks(
  sortBy: "highest" | "lowest"
): Promise<TopLinkData[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Data Dummy (Disamain sama LinkList biar ID-nya connect)
  const mockData: TopLinkData[] = [
    {
      id: "1",
      title: "Link Shadow Fight Mod",
      shortUrl: "short.link/w1W0K12",
      originalUrl: "https://preline.co/examples/html/hero-agency.html",
      validViews: 22001,
      totalEarnings: 208.9,
      cpm: 9.5,
      adsLevel: "level3",
    },
    {
      id: "2",
      title: "Turbo VPN Mod",
      shortUrl: "short.link/wongireng",
      originalUrl: "https://example.com/turbo-vpn-mod",
      validViews: 15001,
      totalEarnings: 130.5,
      cpm: 8.7,
      adsLevel: "level2",
    },
    {
      id: "3",
      title: "Config Pubg Gacor",
      shortUrl: "short.link/pubg-v1",
      originalUrl: "https://drive.google.com/file/d/...",
      validViews: 12050,
      totalEarnings: 98.2,
      cpm: 8.1,
      adsLevel: "level1",
    },
    // Generate sisanya
    ...Array(16)
      .fill(null)
      .map((_, i) => ({
        id: `link-${i + 5}`, // ID ini match sama LinkList
        title: `Generated Link ${i + 5}`,
        shortUrl: `short.link/gen${i + 5}`,
        originalUrl: `https://generated.link/page${i + 5}`,
        validViews: Math.floor(Math.random() * 10000),
        totalEarnings: parseFloat((Math.random() * 100).toFixed(2)),
        cpm: parseFloat((Math.random() * 5 + 4).toFixed(2)),
        adsLevel: ["noAds", "level1", "level2", "level3", "level4"][
          Math.floor(Math.random() * 5)
        ] as AdLevel,
      })),
  ];

  const sortedData = mockData.sort((a, b) => {
    if (sortBy === "highest") return b.validViews - a.validViews;
    return a.validViews - b.validViews;
  });

  return sortedData.slice(0, 10);
}

export default function TopPerformingLinksCard() {
  const t = useTranslations("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<TopLinkData[]>([]);
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // State Accordion
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLinks() {
      setIsLoading(true);
      try {
        const data = await fetchTopLinks(sortBy);
        setLinks(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadLinks();
  }, [sortBy]);

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

  // --- HELPER ICON RANKING ---
  const getRankIcon = (index: number) => {
    // Kalau filter terbawah, pake angka biasa aja biar gak aneh
    if (sortBy === "lowest") {
      return (
        <span className="text-[1.2em] font-mono text-grays">
          <TrendingDown className="w-5 h-5 text-redshortlink" />
        </span>
      );
    }

    switch (index) {
      case 0: // Gold Trophy
        return (
          <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
        );
      case 1: // Silver Medal
        return <Medal className="w-6 h-6 text-slate-400 fill-slate-400/20" />;
      case 2: // Bronze Medal
        return <Medal className="w-6 h-6 text-orange-500 fill-orange-500/20" />;
      default: // Rank 4 dst (Icon Link Biasa)
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

        {/* Dropdown Filter (Teratas/Terbawah) */}
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
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : (
          <div
            onWheel={(e) => e.stopPropagation()}
            className="space-y-0 overflow-y-auto h-[270px] pr-2 custom-scrollbar-minimal"
          >
            {links.map((link, index) => (
              <div
                key={link.id}
                className={clsx(
                  "transition-colors duration-200 border-b border-gray-50 last:border-none px-2 rounded-xl",
                  expandedId === link.id && "bg-blues/50"
                )}
              >
                {/* Main Row (Header Link) */}
                <div
                  onClick={() => toggleAccordion(link.id)}
                  className="flex items-center gap-4 py-4 px-2 cursor-pointer group relative z-10"
                >
                  {/* Rank Icon */}
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  {/* Info Utama */}
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
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={link.shortUrl}
                        className="text-[1.4em] text-grays truncate max-w-[150px] opacity-80 hover:underline hover:text-bluelight transition-colors"
                      >
                        {link.shortUrl}
                      </Link>
                      {/* Views Counter (Clean) */}
                    </div>
                  </div>
                  
                  {/* Button Detail Link */}
                  <div className="flex justify-end items-center gap-4">
                    <div className="flex justify-end items-center py-1 gap-4">
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/new-link?highlight=${link.id}`}
                        className="text-bluelight hover:underline flex items-center gap-1 font-semibold text-[1.2em] group/link"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                        <span>Detail</span>
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

                {/* Accordion Detail (Clean Layout) */}
                <AnimatePresence>
                  {expandedId === link.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="pb-4 pr-4 pl-4">
                        {/* Stats Row - Simple Grid */}
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
                          {/* Detail Link */}
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
