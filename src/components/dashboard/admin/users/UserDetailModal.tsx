"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import UserProfileCard from "./UserProfileCard";
import UserDetailTabs from "./UserDetailTabs";
import type { UserDetailData } from "@/types/type";
import * as adminUserService from "@/services/adminUserService";

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const [data, setData] = useState<UserDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetail();
    } else {
      setData(null);
    }
  }, [isOpen, userId]);

  const loadUserDetail = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const detail = await adminUserService.getUserDetail(userId);
      setData(detail);
    } catch (error) {
      console.error("Failed to load user detail", error);
    } finally {
      setIsLoading(false);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative bg-slate-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-[2.2em] font-bold text-shortblack">
                      User Detail
                    </h2>
                    <p className="text-[1.3em] text-grays">
                      View complete user information
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-grays" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
                  {isLoading ? (
                    <div className="text-center py-20 text-grays">
                      Loading user detail...
                    </div>
                  ) : data ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Left: Profile Card */}
                      <UserProfileCard data={data} />

                      {/* Right: Detail Tabs */}
                      <div className="lg:col-span-2">
                        <UserDetailTabs data={data} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-grays">
                      Failed to load user detail
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
