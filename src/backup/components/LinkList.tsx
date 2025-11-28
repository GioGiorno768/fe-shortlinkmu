"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Pencil,
  EyeOff,
  Link as LinkIcon,
  Calendar,
  Eye,
  DollarSign,
  Lock,
  MoreHorizontal,
  MapPin,
  BarChart,
  Wallet,
  Megaphone,
  TypeOutline,
} from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import EditLinkModal from "../../components/dashboard/EditLinkModal";
import type { AdLevel, EditableLinkData } from "@/types/type";
import { useAlert } from "@/hooks/useAlert";
import ConfirmationModal from "../../components/dashboard/ConfirmationModal";

// Interface Shortlink
interface Shortlink {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  dateCreated: string;
  dateExpired?: string;
  validViews: number;
  totalEarning: number;
  totalClicks: number;
  averageCPM: number;
  adsLevel: AdLevel;
  passwordProtected: boolean;
  password?: string; // Pastikan ini ada buat diisi ke input
  status: "active" | "disabled";
}

// Tipe Filter & Sort
type FilterByType =
  | "date"
  | "topLinks"
  | "dateExpired"
  | "validViews"
  | "totalEarning"
  | "avgCPM"
  | "linkEnabled"
  | "linkDisabled"
  | "linkPassword";

type SortByType = "highest" | "lowest";

export default function LinkList() {
  const t = useTranslations("Dashboard");
  const { showAlert } = useAlert();

  // State Data
  const [links, setLinks] = useState<Shortlink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // STATE BUAT MODAL KONFIRMASI
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    linkId: "",
    currentStatus: "" as "active" | "disabled",
    isLoading: false,
  });

  // State UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<FilterByType>("date");
  const [sortBy, setSortBy] = useState<SortByType>("highest");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  // 1. STATE BARU: Buat ngelacak visibilitas password per link ID
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const linksPerPage = 10;

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Shortlink | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Refs
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // Helper Formats
  const formatLinkDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openDisableConfirmation = (
    linkId: string,
    currentStatus: "active" | "disabled"
  ) => {
    setOpenDropdown(null); // Tutup dropdown menu dulu
    setConfirmModal({
      isOpen: true,
      linkId,
      currentStatus,
      isLoading: false,
    });
  };

  const handleConfirmDisable = async () => {
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));

    const { linkId, currentStatus } = confirmModal;
    const newStatus = currentStatus === "active" ? "disabled" : "active";

    // Simulasi API call (Ganti logic handleDisableLink lu yg lama kesini)
    await new Promise((r) => setTimeout(r, 1000));

    setLinks(
      links.map((l) => (l.id === linkId ? { ...l, status: newStatus } : l))
    );

    showAlert(
      `Link berhasil diubah menjadi ${newStatus}.`,
      newStatus === "active" ? "success" : "warning",
      "Status Updated"
    );

    // Tutup Modal & Reset Loading
    setConfirmModal({
      isOpen: false,
      linkId: "",
      currentStatus: "active",
      isLoading: false,
    });
  };

  const formatNumber = (num: number) => num.toLocaleString("en-US");
  const formatCurrency = (num: number) =>
    "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // 2. HANDLER BARU: Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch Data (Mock)
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData: Shortlink[] = [
          {
            id: "1",
            title: "Link Shadow Fight Mod",
            shortUrl: "short.link/w1W0K12",
            originalUrl: "https://preline.co/examples/html/hero-agency.html",
            dateCreated: "2025-10-11T20:25:00Z",
            dateExpired: "2025-10-11T20:25:00Z",
            validViews: 2120,
            totalEarning: 2089,
            totalClicks: 22001,
            averageCPM: 10.0,
            passwordProtected: true,
            password: "rahasia123", // Password dummy
            adsLevel: "level3",
            status: "active",
          },
          {
            id: "2",
            title: "Turbo VPN Mod",
            shortUrl: "short.link/wongirengjembuten635",
            originalUrl: "https://example.com/turbo-vpn-mod",
            dateCreated: "2025-10-10T08:20:00Z",
            dateExpired: undefined,
            validViews: 1500,
            totalEarning: 13.5,
            totalClicks: 15001,
            averageCPM: 9.0,
            passwordProtected: false,
            password: "", // Gak ada password
            adsLevel: "level1",
            status: "active",
          },
          // ... generate data dummy lainnya ...
          ...Array(16)
            .fill(null)
            .map((_, i) => ({
              id: `link-${i + 5}`,
              title: `Generated Link ${i + 5}`,
              shortUrl: `short.link/gen${i + 5}`,
              originalUrl: `https://generated.link/page${i + 5}`,
              dateCreated: `2025-10-0${
                Math.floor(Math.random() * 9) + 1
              }T12:00:00Z`,
              dateExpired: i % 3 === 0 ? "2025-11-15T12:00:00Z" : undefined,
              validViews: Math.floor(Math.random() * 2000),
              totalEarning: Math.floor(Math.random() * 20),
              totalClicks: Math.floor(Math.random() * 20000),
              averageCPM: Math.floor(Math.random() * 10),
              passwordProtected: i % 4 === 0,
              password: i % 4 === 0 ? "pass1234" : "",
              adsLevel: ["noAds", "level1", "level2", "level3", "level4"][
                Math.floor(Math.random() * 5)
              ] as AdLevel,
              status: (i % 5 === 0 ? "disabled" : "active") as
                | "active"
                | "disabled",
            })),
        ];

        // Filter & Sort Logic (Sama kayak sebelumnya)
        const filtered = mockData
          .filter((link) => {
            const s = searchTerm.toLowerCase();
            return (
              link.title.toLowerCase().includes(s) ||
              link.shortUrl.toLowerCase().includes(s) ||
              link.originalUrl.toLowerCase().includes(s)
            );
          })
          .filter((link) => {
            if (filterBy === "linkEnabled") return link.status === "active";
            if (filterBy === "linkDisabled") return link.status === "disabled";
            if (filterBy === "linkPassword") return link.passwordProtected;
            if (filterBy === "dateExpired") return !!link.dateExpired;
            return true;
          });

        filtered.sort((a, b) => {
          let fieldA: number | Date, fieldB: number | Date;
          switch (filterBy) {
            case "validViews":
              [fieldA, fieldB] = [a.validViews, b.validViews];
              break;
            case "totalEarning":
              [fieldA, fieldB] = [a.totalEarning, b.totalEarning];
              break;
            case "avgCPM":
              [fieldA, fieldB] = [a.averageCPM, b.averageCPM];
              break;
            default: // date
              [fieldA, fieldB] = [
                new Date(a.dateCreated),
                new Date(b.dateCreated),
              ];
          }
          if (sortBy === "lowest") return fieldA > fieldB ? 1 : -1;
          return fieldA < fieldB ? 1 : -1;
        });

        setTotalLinks(filtered.length);
        setLinks(
          filtered.slice(
            (currentPage - 1) * linksPerPage,
            currentPage * linksPerPage
          )
        );
      } catch (err: any) {
        setError(err.message || "Gagal memuat link");
      } finally {
        setIsLoading(false);
      }
    };

    const searchTimeout = setTimeout(() => {
      fetchLinks();
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [currentPage, searchTerm, filterBy, sortBy]);

  // Outside Click Handler (Sama kayak sebelumnya)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideFilter =
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node);
      const isOutsideSort =
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node);

      if (isOutsideFilter || isOutsideSort) {
        if (openDropdown === "filter" || openDropdown === "sort") {
          setOpenDropdown(null);
        }
      }
      if (
        openDropdown?.startsWith("link-") &&
        !(event.target as Element).closest("button")
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // --- HANDLERS LAIN (Sama) ---
  const handleToggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleFilterChange = (value: FilterByType) => {
    setFilterBy(value);
    setOpenDropdown(null);
    setCurrentPage(1);
    if (!["validViews", "totalEarning", "avgCPM"].includes(value)) {
      setSortBy("highest");
    }
  };

  const handleSortChange = (value: SortByType) => {
    setSortBy(value);
    setOpenDropdown(null);
    setCurrentPage(1);
  };

  const handleAccordionToggle = (id: string) => {
    setExpandedLink(expandedLink === id ? null : id);
    setOpenDropdown(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- GANTI BAGIAN INI ---
  const handleEditLink = (linkId: string) => {
    const linkToEdit = links.find((l) => l.id === linkId);
    if (linkToEdit) {
      setSelectedLink(linkToEdit);
      setIsModalOpen(true);
      setOpenDropdown(null);
    } else {
      // Contoh alert error kalau link ga ketemu (opsional)
      showAlert("Link not found!", "error");
    }
  };

  const handleUpdateLink = async (formData: EditableLinkData) => {
    if (!selectedLink) return;
    setIsUpdating(true);

    // Simulasi Update
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLinks(
      links.map((l) =>
        l.id === selectedLink.id
          ? {
              ...l,
              shortUrl: `short.link/${formData.alias}`,
              adsLevel: formData.adsLevel,
              password: formData.password,
              passwordProtected: !!formData.password,
              dateExpired: formData.expiresAt
                ? new Date(formData.expiresAt).toISOString()
                : undefined,
            }
          : l
      )
    );

    setIsUpdating(false);
    setIsModalOpen(false);
    setTimeout(() => setSelectedLink(null), 300);
  };

  const handleDisableLink = async (
    linkId: string,
    currentStatus: "active" | "disabled"
  ) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";

    // GANTI ALERT DISINI
    // alert(`API CALL: Ubah status link ${linkId} jadi ${newStatus}`);

    // Simulasi update state
    setLinks(
      links.map((l) => (l.id === linkId ? { ...l, status: newStatus } : l))
    );
    setOpenDropdown(null);

    // Tampilkan Alert Keren
    showAlert(
      `Link berhasil diubah menjadi ${newStatus}.`,
      newStatus === "active" ? "success" : "warning",
      "Status Updated"
    );
  };

  const totalPages = Math.ceil(totalLinks / linksPerPage);
  const showSortDropdown = ["validViews", "totalEarning", "avgCPM"].includes(
    filterBy
  );

  const filterOptions: { key: FilterByType; label: string }[] = [
    { key: "date", label: "By Date" },
    { key: "topLinks", label: "By Top Links" },
    { key: "dateExpired", label: "By Date Expired" },
    { key: "validViews", label: "By Valid Views" },
    { key: "totalEarning", label: "By Total Earning" },
    { key: "avgCPM", label: "By AVG CPM" },
    { key: "linkPassword", label: "By Link Password" },
    { key: "linkDisabled", label: "By Link Disabled" },
    { key: "linkEnabled", label: "By Link Enabled" },
  ];

  return (
    <div className="rounded-xl mt-6 text-[10px]">
      {/* === HEADER (Sama seperti sebelumnya) === */}
      <div className="flex flex-col bg-white md:flex-row items-center justify-between gap-4 mb-6 shadow-sm shadow-slate-500/50 p-6 rounded-3xl">
        <div className="relative w-full md:max-w-xs">
          <Search
            className="w-5 h-5 text-grays absolute left-4 top-1/2 -translate-y-1/2"
            strokeWidth={2.5}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight text-[1.4em] text-shortblack placeholder:text-gray-400 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                ref={sortDropdownRef}
                className="relative"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleDropdown("sort")}
                  className="flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-blues transition-colors"
                >
                  <span>{sortBy === "highest" ? "Highest" : "Lowest"}</span>
                  <ChevronDown
                    className={clsx(
                      "w-5 h-5 text-grays transition-transform",
                      openDropdown === "sort" && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "sort" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full sm:right-0 left-0 mt-2 p-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                    >
                      <button
                        onClick={() => handleSortChange("highest")}
                        className={`block w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues ${
                          sortBy === "highest" &&
                          "font-semibold bg-blue-dashboard text-bluelight"
                        }`}
                      >
                        Highest
                      </button>
                      <button
                        onClick={() => handleSortChange("lowest")}
                        className={`block w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues ${
                          sortBy === "lowest" &&
                          "font-semibold bg-blue-dashboard text-bluelight"
                        }`}
                      >
                        Lowest
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={filterDropdownRef} className="relative w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleToggleDropdown("filter")}
              className="flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-blues transition-colors"
            >
              <span>
                {filterOptions.find((f) => f.key === filterBy)?.label}
              </span>
              <SlidersHorizontal className="w-5 h-5 text-grays" />
            </button>
            <AnimatePresence>
              {openDropdown === "filter" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onWheel={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-2 p-2 w-56 bg-white rounded-lg shadow-lg z-20 border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar-minimal"
                >
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleFilterChange(opt.key)}
                      className={clsx(
                        "block w-full text-left text-[1.5em] px-3 py-2 rounded-md",
                        filterBy === opt.key
                          ? "text-bluelight font-semibold bg-blue-dashboard"
                          : "text-shortblack hover:bg-blues"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* === LIST LINKS === */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-grays py-8">Loading links...</p>
        ) : error ? (
          <p className="text-center text-redshortlink py-8">{error}</p>
        ) : links.length === 0 ? (
          <p className="text-center text-grays py-8">No links found.</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={clsx(
                "rounded-3xl bg-white shadow-sm shadow-slate-500/50 transition-shadow block w-full text-start",
                link.status === "disabled" && "bg-gray-50 opacity-70",
                expandedLink === link.id && "shadow-lg"
              )}
            >
              {/* Header Item */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccordionToggle(link.id);
                }}
                className="flex items-center justify-between p-6 cursor-pointer"
              >
                <div className="flex items-center sm:gap-4 gap-3 min-w-0">
                  <div
                    className={clsx(
                      "sm:w-10 sm:h-10 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                      link.status === "active"
                        ? "bg-blue-dashboard"
                        : "bg-gray-200"
                    )}
                  >
                    <LinkIcon
                      className={clsx(
                        "sm:w-5 sm:h-5 w-4 h-4",
                        link.status === "active"
                          ? "text-bluelight"
                          : "text-grays"
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="sm:text-[1.4em] text-[1.2em] sm:flex-row flex-col flex sm:items-center items-start gap-1 font-medium text-grays truncate">
                      <span className="md:inline hidden">{link.title}</span>
                      <span className="md:inline hidden">|</span>
                      <span>{formatLinkDate(link.dateCreated)}</span>
                    </p>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="sm:text-[1.6em] text-[1.4em] font-semibold text-shortblack hover:underline truncate line-clamp-1 block w-full"
                    >
                      {link.shortUrl}
                    </a>
                  </div>
                </div>
                <div className="flex items-center sm:gap-2 flex-shrink-0">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDropdown(`link-${link.id}`);
                      }}
                      className="p-2 rounded-full text-grays hover:bg-blue-dashboard transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === `link-${link.id}` && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.1 }}
                          className="absolute top-full right-0 mt-1 p-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-100"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLink(link.id);
                            }}
                            className="flex items-center gap-2 w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues"
                          >
                            <Pencil className="w-4 h-4" /> <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDisableConfirmation(link.id, link.status);
                            }}
                            className="flex items-center gap-2 w-full text-left text-[1.5em] px-3 py-2 rounded-md text-shortblack hover:bg-blues"
                          >
                            <EyeOff className="w-4 h-4" />{" "}
                            <span>
                              {link.status === "active" ? "Disable" : "Enable"}
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccordionToggle(link.id);
                    }}
                    className="p-2 rounded-full text-grays hover:bg-blue-dashboard transition-colors"
                  >
                    <ChevronDown
                      className={clsx(
                        "w-5 h-5 transition-transform",
                        expandedLink === link.id && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Detail Collapse */}
              <AnimatePresence>
                {expandedLink === link.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                      {/* Destination */}
                      <div className="sm:hidden flex items-center gap-3">
                        <TypeOutline className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[1.2em] font-medium text-grays">
                            Title
                          </p>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[1.4em] font-medium text-shortblack hover:underline truncate block"
                          >
                            {link.title}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[1.2em] font-medium text-grays">
                            Destination Link
                          </p>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[1.4em] font-medium text-shortblack hover:underline truncate block"
                          >
                            {link.originalUrl}
                          </a>
                        </div>
                      </div>

                      {/* Date Expired */}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Date Expired
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack">
                            {link.dateExpired
                              ? formatLinkDate(link.dateExpired)
                              : "No expiry"}
                          </p>
                        </div>
                      </div>

                      {/* 3. MODIFIKASI BAGIAN PASSWORD: JADI INPUT + TOGGLE */}
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div className="w-full">
                          <p className="text-[1.2em] font-medium text-grays mb-1">
                            Password
                          </p>
                          <div className="relative w-full max-w-[150px]">
                            <input
                              type={
                                visiblePasswords[link.id] ? "text" : "password"
                              }
                              value={link.password || ""}
                              readOnly
                              className="w-full text-[1.4em] font-medium text-shortblack bg-blues border border-gray-200 rounded-md px-3 py-1 pr-10 focus:outline-none"
                              placeholder={
                                link.passwordProtected ? "********" : "No Pass"
                              }
                            />
                            {/* Tombol Mata */}
                            {link.passwordProtected && (
                              <button
                                onClick={() =>
                                  togglePasswordVisibility(link.id)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-grays hover:text-bluelight transition-colors"
                              >
                                {visiblePasswords[link.id] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ads Level */}
                      <div className="flex items-center gap-3">
                        <Megaphone className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Ads Level
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack capitalize">
                            {link.adsLevel}
                          </p>
                        </div>
                      </div>

                      {/* Valid Views */}
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Valid Views
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack">
                            {formatNumber(link.validViews)}
                          </p>
                        </div>
                      </div>

                      {/* Total Earning */}
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Total Earning
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack">
                            {formatCurrency(link.totalEarning)}
                          </p>
                        </div>
                      </div>

                      {/* Total Clicks */}
                      <div className="flex items-center gap-3">
                        <BarChart className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Total Clicks
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack">
                            {formatNumber(link.totalClicks)}
                          </p>
                        </div>
                      </div>

                      {/* Average CPM */}
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-bluelight flex-shrink-0" />
                        <div>
                          <p className="text-[1.2em] font-medium text-grays">
                            Average CPM
                          </p>
                          <p className="text-[1.4em] font-medium text-shortblack">
                            {formatCurrency(link.averageCPM)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-[1.6em] px-4 py-2 rounded-lg border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={clsx(
                "text-[1.6em] px-4 py-2 w-12 h-12 rounded-lg border",
                currentPage === page
                  ? "bg-bluelight text-white border-bluelight"
                  : "bg-white text-shortblack border-gray-200 hover:bg-blues"
              )}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-[1.6em] px-4 py-2 rounded-lg border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* TARUH KOMPONEN MODAL DI BAWAH SINI (Sebelum EditLinkModal) */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmDisable}
        title={
          confirmModal.currentStatus === "active"
            ? "Disable Link?"
            : "Enable Link?"
        }
        description={
          confirmModal.currentStatus === "active"
            ? "Link ini tidak akan bisa diakses oleh pengunjung jika dinonaktifkan. Anda yakin?"
            : "Link akan aktif kembali dan bisa diakses oleh publik."
        }
        confirmLabel={
          confirmModal.currentStatus === "active"
            ? "Yes, Disable"
            : "Yes, Enable"
        }
        type={confirmModal.currentStatus === "active" ? "danger" : "success"}
        isLoading={confirmModal.isLoading}
      />

      {/* Modal Edit */}
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
                alias: selectedLink.shortUrl.split("/").pop() || "",
                password: selectedLink.password,
                expiresAt: selectedLink.dateExpired
                  ? new Date(
                      new Date(selectedLink.dateExpired).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  : "",
                adsLevel: selectedLink.adsLevel,
              }
            : null
        }
        isUpdating={isUpdating}
        shortUrlDisplay={selectedLink?.shortUrl}
        originalUrlDisplay={selectedLink?.originalUrl}
      />
    </div>
  );
}
