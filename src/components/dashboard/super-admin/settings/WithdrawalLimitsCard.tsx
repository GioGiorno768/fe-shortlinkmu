"use client";

import { useState } from "react";
import { Edit2, DollarSign, Timer, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WithdrawalLimits {
  min_amount: number;
  max_amount: number;
  limit_count: number;
  limit_days: number;
}

interface WithdrawalLimitsCardProps {
  limits: WithdrawalLimits;
  onUpdate: (limits: WithdrawalLimits) => Promise<void>;
  isLoading?: boolean;
}

export default function WithdrawalLimitsCard({
  limits,
  onUpdate,
  isLoading,
}: WithdrawalLimitsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WithdrawalLimits>(limits);

  // Sync form with props when modal opens
  const openModal = () => {
    setFormData(limits);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-select on focus for better UX
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <>
      {/* Card Display */}
      <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-[1.6em] font-bold text-shortblack">
                Withdrawal Limits
              </h3>
              <p className="text-[1.1em] text-grays">
                Global settings for all payment methods
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium text-[1.2em] hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className="text-[1.1em] text-grays">Min Withdrawal</span>
            </div>
            <p className="text-[1.6em] font-bold text-shortblack">
              ${limits.min_amount.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className="text-[1.1em] text-grays">Max Withdrawal</span>
            </div>
            <p className="text-[1.6em] font-bold text-shortblack">
              {limits.max_amount > 0
                ? `$${limits.max_amount.toFixed(2)}`
                : "Unlimited"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-purple-500" />
              <span className="text-[1.1em] text-grays">Limit Count</span>
            </div>
            <p className="text-[1.6em] font-bold text-shortblack">
              {limits.limit_count > 0 ? `${limits.limit_count}x` : "Unlimited"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-purple-500" />
              <span className="text-[1.1em] text-grays">Per Days</span>
            </div>
            <p className="text-[1.6em] font-bold text-shortblack">
              {limits.limit_days} day{limits.limit_days > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 h-screen bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto font-figtree text-[10px]"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50">
                  <h2 className="text-[2em] font-bold text-shortblack">
                    Edit Withdrawal Limits
                  </h2>
                  <p className="text-[1.2em] text-grays">
                    Set global limits for all withdrawals
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Min Amount */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                      Minimum Withdrawal (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.min_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      onFocus={handleFocus}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-[1.3em]"
                    />
                    <p className="text-[1.1em] text-grays mt-1">
                      User must have at least this amount to withdraw
                    </p>
                  </div>

                  {/* Max Amount */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                      Maximum Withdrawal (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      onFocus={handleFocus}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-[1.3em]"
                    />
                    <p className="text-[1.1em] text-grays mt-1">
                      Set to 0 for unlimited
                    </p>
                  </div>

                  {/* Frequency Limit Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                        Limit Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.limit_count}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limit_count: parseInt(e.target.value) || 0,
                          })
                        }
                        onFocus={handleFocus}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-[1.3em]"
                      />
                      <p className="text-[1.1em] text-grays mt-1">
                        0 = unlimited
                      </p>
                    </div>
                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                        Per Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.limit_days}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limit_days: parseInt(e.target.value) || 1,
                          })
                        }
                        onFocus={handleFocus}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-[1.3em]"
                      />
                      <p className="text-[1.1em] text-grays mt-1">
                        Time window
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-grays font-semibold text-[1.3em] hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-semibold text-[1.3em] hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
