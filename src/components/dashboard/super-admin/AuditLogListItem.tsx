"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  User,
  Link as LinkIcon,
  DollarSign,
  UserCog,
  Megaphone,
  BarChart3,
  Settings,
  Crown,
} from "lucide-react";
import clsx from "clsx";
import type { AuditLog } from "@/types/type";

interface AuditLogListItemProps {
  log: AuditLog;
  index: number;
}

export default function AuditLogListItem({
  log,
  index,
}: AuditLogListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRelativeTime = (timestamp: string) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getExactTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700 border-green-200";
      case "update":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delete":
        return "bg-red-100 text-red-700 border-red-200";
      case "suspend":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "unsuspend":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "approve":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "reject":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "block":
        return "bg-red-100 text-red-700 border-red-200";
      case "unblock":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />;
      case "link":
        return <LinkIcon className="w-4 h-4" />;
      case "withdrawal":
        return <DollarSign className="w-4 h-4" />;
      case "admin":
        return <UserCog className="w-4 h-4" />;
      case "announcement":
        return <Megaphone className="w-4 h-4" />;
      case "ad_level":
        return <BarChart3 className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 relative overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-500 font-bold text-sm">
              {log.adminAvatar ? (
                <img
                  src={log.adminAvatar}
                  alt={log.adminName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(log.adminName)}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-bold text-[1.5em] text-shortblack truncate">
                  {log.adminName}
                </h4>
                {log.adminRole === "super-admin" && (
                  <Crown className="w-4 h-4 text-yellow-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[1.3em] text-grays">
                <span className="truncate">
                  {getRelativeTime(log.timestamp)}
                </span>
                <span className="hidden md:inline text-gray-300">•</span>
                <span className="hidden md:inline truncate text-xs">
                  {getExactTime(log.timestamp)}
                </span>
              </div>
            </div>
          </div>

          <div className="md:hidden shrink-0 ml-2">
            {log.status === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border",
              getActionColor(log.action)
            )}
          >
            {log.action}
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {getTargetIcon(log.targetType)}
            {log.targetType}
          </span>

          {log.status === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
      </div>

      <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-3">
        <div className="md:hidden flex flex-wrap gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border",
              getActionColor(log.action)
            )}
          >
            {log.action}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {getTargetIcon(log.targetType)}
            {log.targetType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[1.3em] text-gray-500">Target:</span>
          <span className="font-semibold text-[1.4em] text-shortblack">
            {log.targetName}
          </span>
        </div>

        <p className="text-[1.4em] text-gray-700 leading-relaxed">
          {log.description}
        </p>

        {(log.ipAddress || log.location || log.metadata?.reason) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {log.ipAddress && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[1.2em] font-medium">
                🌐 {log.ipAddress}
              </span>
            )}
            {log.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[1.2em] font-medium">
                📍 {log.location}
              </span>
            )}
            {log.metadata?.reason && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[1.2em] font-medium">
                💡 {log.metadata.reason}
              </span>
            )}
          </div>
        )}

        {log.metadata?.oldValue && log.metadata?.newValue && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-[1.3em]">
            <span className="text-gray-500">Changed from:</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-mono text-xs">
              {log.metadata.oldValue}
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono text-xs">
              {log.metadata.newValue}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
