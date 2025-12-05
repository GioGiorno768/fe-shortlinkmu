import { Megaphone } from "lucide-react";
import type { AdminAnnouncement } from "@/types/type";
import AnnouncementItem from "./AnnouncementItem";

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
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
    <div className="space-y-4">
      {announcements.map((item) => (
        <AnnouncementItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
