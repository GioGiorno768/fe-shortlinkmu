"use client";

import {
  Edit,
  Trash2,
  Sparkles,
  Megaphone,
  Wallet,
  Star,
  Zap,
  Calendar,
  Clock,
  CheckCircle2,
  Ban,
} from "lucide-react";
import clsx from "clsx";
import type { AdminAnnouncement } from "@/types/type";

// Mapping string icon name to Lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Megaphone,
  Wallet,
  Star,
  Zap,
};

interface AnnouncementItemProps {
  item: AdminAnnouncement;
  onEdit: (item: AdminAnnouncement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export default function AnnouncementItem({
  item,
  onEdit,
  onDelete,
  onToggleStatus,
}: AnnouncementItemProps) {
  const Icon = ICON_MAP[item.icon] || Sparkles;

  const themeColors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };
  const themeClass = themeColors[item.theme] || themeColors.blue;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group relative">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* LEFT: Icon */}
        <div
          className={clsx(
            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
            themeClass
          )}
        >
          <Icon className="w-8 h-8" />
        </div>

        {/* MIDDLE: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[1.6em] text-shortblack truncate">
              {item.title}
            </h3>
            {/* Status Badge */}
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.9em] font-bold uppercase tracking-wide border",
                item.status === "active"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : item.status === "scheduled"
                  ? "bg-orange-50 text-orange-600 border-orange-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              )}
            >
              {item.status === "active" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : item.status === "scheduled" ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              {item.status}
            </span>
          </div>

          <p className="text-gray-500 text-[1.2em] line-clamp-2 leading-relaxed">
            {item.desc}
          </p>

          {/* Schedule Info */}
          {item.scheduledFor && (
            <div className="flex items-center gap-2 text-[1.1em] text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg w-fit">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                Scheduled for: {formatDate(item.scheduledFor)}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
          {/* Toggle Status */}
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() =>
                !item.scheduledFor && onToggleStatus(item.id, item.status)
              }
              disabled={!!item.scheduledFor}
              title={
                item.scheduledFor
                  ? "Cannot toggle status for scheduled announcements. Edit to remove schedule."
                  : "Toggle Status"
              }
              className={clsx(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none",
                item.scheduledFor
                  ? "bg-gray-100 cursor-not-allowed opacity-50"
                  : item.status === "active"
                  ? "bg-green-500"
                  : item.status === "scheduled"
                  ? "bg-orange-500"
                  : "bg-gray-200"
              )}
            >
              <span
                className={clsx(
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                  item.status === "active" || item.status === "scheduled"
                    ? "translate-x-6"
                    : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />

          <button
            onClick={() => onEdit(item)}
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
