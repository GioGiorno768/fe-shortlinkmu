"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckSquare } from "lucide-react";

interface UserSelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  onSendMessage: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function UserSelectionBar({
  selectedCount,
  onClear,
  onSendMessage,
  onSelectAll,
  isAllSelected,
}: UserSelectionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="bg-shortblack text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[320px]">
            <div className="flex items-center gap-4 border-r border-white/20 pr-6">
              <span className="font-bold text-[1.4em] whitespace-nowrap">
                {selectedCount} Selected
              </span>
              <button
                onClick={onClear}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl font-bold text-[1.2em] hover:bg-white/20 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                {isAllSelected ? "Deselect All" : "Select All"}
              </button>
              <button
                onClick={onSendMessage}
                className="flex items-center gap-2 px-4 py-2 bg-white text-shortblack rounded-xl font-bold text-[1.2em] hover:bg-gray-100 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
