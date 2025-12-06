"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  Send,
  X,
  ShieldAlert,
  History,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "motion/react";

import { useWithdrawalDetail } from "@/hooks/admin/useWithdrawalDetail";
import TransactionInfoCard from "@/components/dashboard/admin/withdrawal/detail/TransactionInfoCard";
import UserProfileCard from "@/components/dashboard/admin/withdrawal/detail/UserProfileCard";
import WithdrawalHistoryTab from "@/components/dashboard/admin/withdrawal/detail/WithdrawalHistoryTab";
import SecurityTab from "@/components/dashboard/admin/withdrawal/detail/SecurityTab";
import WithdrawalActionModal from "@/components/dashboard/admin/withdrawal/WithdrawalActionModal";

export default function WithdrawalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, handleApprove, handleReject, handlePayWithProof } =
    useWithdrawalDetail(id);

  const [activeTab, setActiveTab] = useState<"history" | "security">("history");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "reject" | "pay" | null;
  }>({ isOpen: false, type: null });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">
          Transaction Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleModalSubmit = async (value: string) => {
    if (modalState.type === "reject") {
      await handleReject(value);
    } else if (modalState.type === "pay") {
      await handlePayWithProof(value);
    }
    setModalState({ isOpen: false, type: null });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-figtree pb-20 text-[12px]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-grays" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-shortblack">
              Transaction Details
            </h1>
            <p className="text-grays text-[1.1em]">#{data.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={clsx(
            "px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-[1.1em] self-start md:self-auto",
            data.status === "paid"
              ? "bg-green-100 text-green-700"
              : data.status === "approved"
              ? "bg-blue-100 text-blue-700"
              : data.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {data.status === "paid" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : data.status === "approved" ? (
            <ThumbsUp className="w-5 h-5" />
          ) : data.status === "rejected" ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
          <span className="capitalize">{data.status}</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Transaction Info */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionInfoCard data={data} />

          {/* ACTION BAR */}
          {data.status === "pending" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
              <button
                onClick={handleApprove}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[1.1em] shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" /> Approve Request
              </button>
              <button
                onClick={() => setModalState({ isOpen: true, type: "reject" })}
                className="flex-1 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[1.1em] border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          )}

          {data.status === "approved" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <button
                onClick={() => setModalState({ isOpen: true, type: "pay" })}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[1.1em] shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Mark as Paid & Attach Proof
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: User Profile */}
        <div className="space-y-6">
          <UserProfileCard user={data.user} />
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("history")}
            className={clsx(
              "px-6 py-4 font-bold text-[1.1em] flex items-center gap-2 transition-colors relative",
              activeTab === "history"
                ? "text-blue-600"
                : "text-grays hover:bg-slate-50"
            )}
          >
            <History className="w-5 h-5" /> Withdrawal History
            {activeTab === "history" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={clsx(
              "px-6 py-4 font-bold text-[1.1em] flex items-center gap-2 transition-colors relative",
              activeTab === "security"
                ? "text-blue-600"
                : "text-grays hover:bg-slate-50"
            )}
          >
            <ShieldAlert className="w-5 h-5" /> Fraud & Security
            {activeTab === "security" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "history" ? (
            <WithdrawalHistoryTab history={data.history} />
          ) : (
            <SecurityTab fraudInfo={data.fraudInfo} />
          )}
        </div>
      </div>

      {/* MODAL */}
      <WithdrawalActionModal
        isOpen={modalState.isOpen}
        type={modalState.type as any}
        onClose={() => setModalState({ isOpen: false, type: null })}
        onSubmit={handleModalSubmit}
        isLoading={false} // Hook handles loading internally if needed, or we can add local loading state
      />
    </div>
  );
}

