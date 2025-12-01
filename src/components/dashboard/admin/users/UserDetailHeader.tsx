"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserStatus } from "@/types/type";

interface UserDetailHeaderProps {
  status: UserStatus;
}

export default function UserDetailHeader({ status }: UserDetailHeaderProps) {
  const t = useTranslations("AdminDashboard.UserDetail");

  return (
    <div className="mb-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-grays hover:text-shortblack transition-colors font-medium text-[1.2em] mb-4"
      >
        <ArrowLeft className="w-5 h-5" /> {t("backToUsers")}
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2.5em] font-bold text-shortblack">
            {t("title")}
          </h1>
          <p className="text-[1.4em] text-grays">{t("subtitle")}</p>
        </div>
      </div>
    </div>
  );
}
