"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Ban,
  Clock,
  Link as LinkIcon,
  Eye,
  Wallet,
  Calendar,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import type { AdminUser, UserStatus } from "@/types/type";

interface UserListCardProps {
  user: AdminUser;
  isSelected?: boolean;
  onClick?: () => void;
  onViewDetail?: () => void; // <--- Keep for backward compatibility (modal)
  detailHref?: string; // <--- Add this for Link-based navigation
  onSuspend?: (userId: string, currentStatus: UserStatus) => void; // <--- Add for suspend/unsuspend
}

export default function UserListCard({
  user,
  isSelected,
  onClick,
  onViewDetail, // <--- Add this
  detailHref, // <--- Add this
  onSuspend, // <--- Add this
}: UserListCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (val: number | string) =>
    "$" + Number(val || 0).toFixed(2);

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer relative",
        isSelected
          ? "border-bluelight ring-2 ring-bluelight/20 bg-blue-50/30"
          : "border-gray-100 hover:border-blue-200"
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* User Identity & Mobile Status */}
        <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 relative overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-500 font-bold text-xs md:text-lg">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm md:text-base text-shortblack truncate">
                {user.name}
              </h4>
              <p className="text-grays text-xs md:text-sm truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Mobile Status Badge */}
          <div className="md:hidden shrink-0 ml-2">
            <span
              className={clsx(
                "inline-flex items-center justify-center w-8 h-8 rounded-full",
                user.status === "active"
                  ? "bg-green-50 text-green-600"
                  : user.status === "process"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {user.status === "active" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : user.status === "process" ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Ban className="w-5 h-5" />
              )}
            </span>
          </div>
        </div>

        {/* Desktop Status Badge */}
        <div className="hidden md:flex shrink-0 items-center gap-4">
          {isSelected && (
            <div className="p-1.5 bg-blue-50 rounded-full animate-in zoom-in duration-200">
              <CheckCircle2 className="w-6 h-6 text-bluelight fill-blue-50" />
            </div>
          )}
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide",
              user.status === "active"
                ? "bg-green-50 text-green-600 border border-green-200"
                : user.status === "process"
                ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                : "bg-red-50 text-red-600 border border-red-200"
            )}
          >
            {user.status === "active" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : user.status === "process" ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
            {user.status}
          </span>
        </div>

        {/* Actions (Desktop Only or Hidden) */}
        <div className="hidden md:flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          {/* Suspend/Unsuspend Button */}
          {onSuspend && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSuspend(user.id, user.status);
              }}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                user.status === "suspended"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              )}
            >
              {user.status === "suspended" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Unsuspend
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  Suspend
                </>
              )}
            </button>
          )}

          {/* Detail Button */}
          {detailHref ? (
            <Link
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-bluelight text-white rounded-lg text-sm font-medium hover:bg-bluelight/90 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Detail
            </Link>
          ) : onViewDetail ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail();
              }}
              className="px-4 py-2 bg-bluelight text-white rounded-lg text-sm font-medium hover:bg-bluelight/90 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Detail
            </button>
          ) : null}
        </div>
      </div>

      {/* STATS CONTENT (Always Visible) */}
      <div className="overflow-hidden bg-slate-50/50 border-t border-gray-100">
        <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1: Links */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-blue-100 rounded-lg text-blue-600 shrink-0">
              <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Total Links
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {user.stats.totalLinks}
              </p>
            </div>
          </div>

          {/* Stat 2: Views */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-purple-100 rounded-lg text-purple-600 shrink-0">
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Total Views
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {Number(user.stats.totalViews || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stat 3: Wallet */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-green-100 rounded-lg text-green-600 shrink-0">
              <Wallet className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Wallet
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {formatCurrency(user.stats.walletBalance)}
              </p>
            </div>
          </div>

          {/* Stat 4: Last Login */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-orange-100 rounded-lg text-orange-600 shrink-0">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Last Login
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {formatDateTime(user.lastLogin)}
              </p>
            </div>
          </div>

          {/* Stat 5: Joined At */}
          <div className="col-span-2 md:col-span-4 flex items-center gap-2 text-grays text-xs md:text-sm pt-2 border-t border-gray-200/50 mt-1 md:mt-2">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Joined on {formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
