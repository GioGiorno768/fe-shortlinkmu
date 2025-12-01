"use client";

import { useState } from "react";
import {
  CreditCard,
  ShieldAlert,
  History,
  Globe,
  CheckCircle2,
  XCircle,
  Smartphone,
  Landmark,
} from "lucide-react";
import clsx from "clsx";
import { useTranslations, useFormatter } from "next-intl";
import type { UserDetailData } from "@/types/type";

interface UserDetailTabsProps {
  data: UserDetailData;
}

export default function UserDetailTabs({ data }: UserDetailTabsProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const format = useFormatter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "finance" | "security"
  >("overview");

  // Helper for currency
  const formatCurrency = (v: number) =>
    format.number(v, { style: "currency", currency: "USD" });

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-8">
          {[
            { id: "overview", label: t("tabs.overview") },
            { id: "finance", label: t("tabs.finance") },
            { id: "security", label: t("tabs.security") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "px-8 py-5 text-[1.4em] font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-bluelight text-bluelight"
                  : "border-transparent text-grays hover:text-shortblack"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-8">
          {/* === TAB OVERVIEW === */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h4 className="text-[1.4em] font-bold text-blue-800 mb-2">
                  {t("overview.title")}
                </h4>
                <p className="text-[1.2em] text-blue-600 leading-relaxed">
                  {t.rich("overview.description", {
                    year: new Date(data.joinedAt).getFullYear(),
                    links: data.stats.totalLinks,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              {/* Placeholder for charts or more stats */}
              <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-grays">
                <p>Activity Chart Placeholder</p>
              </div>
            </div>
          )}

          {/* === TAB FINANCE === */}
          {activeTab === "finance" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Payment Methods */}
              <div>
                <h4 className="text-[1.4em] font-bold text-shortblack mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-bluelight" />{" "}
                  {t("finance.savedMethods")}
                </h4>
                {data.paymentMethods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className="p-5 rounded-2xl border border-gray-200 flex items-center gap-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                          {pm.category === "bank" ? (
                            <Landmark className="w-6 h-6 text-grays" />
                          ) : (
                            <Smartphone className="w-6 h-6 text-grays" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-shortblack text-[1.3em]">
                            {pm.provider}{" "}
                            {pm.isDefault && (
                              <span className="text-[0.7em] bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-2 align-middle">
                                {t("finance.default")}
                              </span>
                            )}
                          </p>
                          <p className="text-grays text-[1.2em] font-mono">
                            {pm.accountNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-grays italic text-[1.3em]">
                    {t("finance.noMethods")}
                  </p>
                )}
              </div>

              {/* Recent Withdrawals */}
              <div>
                <h4 className="text-[1.4em] font-bold text-shortblack mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-bluelight" />{" "}
                  {t("finance.withdrawalHistory")}
                </h4>
                <div className="space-y-3">
                  {data.withdrawalHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={clsx(
                            "p-2 rounded-full",
                            tx.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          )}
                        >
                          {tx.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-shortblack text-[1.2em]">
                            {formatCurrency(tx.amount)} via {tx.method}
                          </p>
                          <p className="text-grays text-[1.1em]">
                            {format.dateTime(new Date(tx.date), {
                              dateStyle: "medium",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={clsx(
                          "text-[1.1em] font-bold px-3 py-1 rounded-lg uppercase",
                          tx.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        )}
                      >
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === TAB SECURITY === */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4 text-orange-800">
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[1.3em] mb-1">
                    {t("security.noticeTitle")}
                  </h5>
                  <p className="text-[1.2em] leading-relaxed">
                    {t("security.noticeDesc")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[1.4em] font-bold text-shortblack flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-bluelight" />{" "}
                  {t("security.loginActivity")}
                </h4>

                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  {data.loginHistory.map((log, i) => (
                    <div
                      key={log.id}
                      className={clsx(
                        "p-5 flex items-center justify-between hover:bg-slate-50 transition-colors",
                        i !== data.loginHistory.length - 1 &&
                          "border-b border-gray-100"
                      )}
                    >
                      <div>
                        <p className="font-bold text-shortblack text-[1.3em]">
                          {log.ip}
                        </p>
                        <p className="text-grays text-[1.1em] flex items-center gap-2 mt-1">
                          <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {log.location}
                          </span>{" "}
                          • {log.device}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[1.1em] text-grays mb-2">
                          {format.dateTime(new Date(log.timestamp), {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <span
                          className={clsx(
                            "text-[1em] font-bold px-2 py-1 rounded uppercase",
                            log.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
