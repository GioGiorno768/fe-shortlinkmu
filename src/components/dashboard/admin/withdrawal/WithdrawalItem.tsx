"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  CreditCard,
  Copy,
  Link2,
  ThumbsUp,
  Send,
  AlertTriangle,
  Calendar,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import type { RecentWithdrawal } from "@/types/type";
import { useClickOutside } from "@/hooks/useClickOutside";

interface WithdrawalItemProps {
  trx: RecentWithdrawal;
  onApprove: (id: string, currentStatus: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddProof: (id: string, url: string) => void;
  // Modal triggers
  // Modal triggers
  openRejectModal: (id: string) => void;
  openProofModal: (id: string) => void; // Added
}

export default function WithdrawalItem({
  trx,
  onApprove,
  openRejectModal,
  openProofModal,
}: WithdrawalItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md group relative ">
      {/* HEADER SECTION */}
      <div className="p-5 flex items-start gap-4">
        {/* Status Icon Indicator */}
        <div
          className={clsx(
            "mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            trx.status === "paid"
              ? "bg-green-100 text-green-600"
              : trx.status === "approved"
              ? "bg-blue-100 text-blue-600"
              : trx.status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
          )}
        >
          {trx.status === "paid" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : trx.status === "approved" ? (
            <ThumbsUp className="w-5 h-5" />
          ) : trx.status === "rejected" ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: User & Amount */}
          <div className="flex justify-between items-start mb-1">
            <div className="min-w-0">
              <p className="text-[1.1em] text-grays truncate mb-0.5">
                {trx.user.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[1.6em] font-bold text-shortblack truncate">
                  {formatCurrency(trx.amount)}
                </span>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded text-[1em] font-bold uppercase tracking-wide",
                    trx.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : trx.status === "approved"
                      ? "bg-blue-100 text-blue-700"
                      : trx.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {trx.status}
                </span>
              </div>
            </div>

            {/* Actions Area: Button + Dropdown */}
            <div className="flex items-center gap-2">
              {/* PRIMARY ACTION BUTTON (Outside Dropdown) */}
              {trx.status === "pending" && (
                <button
                  onClick={() => onApprove(trx.id, trx.status)}
                  className="px-4 py-2 rounded-xl font-bold text-[0.9em] bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-4 h-4" /> Approve
                </button>
              )}
              {trx.status === "approved" && (
                <button
                  onClick={() => onApprove(trx.id, trx.status)}
                  className="px-4 py-2 rounded-xl font-bold text-[0.9em] bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Pay Now
                </button>
              )}

              {/* Action Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-grays hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden p-1"
                    >
                      {/* Detail Link */}
                      <a
                        href={`/admin/withdrawals/${trx.id}`}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg text-shortblack font-medium text-[1.1em] flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4 text-grays" /> Detail
                      </a>

                      <div className="h-px bg-gray-100 my-1" />

                      {/* Send Payment Proof (Optional) */}
                      <button
                        onClick={() => {
                          openProofModal(trx.id);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 rounded-lg text-blue-600 font-medium text-[1.1em] flex items-center gap-2"
                      >
                        <Link2 className="w-4 h-4" /> Send Payment Proof
                      </button>

                      {/* Reject */}
                      {(trx.status === "pending" ||
                        trx.status === "approved") && (
                        <button
                          onClick={() => {
                            openRejectModal(trx.id);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-lg text-red-600 font-medium text-[1.1em] flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="flex items-center gap-2 text-[1.2em] text-grays mb-4 group/link">
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <p className="truncate max-w-[80%]">
              {trx.method} - {trx.accountNumber}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(trx.accountNumber)}
              className="opacity-0 group-hover/link:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-bluelight"
              title="Copy Account Number"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="h-px bg-gray-100 w-full mb-4" />

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[1.2em]">
            {/* User */}
            <div className="flex items-center gap-3">
              <Image
                src={trx.user.avatar}
                alt={trx.user.name}
                width={32}
                height={32}
                className="rounded-full bg-gray-100 border border-white shadow-sm"
              />
              <div className="min-w-0">
                <p className="font-bold text-shortblack truncate">
                  {trx.user.email}
                </p>
                <p className="text-grays text-[0.9em] truncate">
                  Level: {trx.user.level}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1 text-grays">
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date:{" "}
                {formatDate(trx.date)}
              </p>
            </div>

            {/* Risk Score */}
            <div className="flex items-center">
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-[0.9em] font-bold border flex items-center gap-1",
                  trx.riskScore === "safe"
                    ? "bg-green-50 border-green-200 text-green-600"
                    : trx.riskScore === "medium"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                    : "bg-red-50 border-red-200 text-red-600"
                )}
              >
                <AlertTriangle className="w-3 h-3" /> Risk: {trx.riskScore}
              </span>
            </div>

            {/* Proof Link if exists */}
            {trx.proofUrl && (
              <div className="flex items-center">
                <a
                  href={trx.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full text-[0.9em] font-bold border bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                  <Link2 className="w-3 h-3" /> View Proof
                </a>
              </div>
            )}

            {/* Send Payment Proof Option (Dropdown) */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden p-1 hidden">
              {/* This is just a placeholder to ensure I didn't miss the dropdown content logic which is actually inside the main return block above.
                   Wait, the dropdown is defined around line 135. Let me check the file content again.
                   Ah, I see the dropdown content is inside the `isMenuOpen` block.
                   I need to target the "Attach Proof" button inside the dropdown.
               */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
