"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Link as LinkIcon,
  MoreHorizontal,
  ChevronDown,
  Edit,
  EyeOff,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import type { TopLinkItem, EditableLinkData } from "@/types/type";
import EditLinkModal from "./EditLinkModal"; // <-- Pastiin path import ini bener
import { useAlert } from "@/hooks/useAlert";

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
async function fetchTopPerformingLinks(
  sortBy: "latest" | "longest"
): Promise<TopLinkItem[]> {
  console.log(`MANGGIL API: /api/links/top-performing?sort=${sortBy}`);

  // Simulasi loading
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock Data (Pastiin ada 'adsLevel')
  const mockLinks: TopLinkItem[] = [
    {
      id: "1",
      shortUrl: "short.link/asu12",
      originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      totalViews: 5100,
      totalEarnings: 22.95,
      cpm: 4.5,
      alias: "asu12",
      adsLevel: "level3",
      passwordProtected: false,
    },
    {
      id: "2",
      shortUrl: "short.link/mULy0n0",
      originalUrl: "https://www.google.com",
      totalViews: 4200,
      totalEarnings: 18.9,
      cpm: 4.5,
      adsLevel: "level1",
      passwordProtected: false,
    },
    {
      id: "3",
      shortUrl: "short.link/w1W0k12",
      originalUrl: "https://www.github.com",
      totalViews: 3500,
      totalEarnings: 15.75,
      cpm: 4.5,
      adsLevel: "noAds",
      passwordProtected: false,
    },
    {
      id: "4",
      shortUrl: "short.link/gatot",
      originalUrl: "https://www.vercel.com",
      totalViews: 2800,
      totalEarnings: 12.6,
      cpm: 4.5,
      password: "123",
      expiresAt: "2025-12-31T23:59:00Z",
      adsLevel: "level2",
      passwordProtected: true,
    },
    {
      id: "5",
      shortUrl: "short.link/kaca",
      originalUrl: "https://www.figma.com",
      totalViews: 1500,
      totalEarnings: 6.75,
      cpm: 4.5,
      adsLevel: "level4",
      passwordProtected: false,
    },
  ];

  if (sortBy === "longest") {
    return mockLinks.reverse();
  }
  return mockLinks;
}

export default function TopPerformingLinksCard() {
  const t = useTranslations("Dashboard");
  const { showAlert } = useAlert();

  // State Data
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<TopLinkItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State UI
  const [sortBy, setSortBy] = useState<"latest" | "longest">("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>("1");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<TopLinkItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Refs
  const sortRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Fetch Data
  useEffect(() => {
    async function loadLinks() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTopPerformingLinks(sortBy);
        setLinks(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat link");
      } finally {
        setIsLoading(false);
      }
    }
    loadLinks();
  }, [sortBy]);

  // Handle Click Outside (Dropdowns)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---

  const handleSortChange = (value: "latest" | "longest") => {
    setSortBy(value);
    setIsSortOpen(false);
  };

  const handleAccordionToggle = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
    setOpenActionMenuId(null);
  };

  const handleActionMenuToggle = (id: string) => {
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  const handleHideLink = async (id: string) => {
    setOpenActionMenuId(null);
    // alert(`Link ${id} disembunyikan (simulasi)`); <-- HAPUS

    // GANTI JADI INI
    showAlert(
      "Link berhasil disembunyikan dari list.",
      "success",
      "Link Hidden"
    );
  };

  // --- Modal Logic ---

  const openModal = (link: TopLinkItem) => {
    setSelectedLink(link);
    setIsModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleUpdateLink = async (formData: EditableLinkData) => {
    if (!selectedLink) return;
    setIsUpdating(true);

    console.log("Updating link (TopPerforming):", selectedLink.id, formData);

    // Simulasi API Call (Delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update state lokal biar UI langsung berubah
    setLinks(
      links.map((l) =>
        l.id === selectedLink.id
          ? {
              ...l,
              ...formData,
              shortUrl: `short.link/${formData.alias}`,
            }
          : l
      )
    );

    setIsUpdating(false);
    setIsModalOpen(false);
    setTimeout(() => setSelectedLink(null), 300);
  };

  return (
    <>
      {/* Wrapper Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        {/* Header Card */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
            {t("topPerformingLinks")}
          </h3>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-[1.4em] font-medium text-grays hover:text-bluelight transition-colors"
            >
              <span>{sortBy === "latest" ? t("latest") : "Longest"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                >
                  <button
                    onClick={() => handleSortChange("latest")}
                    className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                      sortBy === "latest"
                        ? "text-bluelight font-semibold bg-blue-dashboard"
                        : "text-shortblack hover:bg-blues"
                    }`}
                  >
                    {t("latest")}
                  </button>
                  <button
                    onClick={() => handleSortChange("longest")}
                    className={`block w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md ${
                      sortBy === "longest"
                        ? "text-bluelight font-semibold bg-blue-dashboard"
                        : "text-shortblack hover:bg-blues"
                    }`}
                  >
                    Longest
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* List Links */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-redshortlink">
              {error}
            </div>
          ) : (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="h-[300px] overflow-y-auto pr-2 space-y-2 overscroll-contain custom-scrollbar-minimal"
            >
              {links.map((link) => (
                <div
                  key={link.id}
                  className={`rounded-xl transition-colors ${
                    openAccordionId === link.id ? "bg-blues" : "bg-white"
                  }`}
                >
                  {/* Link Item Header (Accordion Trigger) */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => handleAccordionToggle(link.id)}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-dashboard">
                        <LinkIcon className="w-4 h-4 text-bluelight flex-shrink-0" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[1.6em] font-semibold text-shortblack truncate">
                          {link.shortUrl}
                        </p>
                        <p className="text-[1.4em] text-grays w-[80%] line-clamp-1">
                          {link.originalUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Kebab Menu (Action) */}
                      <div className="relative" ref={actionMenuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionMenuToggle(link.id);
                          }}
                          className={`p-1 rounded-full hover:text-bluelight text-grays ${
                            openActionMenuId === link.id
                              ? "text-bluelight bg-blue-dashboard"
                              : ""
                          }`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {openActionMenuId === link.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.1 }}
                              className="absolute top-full right-0 mt-1 p-[.5em] w-max bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                            >
                              <button
                                onClick={() => openModal(link)}
                                className="flex items-center gap-2 w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md text-shortblack hover:bg-blues"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleHideLink(link.id)}
                                className="flex items-center gap-2 w-full text-left text-[1.4em] px-[1em] py-[.5em] rounded-md text-shortblack hover:bg-blues"
                              >
                                <EyeOff className="w-4 h-4" />
                                <span>Hide</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <ChevronDown
                        className={`w-5 h-5 transition-transform rounded-full ${
                          openAccordionId === link.id
                            ? "rotate-180 text-bluelight bg-blue-dashboard"
                            : "text-grays"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {openAccordionId === link.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-2 border-t border-bluelight/20">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 text-[1.4em]">
                              <p className="text-grays">
                                Valid Views:{" "}
                                <span className="font-medium text-shortblack">
                                  {link.totalViews.toLocaleString("en-US")}
                                </span>
                              </p>
                              <p className="text-grays">
                                Pendapatan:{" "}
                                <span className="font-medium text-shortblack">
                                  ${link.totalEarnings.toFixed(2)}
                                </span>
                              </p>
                              <p className="text-grays">
                                CPM:{" "}
                                <span className="font-medium text-shortblack">
                                  ${link.cpm.toFixed(2)}
                                </span>
                              </p>
                            </div>
                            <Link
                              href={`/analytics/${link.id}`}
                              className="text-[1.4em] font-medium bg-white text-bluelight px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
                            >
                              Detail
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <EditLinkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedLink(null), 300);
        }}
        onSubmit={handleUpdateLink}
        initialData={
          selectedLink
            ? {
                alias:
                  selectedLink.alias ||
                  selectedLink.shortUrl.split("/").pop() ||
                  "",
                password: selectedLink.password,
                // Konversi ISO string ke format datetime-local (YYYY-MM-DDTHH:mm)
                expiresAt: selectedLink.expiresAt
                  ? new Date(
                      new Date(selectedLink.expiresAt).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  : "",
                adsLevel: selectedLink.adsLevel || "level1",
              }
            : null
        }
        isUpdating={isUpdating}
        shortUrlDisplay={selectedLink?.shortUrl}
        originalUrlDisplay={selectedLink?.originalUrl}
      />
    </>
  );
}
