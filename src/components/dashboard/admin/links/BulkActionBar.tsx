"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Ban, CheckCircle2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void; // Buat reset
  onAction: (action: "activate" | "block") => void;
  isAllSelected: boolean; // <--- New Prop
  showActivate: boolean;
  showBlock: boolean;
}

export default function BulkActionBar({
  selectedCount,
  totalItems,
  onSelectAll,
  onDeselectAll, // Pake selectAll() di hook yg logicnya toggle
  onAction,
  isAllSelected, // <--- Destructure
  showActivate,
  showBlock,
}: BulkActionBarProps) {
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
                onClick={onDeselectAll}
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

              {showActivate && (
                <button
                  onClick={() => onAction("activate")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition-colors font-bold text-[1.2em]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Activate
                </button>
              )}
              {showBlock && (
                <button
                  onClick={() => onAction("block")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors font-bold text-[1.2em]"
                >
                  <Ban className="w-4 h-4" /> Block
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
