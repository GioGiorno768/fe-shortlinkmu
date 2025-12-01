"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Filter,
} from "lucide-react";
import clsx from "clsx";
import type { RecentWithdrawal, RecentUser } from "@/types/type";
import { Link } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

interface RecentActivitiesProps {
  withdrawals: RecentWithdrawal[];
  users: RecentUser[];
  isLoading: boolean;
}

export default function RecentActivities({
  withdrawals,
  users,
  isLoading,
}: RecentActivitiesProps) {
  const [activeDropdown, setActiveDropdown] = useState<
    "withdrawals" | "users" | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  // Limit to 7 items
  const displayedWithdrawals = withdrawals.slice(0, 7);
  const displayedUsers = users.slice(0, 7);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-gray-100 h-[400px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8 font-figtree text-[10px]">
      {/* LEFT PANEL: Recent Withdrawals */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.8em] font-bold text-shortblack">
            Recent Withdrawals
          </h3>
          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "withdrawals" ? null : "withdrawals"
                )
              }
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <MoreHorizontal className="w-[1.6em] h-[1.6em] text-grays" />
            </button>
            <AnimatePresence>
              {activeDropdown === "withdrawals" && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-[1.1em] font-semibold text-grays border-b border-gray-50 mb-1">
                      Filter Status
                    </div>
                    {["All Requests", "Pending Only", "Approved Only"].map(
                      (item) => (
                        <button
                          key={item}
                          className="w-full text-left px-3 py-2 text-[1.2em] text-shortblack hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4 h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {displayedWithdrawals.length === 0 ? (
            <p className="text-center text-grays py-8">No pending requests</p>
          ) : (
            displayedWithdrawals.map((wd) => (
              <div
                key={wd.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[4em] h-[4em] rounded-full bg-gray-100 overflow-hidden">
                    <img
                      src={wd.user.avatar}
                      alt={wd.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[1.4em] font-bold text-shortblack group-hover:text-bluelight transition-colors">
                      {wd.user.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[1.1em] text-grays mt-0.5">
                      <span className="capitalize">{wd.method}</span>
                      <span>•</span>
                      <span>{formatDate(wd.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[1.4em] font-bold text-shortblack">
                    {formatCurrency(wd.amount)}
                  </p>
                  <div
                    className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[1em] font-medium mt-1",
                      wd.status === "pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : wd.status === "approved"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {wd.status === "pending" && <Clock className="w-3 h-3" />}
                    {wd.status === "approved" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {wd.status === "rejected" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span className="capitalize">{wd.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          href="/admin/withdrawals"
          className="w-full mt-6 py-3 text-[1.3em] font-medium text-grays hover:text-bluelight hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>View All Requests</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* RIGHT PANEL: New Users */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.8em] font-bold text-shortblack">New Users</h3>
          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "users" ? null : "users")
              }
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <MoreHorizontal className="w-[1.6em] h-[1.6em] text-grays" />
            </button>
            <AnimatePresence>
              {activeDropdown === "users" && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-[1.1em] font-semibold text-grays border-b border-gray-50 mb-1">
                      Filter Users
                    </div>
                    {["All Users", "Active Only", "Banned Only"].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-3 py-2 text-[1.2em] text-shortblack hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4 h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {displayedUsers.length === 0 ? (
            <p className="text-center text-grays py-8">No new users</p>
          ) : (
            displayedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[4em] h-[4em] rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[1.4em] font-bold text-shortblack group-hover:text-bluelight transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-[1.1em] text-grays mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[1.1em] text-grays flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.joinedAt)}
                  </span>
                  <span
                    className={clsx(
                      "text-[1em] px-2 py-0.5 rounded-lg font-medium",
                      user.status === "active"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {user.status === "active" ? "Active" : "Banned"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          href="/admin/users"
          className="w-full mt-6 py-3 text-[1.3em] font-medium text-grays hover:text-bluelight hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Manage Users</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
