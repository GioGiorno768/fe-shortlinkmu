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
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useFormatter } from "next-intl";
import type { UserDetailData } from "@/types/type";
import UserMessageHistory from "./UserMessageHistory";

interface UserDetailTabsProps {
  data: UserDetailData;
}

const ITEMS_PER_PAGE = 5;

export default function UserDetailTabs({ data }: UserDetailTabsProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const format = useFormatter();
  // Only Finance tab is shown for now - Overview and Security hidden for MVP
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const sortedHistory = [...data.withdrawalHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Slice for Load More
  const visibleHistory = sortedHistory.slice(0, visibleCount);
  const hasMore = visibleCount < sortedHistory.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Helper for currency
  const formatCurrency = (v: number) =>
    format.number(v, { style: "currency", currency: "USD" });

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[550px] h-full">
        {/* Single Tab Header - Finance Only (Overview & Security hidden for MVP) */}
        <div className="flex border-b border-gray-100 px-8">
          <div className="px-8 py-5 text-[1.4em] font-medium border-b-2 border-bluelight text-bluelight">
            {t("tabs.finance")}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {/* === TAB FINANCE === (Only active tab) */}
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[1.4em] font-bold text-shortblack flex items-center gap-2">
                  <History className="w-5 h-5 text-bluelight" />{" "}
                  {t("finance.withdrawalHistory")}
                </h4>

                {/* Sort Dropdown */}
                <div className="relative z-20">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[1.1em] font-medium text-shortblack hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Filter className="w-4 h-4 text-grays" />
                    <span className="text-grays">Sort:</span>
                    <span className="font-bold text-bluelight">
                      {sortOrder === "newest" ? "Terbaru" : "Terlama"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-grays transition-transform ${
                        isSortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsSortOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30"
                        >
                          {[
                            { id: "newest", label: "Terbaru" },
                            { id: "oldest", label: "Terlama" },
                          ].map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSortOrder(option.id as "newest" | "oldest");
                                setIsSortOpen(false);
                              }}
                              className={clsx(
                                "flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-[1.1em] transition-colors text-left",
                                sortOrder === option.id
                                  ? "bg-blue-50 text-bluelight font-semibold"
                                  : "text-shortblack hover:bg-gray-50"
                              )}
                            >
                              <span>{option.label}</span>
                              {sortOrder === option.id && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div
                onWheel={(e) => e.stopPropagation()}
                className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {sortedHistory.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-grays">
                    No withdrawal history found.
                  </div>
                ) : (
                  <>
                    {visibleHistory.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 hover:bg-slate-50 rounded-xl transition-colors border border-gray-100"
                      >
                        {/* Row 1: Amount + Method + Account | Status Badge */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={clsx(
                                "p-2 rounded-full shrink-0",
                                tx.status === "paid"
                                  ? "bg-green-100 text-green-600"
                                  : tx.status === "rejected"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-amber-100 text-amber-600"
                              )}
                            >
                              {tx.status === "paid" ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </div>
                            <p className="font-bold text-shortblack text-[1.2em]">
                              {formatCurrency(tx.amount)} via {tx.method}{" "}
                              <span className="text-grays font-normal">→</span>{" "}
                              <span className="text-grays font-medium">
                                {tx.account}
                              </span>
                            </p>
                          </div>
                          <span
                            className={clsx(
                              "text-[1em] font-bold px-3 py-1 rounded-lg uppercase shrink-0",
                              tx.status === "paid"
                                ? "bg-green-50 text-green-600"
                                : tx.status === "rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-600"
                            )}
                          >
                            {tx.status}
                          </span>
                        </div>

                        {/* Row 2: Date • TX ID | Fee */}
                        <div className="flex justify-between items-center pl-11">
                          <p className="text-grays text-[1.1em]">
                            {format.dateTime(new Date(tx.date), {
                              dateStyle: "medium",
                            })}
                            {tx.txId && (
                              <span className="ml-2 text-slate-400">
                                • #{tx.txId}
                              </span>
                            )}
                          </p>
                          {tx.fee !== undefined && tx.fee > 0 && (
                            <span className="text-[1em] text-grays">
                              Fee:{" "}
                              <span className="font-medium text-shortblack">
                                {formatCurrency(tx.fee)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                      <button
                        onClick={handleLoadMore}
                        className="w-full py-3 mt-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-[1.2em] font-medium text-grays hover:text-shortblack transition-colors flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        Load More ({sortedHistory.length - visibleCount}{" "}
                        remaining)
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* === TAB SECURITY (Hidden for MVP) ===
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

                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="border border-gray-100 rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar"
                >
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
          */}
        </div>
      </div>
    </div>
  );
}
