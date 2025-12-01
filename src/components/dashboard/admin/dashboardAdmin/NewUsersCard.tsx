"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";
import type { RecentUser } from "@/types/type";
import { Link, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface NewUsersCardProps {
  users: RecentUser[];
  isLoading: boolean;
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function NewUsersCard({
  users,
  isLoading,
  currentFilter = "all",
  onFilterChange,
}: NewUsersCardProps) {
  const t = useTranslations("AdminDashboard.NewUsers");
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setActiveDropdown(false);
  };

  // Limit to 7 items
  const displayedUsers = users.slice(0, 7);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 h-[400px] animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[1.8em] font-bold text-shortblack">{t("title")}</h3>
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <MoreHorizontal className="w-[1.6em] h-[1.6em] text-grays" />
          </button>
          <AnimatePresence>
            {activeDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-[1.1em] font-semibold text-grays border-b border-gray-50 mb-1">
                    {t("filter.title")}
                  </div>
                  {[
                    { label: t("filter.all"), value: "all" },
                    { label: t("filter.active"), value: "active" },
                    { label: t("filter.banned"), value: "banned" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleFilterClick(item.value)}
                      className={clsx(
                        "w-full text-left px-3 py-2 text-[1.2em] rounded-lg transition-colors",
                        currentFilter === item.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-shortblack hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        onWheel={(e) => e.stopPropagation()}
        className="space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar-minimal"
      >
        {displayedUsers.length === 0 ? (
          <p className="text-center text-grays py-8">{t("noUsers")}</p>
        ) : (
          displayedUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-[4em] h-[4em] rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[1.4em] font-bold text-shortblack group-hover:text-bluelight transition-colors">
                      {user.name}
                    </h4>
                    <button
                      onClick={(e) => handleCopy(e, user.id, user.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy User ID"
                    >
                      {copiedId === user.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-[1.1em] text-grays mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-[1.1em] text-grays flex items-center gap-1"
                  title={formatFullDate(user.joinedAt)}
                >
                  <Calendar className="w-3 h-3" />
                  {formatDate(user.joinedAt)}
                </span>
                <span
                  className={clsx(
                    "text-[1em] px-2 py-0.5 rounded-lg font-medium",
                    user.status === "active"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-red-50 text-red-600"
                  )}
                >
                  {user.status === "active"
                    ? t("status.active")
                    : t("status.banned")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/admin/users"
        className="w-full mt-6 py-3 text-[1.3em] font-medium text-grays hover:text-bluelight hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <span>{t("manageUsers")}</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
