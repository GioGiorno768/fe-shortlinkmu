"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Link as LinkIcon,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink,
  Calendar,
  DollarSign,
  BarChart3,
  Clock,
  Ban,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import type { AdminLink } from "@/types/type";
import { useClickOutside } from "@/hooks/useClickOutside";

interface LinkItemProps {
  link: AdminLink;
  isSelected: boolean;
  onToggleSelect: (id: string, status: string) => void;
  onAction: (id: string, action: "block" | "activate") => void;
  onMessage: (id: string) => void;
}

export default function LinkItem({
  link,
  isSelected,
  onToggleSelect,
  onAction,
  onMessage,
}: LinkItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    // 1. Container Utama: Clickable (Trigger Selection)
    <div
      onClick={() => onToggleSelect(link.id, link.status)}
      className={clsx(
        "bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md group relative overflow-hidden cursor-pointer",
        isSelected
          ? "border-bluelight ring-2 ring-bluelight/20 bg-blue-50/30"
          : "border-gray-100 hover:border-blue-200"
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-5 flex items-start gap-4">
        {/* Checkbox Removed */}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Title & Status */}
          <div className="flex justify-between items-start mb-1">
            <div className="min-w-0">
              {link.title && (
                <p className="text-[1.1em] text-grays truncate mb-0.5">
                  {link.title}
                </p>
              )}
              <div className="flex items-center gap-2">
                {/* 2. Link Short URL: Stop Propagation biar gak trigger select pas diklik */}
                <a
                  href={`https://${link.shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[1.6em] font-bold text-bluelight hover:underline truncate"
                >
                  {link.shortUrl}
                </a>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded text-[1em] font-bold uppercase tracking-wide",
                    link.status === "active"
                      ? "bg-green-100 text-green-700"
                      : link.status === "disabled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {link.status}
                </span>
              </div>
            </div>

            {/* Right Side: Dropdown & Selection Indicator */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Selection Indicator */}
              {isSelected && (
                <div className="p-1.5 bg-blue-50 rounded-full animate-in zoom-in duration-200">
                  <CheckCircle2 className="w-6 h-6 text-bluelight fill-blue-50" />
                </div>
              )}
              {/* 3. Action Dropdown: Stop Propagation */}
              <div
                className="relative"
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-grays hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden p-1"
                    >
                      <button
                        onClick={() => {
                          onAction(
                            link.id,
                            link.status === "active" ? "block" : "activate"
                          );
                          setIsMenuOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 rounded-lg font-medium text-[1.3em] flex items-center gap-2",
                          link.status === "active"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        )}
                      >
                        {link.status === "active" ? (
                          <>
                            <Ban className="w-4 h-4" /> Block Link
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Activate Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          onMessage(link.id);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-[1.3em] flex items-center gap-2 text-shortblack hover:bg-slate-50"
                      >
                        <MessageSquare className="w-4 h-4" /> Message User
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Original Link */}
          <div className="flex items-center gap-2 text-[1.2em] text-grays mb-4 group/link">
            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
            <p className="truncate max-w-[80%]">{link.originalUrl}</p>
            {/* Optional: Kalau External Link diklik, jangan select row */}
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover/link:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="h-px bg-gray-100 w-full mb-4" />

          {/* Details Row */}
          {/* Details Row - HIDDEN (Super Admin Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[1.2em]">
            <div className="flex items-center gap-3">
              <Image
                src={link.owner.avatarUrl}
                alt={link.owner.name}
                width={32}
                height={32}
                className="rounded-full bg-gray-100 border border-white shadow-sm"
              />
              <div className="min-w-0">
                <p className="font-bold text-shortblack truncate">
                  {link.owner.name}
                </p>
                <p className="text-grays text-[0.9em] truncate">
                  {link.owner.email}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-2 text-grays">
                <BarChart3 className="w-3.5 h-3.5" /> Views:{" "}
                <b className="text-shortblack">{link.views.toLocaleString()}</b>
              </p>
              <p className="flex items-center gap-2 text-grays">
                <DollarSign className="w-3.5 h-3.5" /> Earn:{" "}
                <b className="text-green-600">${link.earnings}</b>
              </p>
            </div>

            <div className="space-y-1 text-grays">
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Created:{" "}
                {formatDate(link.createdAt)}
              </p>
              {link.expiredAt && (
                <p className="flex items-center gap-2 text-red-500">
                  <Clock className="w-3.5 h-3.5" /> Exp:{" "}
                  {formatDate(link.expiredAt)}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-[0.9em] font-bold border",
                  link.adsLevel === "noAds"
                    ? "bg-gray-50 border-gray-200 text-gray-500"
                    : "bg-purple-50 border-purple-200 text-purple-600"
                )}
              >
                {link.adsLevel === "noAds" ? "No Ads" : `Ads: ${link.adsLevel}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
