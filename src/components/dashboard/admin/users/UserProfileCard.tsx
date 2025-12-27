"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { useTranslations, useFormatter } from "next-intl";
import type { UserDetailData } from "@/types/type";

interface UserProfileCardProps {
  data: UserDetailData;
}

export default function UserProfileCard({ data }: UserProfileCardProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const format = useFormatter();

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center">
        <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 border-white shadow-md mb-6">
          {data.avatarUrl ? (
            <Image
              src={data.avatarUrl}
              alt={data.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-200 flex items-center justify-center text-[3em] font-bold text-blue-600">
              {data.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-[2em] font-bold text-shortblack mb-1">
          {data.name}
        </h3>
        <p className="text-[1.4em] text-grays mb-6">@{data.username}</p>

        <div className="flex justify-center gap-3 mb-8">
          <span
            className={clsx(
              "px-4 py-1.5 rounded-full text-[1.1em] font-bold uppercase",
              data.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {data.status}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-slate-50 border border-gray-200 text-grays text-[1.1em] font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" /> ID
          </span>
        </div>

        <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-gray-100">
          <InfoRow label={t("overview.email")} value={data.email} />
          {/* Phone number hidden - user profile doesn't have phone settings */}
          {/* <InfoRow label={t("overview.phone")} value={data.phoneNumber} /> */}
          <InfoRow
            label={t("overview.joined")}
            value={format.dateTime(new Date(data.joinedAt), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          />
        </div>
      </div>

      {/* Quick Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-[1.1em] text-grays mb-1">
            {t("overview.totalViews")}
          </p>
          <p className="text-[1.8em] font-bold text-bluelight">
            {format.number(data.stats.totalViews)}
          </p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-[1.1em] text-grays mb-1">
            {t("overview.walletBalance")}
          </p>
          <p className="text-[1.8em] font-bold text-green-600">
            {format.number(data.stats.walletBalance, {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-[1.1em] text-grays mb-1">Total Earnings</p>
          <p className="text-[1.8em] font-bold text-emerald-600">
            {format.number(data.stats.totalEarnings || 0, {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-[1.1em] text-grays mb-1">Avg CPM</p>
          <p className="text-[1.8em] font-bold text-purple-600">
            {format.number(data.stats.avgCpm || 0, {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-grays text-[1.2em]">{label}</span>
      <span className="font-bold text-shortblack text-[1.2em] text-right break-all max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
