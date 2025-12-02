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
}

export default function UserListCard({
  user,
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

  const formatCurrency = (val: number) => "$" + val.toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* HEADER SECTION */}
      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
        {/* User Identity */}
        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
          <div className="w-14 h-14 rounded-full bg-gray-100 relative overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg">
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
            <h4 className="font-bold text-base text-shortblack truncate">
              {user.name}
            </h4>
            <p className="text-grays text-sm truncate">{user.email}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
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

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-4 md:mt-0">
          {/* Detail Link Button */}
          <Link
            href={`/admin/users/${user.id}`}
            className="px-4 py-2.5 rounded-xl text-bluelight bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <span>Detail</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STATS CONTENT (Always Visible) */}
      <div className="overflow-hidden bg-slate-50/50 border-t border-gray-100">
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Stat 1: Links */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-grays text-sm mb-0.5">Total Links</p>
              <p className="font-bold text-shortblack text-base">
                {user.stats.totalLinks}
              </p>
            </div>
          </div>

          {/* Stat 2: Views */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-purple-100 rounded-lg text-purple-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-grays text-sm mb-0.5">Total Views</p>
              <p className="font-bold text-shortblack text-base">
                {user.stats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stat 3: Wallet */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-green-100 rounded-lg text-green-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-grays text-sm mb-0.5">Wallet</p>
              <p className="font-bold text-shortblack text-base">
                {formatCurrency(user.stats.walletBalance)}
              </p>
            </div>
          </div>

          {/* Stat 4: Last Login */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-orange-100 rounded-lg text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-grays text-sm mb-0.5">Last Login</p>
              <p className="font-bold text-shortblack text-base">
                {formatDateTime(user.lastLogin)}
              </p>
            </div>
          </div>

          {/* Stat 5: Joined At */}
          <div className="col-span-2 md:col-span-4 flex items-center gap-2 text-grays text-sm pt-2 border-t border-gray-200/50 mt-2">
            <Calendar className="w-4 h-4" />
            <span>Joined on {formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
