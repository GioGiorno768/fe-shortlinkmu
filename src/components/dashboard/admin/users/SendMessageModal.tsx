"use client";

import { useState } from "react";
import { X, Send, AlertTriangle, Megaphone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (
    subject: string,
    message: string,
    type: "warning" | "info"
  ) => Promise<void>;
  recipientCount: number;
  isSending: boolean;
}

export default function SendMessageModal({
  isOpen,
  onClose,
  onSend,
  recipientCount,
  isSending,
}: SendMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"warning" | "info">("warning");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    await onSend(subject, message, type);
    // Reset form handled by parent or on close
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSubject("");
    setMessage("");
    setType("warning");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-shortblack/60 backdrop-blur-sm z-[60] h-screen"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[50rem] rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto font-figtree relative"
            >
              {/* Decorative Background Blob */}
              <div
                className={clsx(
                  "absolute top-0 left-0 w-full h-32 opacity-10 pointer-events-none transition-colors duration-500",
                  type === "warning" ? "bg-red-500" : "bg-blue-500"
                )}
              />

              {/* Header Section */}
              <div className="px-8 pt-8 pb-6 relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-[2.2em] font-bold text-shortblack leading-tight">
                    Send Message
                  </h2>
                  <p className="text-[1.4em] text-grays mt-1 max-w-[30rem] truncate">
                    Sending to{" "}
                    <span className="font-bold text-shortblack">
                      {recipientCount}
                    </span>{" "}
                    users
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2.5 rounded-full bg-white hover:bg-gray-100 text-grays hover:text-shortblack transition-all shadow-sm border border-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body Section */}
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-8">
                {/* Type Selection Tabs */}
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                  {[
                    {
                      id: "warning",
                      label: "Warning Alert",
                      icon: AlertTriangle,
                      color: "text-red-500",
                      activeBg:
                        "bg-white shadow-sm border-red-100 ring-1 ring-red-50",
                    },
                    {
                      id: "info",
                      label: "Info / News",
                      icon: Megaphone,
                      color: "text-blue-500",
                      activeBg:
                        "bg-white shadow-sm border-blue-100 ring-1 ring-blue-50",
                    },
                  ].map((item) => {
                    const isActive = type === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as any)}
                        className={clsx(
                          "flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 relative overflow-hidden group",
                          isActive
                            ? item.activeBg
                            : "hover:bg-white/60 text-grays"
                        )}
                      >
                        <div
                          className={clsx(
                            "p-2 rounded-lg transition-colors",
                            isActive
                              ? `bg-${
                                  item.id === "warning" ? "red" : "blue"
                                }-50`
                              : "bg-transparent group-hover:bg-gray-100"
                          )}
                        >
                          <Icon
                            className={clsx(
                              "w-5 h-5",
                              isActive ? item.color : "text-gray-400"
                            )}
                          />
                        </div>
                        <span
                          className={clsx(
                            "text-[1.4em] font-bold",
                            isActive ? "text-shortblack" : "text-gray-400"
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Subject Input */}
                <div className="space-y-3">
                  <label className="text-[1.3em] font-bold text-shortblack ml-1">
                    Subject
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Important Account Update"
                      className={clsx(
                        "w-full px-5 py-4 text-[1.4em] rounded-2xl bg-gray-50 border-2 transition-all duration-200 focus:outline-none placeholder:text-gray-300 text-shortblack",
                        type === "warning"
                          ? "focus:border-red-200 focus:bg-white focus:shadow-lg focus:shadow-red-500/5 border-transparent"
                          : "focus:border-blue-200 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 border-transparent"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Message Input Area */}
                <div className="space-y-3">
                  <label className="text-[1.3em] font-bold text-shortblack ml-1 flex justify-between">
                    <span>Message Content</span>
                    <span
                      className={clsx(
                        "text-[1.1em] font-normal",
                        message.length > 0 ? "text-bluelight" : "text-gray-300"
                      )}
                    >
                      {message.length} chars
                    </span>
                  </label>
                  <div className="relative group">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        type === "warning"
                          ? "Tulis alasan kenapa user ini diberi peringatan..."
                          : "Tulis pesan atau pengumuman untuk user ini..."
                      }
                      className={clsx(
                        "w-full p-5 text-[1.4em] rounded-2xl bg-gray-50 border-2 transition-all duration-200 min-h-[160px] resize-none focus:outline-none placeholder:text-gray-300 text-shortblack leading-relaxed",
                        type === "warning"
                          ? "focus:border-red-200 focus:bg-white focus:shadow-lg focus:shadow-red-500/5 border-transparent"
                          : "focus:border-blue-200 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 border-transparent"
                      )}
                      required
                    />
                    {/* Focus Indicator Line */}
                    <div
                      className={clsx(
                        "absolute bottom-0 left-6 right-6 h-[2px] scale-x-0 transition-transform duration-300 origin-left",
                        type === "warning" ? "bg-red-500" : "bg-blue-500",
                        "group-focus-within:scale-x-100"
                      )}
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-8 py-4 rounded-2xl text-[1.4em] font-bold text-grays hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || !subject.trim() || !message.trim()}
                    className={clsx(
                      "flex-1 py-4 rounded-2xl text-[1.4em] font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none",
                      type === "warning"
                        ? "bg-gradient-to-r from-red-600 to-red-500 shadow-red-200"
                        : "bg-gradient-to-r from-blue-600 to-bluelight shadow-blue-200"
                    )}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
