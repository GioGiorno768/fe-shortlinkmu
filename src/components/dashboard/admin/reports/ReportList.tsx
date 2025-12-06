"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Flag,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import type { AbuseReport } from "@/types/type";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import { useState } from "react";

interface Props {
  reports: AbuseReport[];
  isLoading: boolean;
  onResolve: (reportId: string) => void;
  onIgnore: (reportId: string) => void;
}

export default function ReportList({
  reports,
  isLoading,
  onResolve,
  onIgnore,
}: Props) {
  const [confirm, setConfirm] = useState<{
    isOpen: boolean;
    type: "resolve" | "ignore" | null;
    reportId: string | null;
  }>({ isOpen: false, type: null, reportId: null });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleConfirm = () => {
    if (confirm.type === "resolve" && confirm.reportId) {
      onResolve(confirm.reportId);
    } else if (confirm.type === "ignore" && confirm.reportId) {
      onIgnore(confirm.reportId);
    }
    setConfirm({ isOpen: false, type: null, reportId: null });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  if (reports.length === 0)
    return (
      <div className="p-10 text-center text-grays border-2 border-dashed border-gray-200 rounded-3xl">
        No reports found. Good job! 🎉
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 font-figtree">
        {reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={clsx(
              "bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all",
              report.status === "pending"
                ? "border-red-100 shadow-red-50/50"
                : "border-gray-100 opacity-70 bg-gray-50"
            )}
          >
            {/* ICON KIRI */}
            <div
              className={clsx(
                "p-4 rounded-2xl flex-shrink-0",
                report.reason === "phishing"
                  ? "bg-red-100 text-red-600"
                  : report.reason === "adult"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-orange-100 text-orange-600"
              )}
            >
              <Flag className="w-6 h-6" />
            </div>

            {/* CONTENT TENGAH */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header: Reason & Status */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[1.4em] font-bold text-shortblack capitalize flex items-center gap-2">
                    {report.reason} Report
                    {report.status !== "pending" && (
                      <span className="text-[0.7em] px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase">
                        Resolved
                      </span>
                    )}
                  </h4>
                  <p className="text-grays text-[1.1em] flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5" /> {formatDate(report.date)}
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <User className="w-3.5 h-3.5" />{" "}
                    {report.reporter.name || `Guest (${report.reporter.ip})`}
                  </p>
                </div>
              </div>

              {/* The Link (Target) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <p className="text-[0.9em] text-grays mb-1 uppercase font-bold tracking-wide">
                  Reported Link:
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[1.3em] font-bold text-bluelight truncate">
                    {report.targetLink.shortUrl}
                  </span>
                  <a
                    href={report.targetLink.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grays hover:text-shortblack"
                    title="Open Original URL (Careful!)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[1em] text-grays truncate mt-1">
                  {report.targetLink.originalUrl}
                </p>
              </div>

              {/* User Message */}
              <div className="bg-red-50/50 p-3 rounded-xl border border-red-50">
                <p className="text-[1.1em] text-shortblack italic">
                  "{report.description}"
                </p>
              </div>
            </div>

            {/* ACTION KANAN */}
            {report.status === "pending" && (
              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <button
                  onClick={() =>
                    setConfirm({
                      isOpen: true,
                      type: "resolve",
                      reportId: report.id,
                    })
                  }
                  className="flex-1 md:w-40 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[1.1em] flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                </button>
                <button
                  onClick={() =>
                    setConfirm({
                      isOpen: true,
                      type: "ignore",
                      reportId: report.id,
                    })
                  }
                  className="flex-1 md:w-40 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-grays font-bold text-[1.1em] flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Ignore
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirm.isOpen}
        title={
          confirm.type === "resolve"
            ? "Mark Report as Resolved?"
            : "Ignore this Report?"
        }
        description={
          confirm.type === "resolve"
            ? "This will mark the report as resolved without blocking the link. Ensure you have taken necessary actions manually."
            : "Are you sure you want to ignore this report? It will be marked as ignored."
        }
        confirmLabel={
          confirm.type === "resolve" ? "Yes, Resolve" : "Yes, Ignore"
        }
        type={confirm.type === "resolve" ? "success" : "info"}
        onConfirm={handleConfirm}
        onClose={() =>
          setConfirm({ isOpen: false, type: null, reportId: null })
        }
      />
    </>
  );
}
