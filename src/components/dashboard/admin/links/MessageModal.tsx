"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertTriangle, Megaphone } from "lucide-react";
import clsx from "clsx";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, type: "warning" | "announcement") => void;
  linkTitle?: string;
  isLoading?: boolean;
}

export default function MessageModal({
  isOpen,
  onClose,
  onSend,
  linkTitle,
  isLoading,
}: MessageModalProps) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"warning" | "announcement">("warning");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message, type);
      setMessage(""); // Reset after send
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-[1.4em] font-bold text-shortblack">
                    Send Message to User
                  </h3>
                  {linkTitle && (
                    <p className="text-grays text-[1.1em] truncate max-w-[300px]">
                      Re: {linkTitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-grays"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType("warning")}
                    className={clsx(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      type === "warning"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-100 hover:border-gray-200 text-grays"
                    )}
                  >
                    <AlertTriangle
                      className={clsx(
                        "w-6 h-6",
                        type === "warning" ? "fill-current" : ""
                      )}
                    />
                    <span className="font-bold text-[1.1em]">Warning</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("announcement")}
                    className={clsx(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      type === "announcement"
                        ? "border-bluelight bg-blue-50 text-bluelight"
                        : "border-gray-100 hover:border-gray-200 text-grays"
                    )}
                  >
                    <Megaphone
                      className={clsx(
                        "w-6 h-6",
                        type === "announcement" ? "fill-current" : ""
                      )}
                    />
                    <span className="font-bold text-[1.1em]">Announcement</span>
                  </button>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label className="text-[1.1em] font-bold text-shortblack">
                    Message Content
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      type === "warning"
                        ? "e.g., Your link violates our terms of service..."
                        : "e.g., Great news! Your link is performing well..."
                    }
                    className="w-full p-4 text-[1.2em] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/20 min-h-[120px] resize-none"
                    required
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-[1.2em] font-bold text-grays hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="flex-1 py-3 rounded-xl text-[1.2em] font-bold text-white bg-shortblack hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
