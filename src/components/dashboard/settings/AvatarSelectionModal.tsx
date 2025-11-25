// src/components/dashboard/settings/AvatarSelectionModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import Image from "next/image";

// Kita pake ID angka (1-50) biar dapet variasi cowok & cewek yang pasti
const AVATAR_IDS = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 48, 12, 22, 68, 88, 73, 100, 64, 78, 99,
  94, 56, 96, 86, 67
];

// URL Generator yang BENER
const getAvatarUrl = (id: number) =>
  `https://avatar.iran.liara.run/public/${id}`;

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelect: (url: string) => void;
}

export default function AvatarSelectionModal({
  isOpen,
  onClose,
  currentAvatar,
  onSelect,
}: AvatarSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <h2 className="text-[2em] font-bold text-shortblack">
                Pilih Avatar
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-grays transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              onWheel={(e) => e.stopPropagation()}
              className="p-8 overflow-y-auto custom-scrollbar-minimal bg-blues/30"
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                {AVATAR_IDS.map((id) => {
                  const url = getAvatarUrl(id);
                  const isSelected = currentAvatar === url;

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onSelect(url);
                        onClose();
                      }}
                      className={`
                        group relative aspect-square rounded-full transition-all duration-200
                        ${
                          isSelected
                            ? "ring-4 ring-bluelight scale-105 shadow-lg"
                            : "hover:scale-105 hover:shadow-md bg-white border-2 border-transparent hover:border-blue-200"
                        }
                      `}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
                        {/* Image Next.js dengan URL yang sudah diperbaiki */}
                        <Image
                          src={url}
                          alt={`Avatar ${id}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100px, 150px" // Optimasi ukuran
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-0 right-0 bg-bluelight text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
