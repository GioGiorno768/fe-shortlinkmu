"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ChevronDown,
  Pencil,
  EyeOff,
  MapPin,
  Calendar,
  Lock,
  Eye,
  Megaphone,
  BarChart,
  Wallet,
  DollarSign,
  Link as LinkIcon,
} from "lucide-react";
import clsx from "clsx";
import type { Shortlink } from "@/types/type";

interface LinkItemProps {
  link: Shortlink;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: "active" | "disabled") => void;
}

export default function LinkItem({
  link,
  isExpanded,
  onToggleExpand,
  onEdit,
  onToggleStatus,
}: LinkItemProps) {
  // State UI Lokal (Menu & Password)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper Format (Sama persis)
  const formatLinkDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const formatNumber = (num: number) => num.toLocaleString("en-US");
  const formatCurrency = (num: number) =>
    "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // Tutup menu aksi kalau klik luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={clsx(
        "rounded-xl bg-white shadow-sm shadow-slate-500/50 transition-shadow block w-full text-start",
        link.status === "disabled" && "bg-gray-50 opacity-70",
        isExpanded && "shadow-lg"
      )}
    >
      {/* HEADER (Baris Utama) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
        className="flex items-center justify-between p-6 cursor-pointer"
      >
        {/* Icon & Judul */}
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={clsx(
              "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
              link.status === "active" ? "bg-blue-dashboard" : "bg-gray-200"
            )}
          >
            <LinkIcon
              className={clsx(
                "w-5 h-5",
                link.status === "active" ? "text-bluelight" : "text-grays"
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[1.4em] font-medium text-grays truncate">
              {link.title} | {formatLinkDate(link.dateCreated)}
            </p>
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[1.6em] font-semibold text-shortblack hover:underline truncate line-clamp-1 block"
            >
              {link.shortUrl}
            </a>
          </div>
        </div>

        {/* Tombol Aksi (Kanan) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 rounded-full text-grays hover:bg-blue-dashboard transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu Kecil */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-full right-0 mt-1 p-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(link.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues"
                  >
                    <Pencil className="w-4 h-4" /> <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(link.id, link.status);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues"
                  >
                    <EyeOff className="w-4 h-4" />{" "}
                    <span>
                      {link.status === "active" ? "Disable" : "Enable"}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-2 rounded-full text-grays hover:bg-blue-dashboard transition-colors"
          >
            <ChevronDown
              className={clsx(
                "w-5 h-5 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* DETAIL (Accordion) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
              {/* Destination */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-bluelight flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[1.2em] font-medium text-grays">
                    Destination
                  </p>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    className="text-[1.4em] font-medium text-shortblack hover:underline truncate block"
                  >
                    {link.originalUrl}
                  </a>
                </div>
              </div>
              {/* Expired */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-bluelight flex-shrink-0" />
                <div>
                  <p className="text-[1.2em] font-medium text-grays">
                    Date Expired
                  </p>
                  <p className="text-[1.4em] font-medium text-shortblack">
                    {link.dateExpired
                      ? formatLinkDate(link.dateExpired)
                      : "No expiry"}
                  </p>
                </div>
              </div>
              {/* Password */}
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-bluelight flex-shrink-0" />
                <div className="w-full relative max-w-[150px]">
                  <p className="text-[1.2em] font-medium text-grays mb-1">
                    Password
                  </p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={link.password || ""}
                      readOnly
                      className="w-full text-[1.4em] font-medium text-shortblack bg-blues border border-gray-200 rounded-md px-3 py-1 pr-10 focus:outline-none"
                      placeholder={
                        link.passwordProtected ? "********" : "No Pass"
                      }
                    />
                    {link.passwordProtected && (
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-grays hover:text-bluelight"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Ads Level */}
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-bluelight" />
                <div>
                  <p className="text-[1.2em] text-grays">Ads Level</p>
                  <p className="text-[1.4em] text-shortblack capitalize">
                    {link.adsLevel}
                  </p>
                </div>
              </div>
              {/* Stats Grid */}
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-bluelight" />
                <div>
                  <p className="text-[1.2em] text-grays">Views</p>
                  <p className="text-[1.4em] text-shortblack">
                    {formatNumber(link.validViews)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-bluelight" />
                <div>
                  <p className="text-[1.2em] text-grays">Earn</p>
                  <p className="text-[1.4em] text-shortblack">
                    {formatCurrency(link.totalEarning)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-bluelight" />
                <div>
                  <p className="text-[1.2em] text-grays">Clicks</p>
                  <p className="text-[1.4em] text-shortblack">
                    {formatNumber(link.totalClicks)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-bluelight" />
                <div>
                  <p className="text-[1.2em] text-grays">CPM</p>
                  <p className="text-[1.4em] text-shortblack">
                    {formatCurrency(link.averageCPM)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
