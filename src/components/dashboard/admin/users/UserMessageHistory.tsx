"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Megaphone,
  Clock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Filter,
  ChevronDown,
  Check,
  Wallet,
  User,
  Link2,
  Calendar,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import type { UserMessage } from "@/types/type";
import { useFormatter } from "next-intl";

interface UserMessageHistoryProps {
  messages: UserMessage[];
}

export default function UserMessageHistory({
  messages,
}: UserMessageHistoryProps) {
  const format = useFormatter();
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const FILTER_OPTIONS = [
    { id: "all", label: "Semua", icon: null },
    { id: "payment", label: "Pembayaran", icon: Wallet },
    { id: "account", label: "Akun", icon: User },
    { id: "link", label: "Link", icon: Link2 },
    { id: "event", label: "Event", icon: Calendar },
  ];

  const activeLabel = FILTER_OPTIONS.find((f) => f.id === activeFilter)?.label;

  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === "all") return true;
    return msg.category === activeFilter;
  });

  return (
    <div className="relative min-h-[550px] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {selectedMessage ? (
          /* === DETAIL VIEW === */
          <motion.div
            key="detail"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-white flex flex-col"
          >
            {/* Header Detail */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-grays hover:text-shortblack transition-colors group"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex-1">
                <h4 className="text-[1.4em] font-bold text-shortblack leading-tight line-clamp-1">
                  {selectedMessage.subject}
                </h4>
                <p className="text-[1.1em] text-grays flex items-center gap-2 mt-1">
                  <span>
                    {format.dateTime(new Date(selectedMessage.sentAt), {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  {selectedMessage.isRead && (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[0.9em] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Read
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Content Detail */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div
                className={clsx(
                  "p-6 rounded-2xl mb-6 flex items-start gap-4",
                  selectedMessage.type === "warning"
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
                )}
              >
                <div
                  className={clsx(
                    "p-2 rounded-lg shrink-0",
                    selectedMessage.type === "warning"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  {selectedMessage.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Megaphone className="w-5 h-5" />
                  )}
                </div>
                <div className="text-[1.2em] leading-relaxed font-medium">
                  This is a {selectedMessage.type} message. Please pay attention
                  to the content below.
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-grays leading-relaxed">
                <p className="text-[1.3em] whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* === LIST VIEW === */
          <motion.div
            key="list"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[1.6em] font-bold text-shortblack">
                  Notification History
                </h4>
                <span className="text-grays text-[1.2em]">
                  {filteredMessages.length} Messages
                </span>
              </div>

              {/* Filter Dropdown */}
              <div className="relative z-20">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[1.2em] font-medium text-shortblack hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Filter className="w-4 h-4 text-grays" />
                  <span className="text-grays">Filter:</span>
                  <span className="font-bold text-bluelight">
                    {activeLabel}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-grays transition-transform ${
                      isFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsFilterOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30"
                      >
                        {FILTER_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setActiveFilter(option.id);
                              setIsFilterOpen(false);
                            }}
                            className={clsx(
                              "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-[1.2em] transition-colors text-left",
                              activeFilter === option.id
                                ? "bg-blue-50 text-bluelight font-semibold"
                                : "text-shortblack hover:bg-gray-50"
                            )}
                          >
                            {option.icon && <option.icon className="w-4 h-4" />}
                            <span className={!option.icon ? "ml-7" : ""}>
                              {option.label}
                            </span>
                            {activeFilter === option.id && (
                              <Check className="w-4 h-4 ml-auto" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div onWheel={(e) => e.stopPropagation()} className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-grays">
                  No message history found for this filter.
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={clsx(
                      "group p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden",
                      msg.type === "warning"
                        ? "bg-red-50/50 border-red-100 hover:border-red-200 hover:bg-red-50"
                        : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-start gap-4 relative z-10">
                      <div
                        className={clsx(
                          "p-3 rounded-xl shrink-0",
                          msg.type === "warning"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-50 text-blue-600"
                        )}
                      >
                        {msg.type === "warning" ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Megaphone className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5
                            className={clsx(
                              "font-bold text-[1.3em] truncate pr-4",
                              msg.type === "warning"
                                ? "text-red-900"
                                : "text-shortblack"
                            )}
                          >
                            {msg.subject}
                          </h5>
                          <span className="text-[1.1em] text-grays flex items-center gap-1.5 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {format.relativeTime(
                              new Date(msg.sentAt),
                              new Date()
                            )}
                          </span>
                        </div>
                        <p className="text-[1.2em] text-grays line-clamp-2 leading-relaxed">
                          {msg.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[1em] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wide">
                            {msg.category}
                          </span>
                        </div>
                      </div>
                      <div className="self-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                        <ChevronRight className="w-5 h-5 text-grays" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
