"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  EyeOff,
  Eye,
  MapPin,
  Calendar,
  Lock,
  Megaphone,
  Wallet,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";
import type { Shortlink } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

interface LinkItemProps {
  link: Shortlink;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: "active" | "disabled") => void;
}

export default function LinkItem({
  link,
  onEdit,
  onToggleStatus,
}: LinkItemProps) {
  // State UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Currency context
  const { format: formatCurrency } = useCurrency();

  // Helpers
  const formatLinkDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatNumber = (num: number) => num.toLocaleString("en-US");

  // Strip http:// or https:// from URL for cleaner display
  const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close menu on outside click
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
        "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        link.status === "disabled"
          ? "border-red-200 bg-red-50/30"
          : "border-gray-100 hover:border-blue-200"
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Link Identity */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={clsx(
              "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0",
              link.status === "active"
                ? "bg-blue-100 text-bluelight"
                : "bg-red-100 text-red-500"
            )}
          >
            <LinkIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-grays text-xs md:text-sm truncate">
                {link.title}
              </span>
              <span
                className={clsx(
                  "px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide shrink-0",
                  link.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {link.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base font-semibold text-shortblack hover:text-bluelight hover:underline truncate transition-colors"
              >
                {stripProtocol(link.shortUrl)}
              </a>
              <button
                onClick={handleCopyLink}
                className="p-1 rounded hover:bg-gray-100 text-grays hover:text-bluelight transition-colors shrink-0"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Password & Actions */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
          {/* Password Field (Compact) */}
          {link.passwordProtected && (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
              <Lock className="w-3.5 h-3.5 text-grays" />
              <input
                type={showPassword ? "text" : "password"}
                value={link.password || "••••••"}
                readOnly
                className="w-16 md:w-20 text-xs md:text-sm font-medium text-shortblack bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-grays hover:text-bluelight transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-grays hover:bg-gray-200 hover:text-shortblack transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-1 p-1.5 w-36 bg-white rounded-xl shadow-lg z-20 border border-gray-100">
                <button
                  onClick={() => {
                    onEdit(link.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg text-shortblack hover:bg-blue-50 hover:text-bluelight transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onToggleStatus(link.id, link.status);
                    setIsMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                    link.status === "active"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-green-600 hover:bg-green-50"
                  )}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>{link.status === "active" ? "Disable" : "Enable"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS SECTION (Always Visible) */}
      <div className="border-t border-gray-100 bg-blue-50/50">
        <div className="p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1: Destination */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs mb-0.5">Destination</p>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-shortblack hover:text-bluelight hover:underline truncate block transition-colors"
                title={link.originalUrl}
              >
                {new URL(link.originalUrl).hostname}
              </a>
            </div>
          </div>

          {/* Stat 2: Ads Level */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs mb-0.5">Ads Level</p>
              <p className="text-sm font-medium text-shortblack capitalize truncate">
                {link.adsLevel}
              </p>
            </div>
          </div>

          {/* Stat 3: Views */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs mb-0.5">Views</p>
              <p className="text-sm font-medium text-shortblack truncate">
                {formatNumber(link.totalClicks)}
              </p>
            </div>
          </div>

          {/* Stat 4: Earnings */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs mb-0.5">Earnings</p>
              <p className="text-sm font-bold text-green-600 truncate">
                {formatCurrency(link.totalEarning)}
              </p>
            </div>
          </div>

          {/* Footer: Created & Expires (like "Joined on" in UserListCard) */}
          <div className="col-span-2 md:col-span-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-grays text-xs pt-3 border-t border-gray-200/50 mt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created on {formatLinkDate(link.dateCreated)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {link.dateExpired
                  ? `Expires on ${formatLinkDate(link.dateExpired)}`
                  : "No expiration"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
