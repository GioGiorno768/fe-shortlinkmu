import { useState } from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Sparkles,
  Megaphone,
  Wallet,
  Star,
  Zap,
} from "lucide-react";
import type { AdminAnnouncement } from "@/types/type";

// Mapping string icon name to Lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Megaphone,
  Wallet,
  Star,
  Zap,
};

interface AnnouncementListProps {
  announcements: AdminAnnouncement[];
  isLoading: boolean;
  onEdit: (announcement: AdminAnnouncement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export default function AnnouncementList({
  announcements,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: AnnouncementListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl w-full" />
          <div className="h-12 bg-gray-100 rounded-xl w-full" />
          <div className="h-12 bg-gray-100 rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
        <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-[1.6em] font-bold text-shortblack">
          No Announcements Yet
        </h3>
        <p className="text-gray-400 text-[1.2em]">
          Create your first announcement to engage with users.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[1.2em]">
              <th className="p-6 font-medium">Preview</th>
              <th className="p-6 font-medium">Content</th>
              <th className="p-6 font-medium">Status</th>
              <th className="p-6 font-medium">Schedule</th>
              <th className="p-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[1.4em] text-shortblack">
            {announcements.map((item) => {
              const Icon = ICON_MAP[item.icon] || Sparkles;
              const themeColors = {
                blue: "bg-blue-50 text-blue-600",
                purple: "bg-purple-50 text-purple-600",
                orange: "bg-orange-50 text-orange-600",
              };
              const colorClass = themeColors[item.theme] || themeColors.blue;

              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-6 w-[80px]">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </td>
                  <td className="p-6 max-w-[300px]">
                    <div className="font-bold truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div
                      className="text-gray-400 text-[0.9em] truncate"
                      title={item.desc}
                    >
                      {item.desc}
                    </div>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => onToggleStatus(item.id, item.status)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        item.status === "active"
                          ? "bg-green-500"
                          : item.status === "scheduled"
                          ? "bg-orange-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`${
                          item.status === "active" ||
                          item.status === "scheduled"
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </td>
                  <td className="p-6">
                    {item.scheduledFor ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-shortblack">
                          {new Date(item.scheduledFor).toLocaleDateString()}
                        </span>
                        <span className="text-gray-400 text-[0.9em]">
                          {new Date(item.scheduledFor).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
