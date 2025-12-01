"use client";

import { useTranslations } from "next-intl";
import LinkStatsRow from "@/components/dashboard/admin/links/LinkStatsRow";
import { useAdminLinks } from "@/hooks/admin/useAdminLinks";

export default function AdminLinksPage() {
  const t = useTranslations("AdminDashboard.Links");
  const { stats, isLoading } = useAdminLinks();

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* 1. Stats Row */}
      <LinkStatsRow stats={stats} isLoading={isLoading} />

      {/* 2. Main Content (Filter + List) - REMOVED */}
      {/* The user requested to remove the link list features, leaving only the stats. */}
    </div>
  );
}
