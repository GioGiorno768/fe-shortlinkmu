import { Megaphone, CalendarClock, Activity } from "lucide-react";
import type { AdminAnnouncementStats } from "@/types/type";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  isLoading: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  isLoading,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
      <div
        className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-400 font-medium text-[1.2em]">{title}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
        ) : (
          <h3 className="text-shortblack text-[2.4em] font-bold leading-none">
            {value}
          </h3>
        )}
      </div>
    </div>
  );
}

interface AnnouncementStatsRowProps {
  stats: AdminAnnouncementStats;
  isLoading: boolean;
}

export default function AnnouncementStatsRow({
  stats,
  isLoading,
}: AnnouncementStatsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Active Announcements"
        value={stats.activeCount}
        icon={Megaphone}
        color="bg-green-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Created"
        value={stats.totalCount}
        icon={Activity}
        color="bg-blue-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Scheduled"
        value={stats.scheduledCount}
        icon={CalendarClock}
        color="bg-orange-500"
        isLoading={isLoading}
      />
    </div>
  );
}
