"use client";

import {
  LogIn,
  Shield,
  Link2,
  Wallet,
  Bell,
  Laptop,
  Globe,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { ActivityLog } from "@/types/type";

interface ActivityItemProps {
  item: ActivityLog;
  isLast: boolean;
}

export default function ActivityItem({ item, isLast }: ActivityItemProps) {
  // Helper Icon
  const getIcon = (type: string) => {
    switch (type) {
      case "login":
        return LogIn;
      case "security":
        return Shield;
      case "link":
        return Link2;
      case "payment":
        return Wallet;
      case "system":
        return Bell;
      default:
        return Bell;
    }
  };

  // Helper Color
  const getColors = (type: string, status: string) => {
    if (status === "failed") return "bg-red-100 text-red-600 border-red-200";
    if (status === "warning")
      return "bg-orange-100 text-orange-600 border-orange-200";

    switch (type) {
      case "login":
        return "bg-blue-100 text-bluelight border-blue-200";
      case "security":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "payment":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-grays border-gray-200";
    }
  };

  const Icon = getIcon(item.type);
  const colorClass = getColors(item.type, item.status);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative pl-8 sm:pl-12 py-2 group">
      {/* Garis Timeline */}
      {!isLast && (
        <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-bluelight/30 transition-colors" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Icon Bulat */}
        <div className="absolute left-0 sm:static flex-shrink-0">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${colorClass} relative bg-white`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 ml-6 sm:ml-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4
                className={`text-[1.5em] font-bold ${
                  item.status === "failed" ? "text-red-600" : "text-shortblack"
                }`}
              >
                {item.title}
              </h4>
              <p className="text-[1.3em] text-grays mt-1 leading-snug">
                {item.description}
              </p>
            </div>
            <span className="text-[1.2em] font-mono text-grays bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
              {formatTime(item.timestamp)}
            </span>
          </div>

          {/* Metadata (IP / Device) */}
          {(item.ipAddress || item.device) && (
            <div className="flex items-center gap-4 mt-3 text-[1.2em] text-gray-400">
              {item.device && (
                <div className="flex items-center gap-1.5">
                  <Laptop className="w-3 h-3" />
                  <span>{item.device}</span>
                </div>
              )}
              {item.ipAddress && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  <span>{item.ipAddress}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
