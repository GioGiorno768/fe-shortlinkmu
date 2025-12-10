// Error Alert Component for Auth Pages
"use client";

import { motion } from "motion/react";

interface ErrorAlertProps {
  error: string;
  onClose: () => void;
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors text-xl font-bold"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
