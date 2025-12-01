"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Ban, CheckCircle2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalVisible: number;
  onSelectAll: () => void;
  onDeselectAll: () => void; // Buat reset
  onAction: (action: "activate" | "block") => void;
}

export default function BulkActionBar({
  selectedCount,
  totalVisible,
  onSelectAll,
  onDeselectAll, // Pake selectAll() di hook yg logicnya toggle
  onAction,
}: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4"
        >
          <div className="bg-shortblack text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 min-w-[300px] border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="flex items-center gap-2 font-bold text-[1.4em]">
                <span className="bg-bluelight text-white w-6 h-6 rounded flex items-center justify-center text-xs">
                  {selectedCount}
                </span>
                <span>Selected</span>
              </div>
              <button
                onClick={onSelectAll}
                className="text-slate-400 hover:text-white text-[1.2em] underline ml-2"
              >
                {selectedCount === totalVisible ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onAction("activate")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-bold text-[1.2em]"
              >
                <CheckCircle2 className="w-4 h-4" /> Activate
              </button>
              <button
                onClick={() => onAction("block")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-bold text-[1.2em]"
              >
                <Ban className="w-4 h-4" /> Block
              </button>
            </div>

            <button
              onClick={onDeselectAll}
              className="ml-auto p-1 hover:bg-slate-700 rounded-full"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
