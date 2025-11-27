// src/components/dashboard/NotificationDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Check,
  Megaphone,
  ShieldAlert,
  ArrowLeft,
  Trash2,
  Filter, // Icon Filter
  ChevronDown,
  Link2,
  Wallet,
  User,
  Calendar,
} from "lucide-react";
import clsx from "clsx";
import type { NotificationItem } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";

// --- EXTEND TIPE DATA LOKAL (Biar ada category) ---
interface ExtendedNotificationItem extends NotificationItem {
  category: "link" | "payment" | "account" | "event" | "system";
}

// --- MOCK API (Update Data dengan Kategori) ---
async function fetchNotifications(): Promise<ExtendedNotificationItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      type: "warning",
      category: "system",
      title: "Maintenance Scheduled",
      message: "Sistem akan maintenance pada jam 02:00 - 04:00 WIB.",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      type: "success",
      category: "payment",
      title: "Payout Approved",
      message: "Penarikan dana $15.50 berhasil dikirim ke PayPal.",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "3",
      type: "info",
      category: "event",
      title: "Event Double CPM!",
      message: "Nikmati kenaikan CPM 20% khusus weekend ini!",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "4",
      type: "alert",
      category: "account",
      title: "Login Mencurigakan",
      message: "Login dari IP tidak dikenal (Russia). Segera cek akun.",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "5",
      type: "info",
      category: "link",
      title: "Link Populer",
      message: "Link 'short.link/xyz' tembus 1000 view hari ini!",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ];
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// Opsi Filter
const FILTER_OPTIONS = [
  { id: "all", label: "Semua", icon: null },
  { id: "link", label: "Link", icon: Link2 },
  { id: "payment", label: "Pembayaran", icon: Wallet },
  { id: "account", label: "Akun", icon: User },
  { id: "event", label: "Event", icon: Calendar },
];

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const { showAlert } = useAlert();
  const [notifications, setNotifications] = useState<
    ExtendedNotificationItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Filter
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [selectedNotif, setSelectedNotif] =
    useState<ExtendedNotificationItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSelectedNotif(null);
      setActiveFilter("all"); // Reset filter pas dibuka
      setIsFilterOpen(false);
    }
  }, [isOpen]);

  // Tutup dropdown filter kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Logic Filtering
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  const handleItemClick = (notif: ExtendedNotificationItem) => {
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }
    setSelectedNotif(notif);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showAlert("Semua notifikasi ditandai sudah dibaca.", "success");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif?.id === id) setSelectedNotif(null);
    showAlert("Notifikasi dihapus.", "info");
  };

  // Helper UI (Sama kayak sebelumnya + Icon Kategori)
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
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return `${Math.floor(diff / 86400)}h lalu`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const activeLabel = FILTER_OPTIONS.find((f) => f.id === activeFilter)?.label;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-[-1em] sm:right-0 sm:top-[8em] top-[6em]  w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-xl shadow-slate-500/20 border border-gray-100 overflow-hidden z-50 origin-top-right flex flex-col tall:h-[550px] tall:max-h-[80vh] h-[480px] max-h-[70vh]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {selectedNotif ? (
              /* === DETAIL VIEW === */
              <motion.div
                key="detail"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col bg-white h-full"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white flex-shrink-0">
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-grays"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-[1.6em] font-bold text-shortblack">
                    Detail
                  </h3>
                </div>
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
                <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                  <button
                    onClick={() => handleDelete(selectedNotif.id)}
                    className="text-[1.3em] font-medium text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className="text-[1.3em] font-semibold text-shortblack bg-white border border-gray-200 px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            ) : (
              /* === LIST VIEW === */
              <motion.div
                key="list"
                initial={{ x: "-20%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-20%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col bg-white h-full"
              >
                {/* HEADER UTAMA */}
                <div className="px-6 pt-5 pb-2 bg-white flex-shrink-0 z-20">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[1.8em] font-bold text-shortblack">
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
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>

                  {/* --- FILTER DROPDOWN BARU --- */}
                  <div className="relative pb-2" ref={filterRef}>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-blues rounded-xl text-[1.3em] font-medium text-shortblack hover:bg-blue-100 transition-colors w-full justify-between border border-blue-200/50"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-bluelight" />
                        <span className="text-grays">Filter:</span>
                        <span className="font-bold text-bluelight">
                          {activeLabel}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-grays transition-transform ${
                          isFilterOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isFilterOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg shadow-slate-200 border border-gray-100 p-2 z-30"
                        >
                          {FILTER_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setActiveFilter(option.id);
                                setIsFilterOpen(false);
                              }}
                              className={clsx(
                                "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-[1.3em] transition-colors text-left",
                                activeFilter === option.id
                                  ? "bg-blue-50 text-bluelight font-semibold"
                                  : "text-shortblack hover:bg-gray-50"
                              )}
                            >
                              {option.icon && (
                                <option.icon className="w-4 h-4" />
                              )}
                              <span className={!option.icon ? "ml-7" : ""}>
                                {option.label}
                              </span>
                              {activeFilter === option.id && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* --------------------------- */}
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* CONTENT LIST */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="overflow-y-auto custom-scrollbar-minimal flex-1 bg-white"
                >
                  {isLoading ? (
                    <div className="p-8 text-center text-grays text-[1.4em]">
                      Loading...
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-3 mt-10">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Filter className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-grays text-[1.4em]">
                        Tidak ada notifikasi untuk kategori <b>{activeLabel}</b>
                        .
                      </p>
                      {activeFilter !== "all" && (
                        <button
                          onClick={() => setActiveFilter("all")}
                          className="text-bluelight font-semibold text-[1.3em] hover:underline"
                        >
                          Lihat Semua
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {filteredNotifications.map((item) => (
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
                              <div className="flex items-center gap-2">
                                <span className="text-[1em] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wide">
                                  {item.category}
                                </span>
                                <span className="text-[1.1em] text-gray-400 font-medium">
                                  {formatTime(item.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
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
