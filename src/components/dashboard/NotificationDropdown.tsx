"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
  Check,
  Megaphone,
  ShieldAlert,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import type { NotificationItem } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

// --- MOCK API ---
async function fetchNotifications(): Promise<NotificationItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      type: "warning",
      title: "Maintenance Scheduled",
      message:
        "Sistem akan maintenance pada jam 02:00 - 04:00 WIB untuk peningkatan performa server. Selama waktu ini, dashboard mungkin tidak dapat diakses, namun link Anda akan tetap bekerja normal. Harap bersiap.",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      type: "success",
      title: "Payout Approved",
      message:
        "Penarikan dana sebesar $15.50 telah berhasil dikirim ke PayPal Anda. Silakan cek email atau akun PayPal Anda untuk konfirmasi penerimaan dana.",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "3",
      type: "info",
      title: "Event Double CPM!",
      message:
        "Nikmati kenaikan CPM 20% khusus weekend ini! Promo berlaku untuk semua negara traffic. Gas traffic sekarang sebelum event berakhir hari Minggu jam 23:59.",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "4",
      type: "alert",
      title: "Percobaan Login Mencurigakan",
      message:
        "Kami mendeteksi login dari IP tidak dikenal (192.168.X.X - Russia). Jika ini bukan Anda, segera ganti password dan aktifkan 2FA di menu Settings.",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const { showAlert } = useAlert();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Detail View
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Reset ke list view pas dibuka ulang
      setSelectedNotif(null);
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (e) {
      console.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Klik Item (Masuk ke Detail & Tandai Baca)
  const handleItemClick = (notif: NotificationItem) => {
    // Tandai sudah dibaca di state lokal
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }
    // Set notif aktif buat nampilin detail
    setSelectedNotif(notif);
  };

  // Handler Back ke List
  const handleBack = () => {
    setSelectedNotif(null);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showAlert("Semua notifikasi ditandai sudah dibaca.", "success");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif?.id === id) setSelectedNotif(null); // Balik ke list kalau yg dihapus lagi dibuka
    showAlert("Notifikasi dihapus.", "info");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "alert":
        return <ShieldAlert className="w-6 h-6 text-red-500" />;
      default:
        return <Megaphone className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-orange-50";
      case "success":
        return "bg-green-50";
      case "alert":
        return "bg-red-50";
      default:
        return "bg-blue-50";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-[-1em] sm:right-0 top-[7em] w-[300px] sm:w-[380px] bg-white rounded-2xl shadow-xl shadow-slate-500/20 border border-gray-100 overflow-hidden z-50 origin-top-right flex flex-col"
          // Penting: Kasih tinggi fix atau max-height biar transisi smooth
          style={{ height: "500px", maxHeight: "80vh" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {selectedNotif ? (
              /* ========================== */
              /* === DETAIL VIEW (SLIDE) === */
              /* ========================== */
              <motion.div
                key="detail"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col bg-white h-full"
              >
                {/* Header Detail */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white flex-shrink-0">
                  <button
                    onClick={handleBack}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-grays transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-[1.6em] font-bold text-shortblack">
                    Detail
                  </h3>
                </div>

                {/* Content Detail */}
                <div className="p-8 overflow-y-auto custom-scrollbar-minimal flex-1">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div
                        className={clsx(
                          "w-16 h-16 rounded-2xl flex items-center justify-center",
                          getBgColor(selectedNotif.type)
                        )}
                      >
                        {getIcon(selectedNotif.type)}
                      </div>
                      <span className="text-[1.2em] font-medium text-gray-400">
                        {formatTime(selectedNotif.timestamp)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[2em] font-bold text-shortblack mb-4 leading-tight">
                        {selectedNotif.title}
                      </h2>
                      <p className="text-[1.5em] text-grays leading-relaxed whitespace-pre-wrap">
                        {selectedNotif.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Detail */}
                <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                  <button
                    onClick={() => handleDelete(selectedNotif.id)}
                    className="text-[1.3em] font-medium text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                  <button
                    onClick={handleBack}
                    className="text-[1.3em] font-semibold text-shortblack bg-white border border-gray-200 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ========================== */
              /* === LIST VIEW (DEFAULT) === */
              /* ========================== */
              <motion.div
                key="list"
                initial={{ x: "-20%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-20%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col bg-white h-full"
              >
                {/* Header List */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[1.6em] font-bold text-shortblack">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[1.1em] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[1.2em] font-medium text-bluelight hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>

                {/* Content List */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="overflow-y-auto custom-scrollbar-minimal flex-1"
                >
                  {isLoading ? (
                    <div className="p-8 text-center text-grays text-[1.4em]">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-3 mt-10">
                      <Bell className="w-12 h-12 text-gray-200" />
                      <p className="text-grays text-[1.4em]">
                        Tidak ada notifikasi baru.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={clsx(
                            "p-5 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                            !item.isRead ? "bg-blue-50/40" : "bg-white"
                          )}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex gap-4">
                            <div
                              className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                getBgColor(item.type)
                              )}
                            >
                              {/* Icon di list lebih kecil dikit */}
                              <div className="scale-75">
                                {getIcon(item.type)}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4
                                  className={clsx(
                                    "text-[1.4em] font-bold leading-tight pr-2 truncate w-[80%]",
                                    item.isRead
                                      ? "text-shortblack"
                                      : "text-bluelight"
                                  )}
                                >
                                  {item.title}
                                </h4>
                                {!item.isRead && (
                                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-[1.3em] text-grays leading-snug mb-2 line-clamp-2">
                                {item.message}
                              </p>
                              <p className="text-[1.1em] text-gray-400 font-medium">
                                {formatTime(item.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer List */}
                <div className="p-3 bg-slate-50 border-t border-gray-100 text-center flex-shrink-0">
                  <button
                    onClick={onClose}
                    className="text-[1.3em] font-semibold text-shortblack hover:text-bluelight transition-colors w-full py-1"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
