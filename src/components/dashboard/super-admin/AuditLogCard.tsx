"use client";

import { motion } from "motion/react";
import {
  MoreHorizontal,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Settings,
  Ban,
  Wallet,
  Megaphone,
  BellRing,
} from "lucide-react";

// ...

const getActionIcon = (action: AuditActionType) => {
  switch (action) {
    case "BLOCK_LINK":
      return <Ban className="w-4 h-4 text-red-500" />;
    case "APPROVE_WITHDRAWAL":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "REJECT_WITHDRAWAL":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "MANAGE_ANNOUNCEMENT":
      return <Megaphone className="w-4 h-4 text-blue-500" />;
    case "SEND_NOTIFICATION":
      return <BellRing className="w-4 h-4 text-orange-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
};

const getActionColor = (action: AuditActionType) => {
  switch (action) {
    case "BLOCK_LINK":
    case "REJECT_WITHDRAWAL":
      return "bg-red-50 border-red-100 text-red-700";
    case "APPROVE_WITHDRAWAL":
      return "bg-green-50 border-green-100 text-green-700";
    case "MANAGE_ANNOUNCEMENT":
      return "bg-blue-50 border-blue-100 text-blue-700";
    case "SEND_NOTIFICATION":
      return "bg-orange-50 border-orange-100 text-orange-700";
    default:
      return "bg-gray-50 border-gray-100 text-gray-700";
  }
};
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import type { AuditLogEntry, AuditActionType } from "@/types/type";

interface AuditLogCardProps {
  logs: AuditLogEntry[];
  isLoading: boolean;
}

export default function AuditLogCard({ logs, isLoading }: AuditLogCardProps) {
  const [filter, setFilter] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getActionIcon = (action: AuditActionType) => {
    switch (action) {
      case "BLOCK_LINK":
        return <Ban className="w-4 h-4 text-red-500" />;
      case "APPROVE_WITHDRAWAL":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "REJECT_WITHDRAWAL":
        return <XCircle className="w-4 h-4 text-red-500" />;
      // case "SUSPEND_USER":
      //   return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      // case "UPDATE_ADS":
      //   return <Settings className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: AuditActionType) => {
    switch (action) {
      case "BLOCK_LINK":
      case "REJECT_WITHDRAWAL":
        return "bg-red-50 border-red-100 text-red-700";
      case "APPROVE_WITHDRAWAL":
        return "bg-green-50 border-green-100 text-green-700";
      // case "SUSPEND_USER":
      //   return "bg-orange-50 border-orange-100 text-orange-700";
      // case "UPDATE_ADS":
      //   return "bg-blue-50 border-blue-100 text-blue-700";
      default:
        return "bg-gray-50 border-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 h-[400px] animate-pulse" />
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm font-figtree">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[1.8em] font-bold text-slate-800 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-indigo-600" />
            Admin Audit Log
          </h3>
          <p className="text-[1.2em] text-slate-400 mt-1">
            Recent actions taken by administrators.
          </p>
        </div>

        <Link
          href="/super-admin/audit"
          className="flex items-center gap-2 text-[1.2em] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List content */}
      <div onWheel={(e) => e.stopPropagation()} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-minimal">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No logs found</div>
        ) : (
          logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-white hover:bg-slate-50 transition-all hover:shadow-sm group"
            >
              {/* Left: Admin & Action */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={log.admin.avatar}
                    alt={log.admin.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-white shadow-sm w-12 h-12"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div
                      className={clsx(
                        "w-3 h-3 rounded-full",
                        log.admin.role === "super-admin"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[1.4em] font-bold text-slate-800 flex items-center gap-2">
                    {log.admin.name}
                    <span className="text-[0.8em] font-normal text-slate-400 bg-slate-100 px-2 rounded-full capitalize">
                      {log.admin.role.replace("-", " ")}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={clsx(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[1.1em] font-semibold border",
                        getActionColor(log.action)
                      )}
                    >
                      {getActionIcon(log.action)}
                      <span className="capitalize">
                        {log.action.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                    <span className="text-[1.2em] text-slate-400">•</span>
                    <span className="text-[1.2em] font-medium text-slate-600">
                      {log.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Time & Status */}
              <div className="text-right">
                <p className="text-[1.2em] font-bold text-slate-700">
                  {formatDate(log.timestamp)}
                </p>
                <p
                  className="text-[1.1em] text-slate-400 max-w-[200px] truncate"
                  title={log.details}
                >
                  {log.details}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
