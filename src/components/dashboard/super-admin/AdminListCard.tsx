"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Ban,
  Clock,
  Users,
  FileCheck,
  ShieldX,
  Calendar,
  Crown,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import type { Admin } from "@/types/type";

interface AdminListCardProps {
  admin: Admin;
  onToggleStatus: (id: string, currentStatus: "active" | "suspended") => void;
  onDelete: (id: string) => void;
}

export default function AdminListCard({
  admin,
  onToggleStatus,
  onDelete,
}: AdminListCardProps) {
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

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        "border-gray-100 hover:border-blue-200"
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Admin Identity */}
        <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 relative overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-500 font-bold text-xs md:text-lg">
              {admin.avatarUrl ? (
                <Image
                  src={admin.avatarUrl}
                  alt={admin.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{getInitials(admin.name)}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm md:text-base text-shortblack truncate">
                  {admin.name}
                </h4>
                {admin.role === "super-admin" && (
                  <Crown className="w-4 h-4 text-yellow-500 shrink-0" />
                )}
              </div>
              <p className="text-grays text-xs md:text-sm truncate">
                @{admin.username}
              </p>
              <p className="text-grays text-xs truncate">{admin.email}</p>
            </div>
          </div>

          {/* Mobile Status Badge */}
          <div className="md:hidden shrink-0 ml-2">
            <span
              className={clsx(
                "inline-flex items-center justify-center w-8 h-8 rounded-full",
                admin.status === "active"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {admin.status === "active" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Ban className="w-5 h-5" />
              )}
            </span>
          </div>
        </div>

        {/* Desktop Status Badge & Role Tag */}
        <div className="hidden md:flex shrink-0 items-center gap-3">
          {/* Role Badge */}
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
              admin.role === "super-admin"
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            )}
          >
            {admin.role === "super-admin" ? (
              <>
                <Crown className="w-3 h-3" />
                Super
              </>
            ) : (
              "Admin"
            )}
          </span>

          {/* Status Badge */}
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide",
              admin.status === "active"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            )}
          >
            {admin.status === "active" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
            {admin.status}
          </span>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Suspend/Unsuspend Button */}
          <button
            onClick={() => onToggleStatus(admin.id, admin.status)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              admin.status === "suspended"
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            )}
          >
            {admin.status === "suspended" ? (
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

          {/* Delete Button */}
          {admin.role !== "super-admin" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(admin.id);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* STATS CONTENT */}
      <div className="overflow-hidden bg-slate-50/50 border-t border-gray-100">
        <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1: Users Managed */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-blue-100 rounded-lg text-blue-600 shrink-0">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Users Managed
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {admin.stats.usersManaged.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stat 2: Withdrawals Processed */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-green-100 rounded-lg text-green-600 shrink-0">
              <FileCheck className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Withdrawals
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {admin.stats.withdrawalsProcessed.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stat 3: Links Blocked */}
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-red-100 rounded-lg text-red-600 shrink-0">
              <ShieldX className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-grays text-xs md:text-sm mb-0.5 truncate">
                Links Blocked
              </p>
              <p className="font-bold text-shortblack text-sm md:text-base truncate">
                {admin.stats.linksBlocked.toLocaleString()}
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
                {formatDateTime(admin.lastLogin)}
              </p>
            </div>
          </div>

          {/* Stat 5: Joined At */}
          <div className="col-span-2 md:col-span-3 flex items-center gap-2 text-grays text-xs md:text-sm pt-2 border-t border-gray-200/50 mt-1 md:mt-2">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Joined on {formatDate(admin.joinedAt)}</span>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden p-4 pt-0 flex gap-3">
          <button
            onClick={() => onToggleStatus(admin.id, admin.status)}
            className={clsx(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
              admin.status === "suspended"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {admin.status === "suspended" ? (
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

          {admin.role !== "super-admin" && (
            <button
              onClick={() => onDelete(admin.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
