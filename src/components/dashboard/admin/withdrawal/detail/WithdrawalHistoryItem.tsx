"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import clsx from "clsx";
import type { Transaction } from "@/types/type";

interface WithdrawalHistoryItemProps {
  item: Transaction;
}

export default function WithdrawalHistoryItem({
  item,
}: WithdrawalHistoryItemProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 group">
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            item.status === "paid"
              ? "bg-green-50 text-green-600"
              : item.status === "rejected"
              ? "bg-red-50 text-red-600"
              : "bg-yellow-50 text-yellow-600"
          )}
        >
          {item.status === "paid" ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : item.status === "rejected" ? (
            <XCircle className="w-6 h-6" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0 mb-1">
            <div>
              <h4 className="font-bold text-[1.4em] text-shortblack flex flex-wrap items-center gap-2">
                {formatCurrency(item.amount)}
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded text-[0.6em] font-bold uppercase tracking-wide border",
                    item.status === "paid"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : item.status === "rejected"
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                  )}
                >
                  {item.status}
                </span>
              </h4>
              <div className="flex items-center gap-2 text-grays text-[1.1em] mt-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span className="truncate">{item.method}</span>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="text-left md:text-right">
              <div className="flex items-center md:justify-end gap-1 text-grays text-[1.1em] mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(item.date)}</span>
              </div>
              <div className="text-[1em] text-gray-400 font-mono">
                #{item.id.slice(-6).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
