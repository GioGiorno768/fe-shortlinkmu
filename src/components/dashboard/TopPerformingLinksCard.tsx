// src/components/dashboard/TopPerformingLinksCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Link as LinkIcon,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Edit,
  EyeOff, // Ganti "Hide" pake icon
  Loader2,
  Lock,
  Calendar,
  X, // Icon buat nutup modal
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/routing"; // Pastiin pake Link dari i18n
import type { TopLinkItem, EditableLinkData } from "@/types/type"; // Impor tipe data

// ========================================================
// === DESAIN API (MOCK/DUMMY) ===
// ========================================================
// Nanti lu ganti fungsi ini pake API call beneran
async function fetchTopPerformingLinks(
  sortBy: "latest" | "longest"
): Promise<TopLinkItem[]> {
  console.log(`MANGGIL API: /api/links/top-performing?sort=${sortBy}`);
  /* // --- CONTOH API CALL BENERAN ---
  // const token = localStorage.getItem("authToken");
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/links/top-performing?sort=${sortBy}`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${token}`
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error("Gagal memuat data link");
  // }
  // const data: TopLinkItem[] = await response.json();
  // return data;
  */

  // --- DATA DUMMY (HAPUS NANTI) ---
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi loading
  const mockLinks: TopLinkItem[] = [
    {
      id: "1",
      shortUrl: "short.link/asu12",
      originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      totalViews: 5100,
      totalEarnings: 22.95,
      cpm: 4.5,
      alias: "asu12",
    },
    {
      id: "2",
      shortUrl: "short.link/mULy0n0",
      originalUrl: "https://www.google.com",
      totalViews: 4200,
      totalEarnings: 18.9,
      cpm: 4.5,
    },
    {
      id: "3",
      shortUrl: "short.link/w1W0k12",
      originalUrl: "https://www.github.com",
      totalViews: 3500,
      totalEarnings: 15.75,
      cpm: 4.5,
    },
    {
      id: "4",
      shortUrl: "short.link/gatot",
      originalUrl: "https://www.vercel.com",
      totalViews: 2800,
      totalEarnings: 12.6,
      cpm: 4.5,
      password: "123",
      expiresAt: "2025-12-31",
    },
    {
      id: "5",
      shortUrl: "short.link/kaca",
      originalUrl: "https://www.figma.com",
      totalViews: 1500,
      totalEarnings: 6.75,
      cpm: 4.5,
    },
  ];

  if (sortBy === "longest") {
    return mockLinks.reverse(); // Balik urutannya kalo "longest"
  }
  return mockLinks;
  // --- AKHIR DATA DUMMY ---
}
// ========================================================

export default function TopPerformingLinksCard() {
  const t = useTranslations("Dashboard");

  // State utama
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<TopLinkItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State UI
  const [sortBy, setSortBy] = useState<"latest" | "longest">("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>("1"); // Default buka yg pertama
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<TopLinkItem | null>(null);
  const [formData, setFormData] = useState<EditableLinkData>({ alias: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Refs buat klik di luar (dropdown)
  const sortRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Efek: Fetch data pas komponen load atau sortBy berubah
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

  // Efek: Nutup dropdown & modal pas klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Nutup dropdown sort
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      // Nutup dropdown action (kebab menu)
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenuId(null);
      }
      // Nutup modal
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        // Cek kalo yg diklik itu backdrop
        if ((event.target as HTMLElement).id === "modal-backdrop") {
          closeModal();
        }
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
    setOpenActionMenuId(null); // Tutup action menu kalo accordion diklik
  };

  const handleActionMenuToggle = (id: string) => {
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  // Helper buat ngedapetin format YYYY-MM-DDThh:mm (waktu LOKAL)
  const getMinDateTimeLocal = () => {
    const localDate = new Date();
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    return localDate.toISOString().slice(0, 16);
  };

  // --- Modal Handlers ---
  const openModal = (link: TopLinkItem) => {
    setSelectedLink(link);
    // --- UBAH BLOK INI ---
    // Helper buat format tanggal dari API ke input datetime-local
    let expiryValue = "";
    if (link.expiresAt) {
      // 1. Buat Date object (ini otomatis pake timezone LOKAL user)
      const localDate = new Date(link.expiresAt);
      // 2. Offset manual biar bener
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      // 3. Format ke "YYYY-MM-DDThh:mm"
      expiryValue = localDate.toISOString().slice(0, 16);
    }

    setFormData({
      alias: link.alias || link.shortUrl.split("/").pop() || "",
      password: link.password || "",
      expiresAt: expiryValue, // <-- Pake value yang udah diformat
    });
    // --- AKHIR PERUBAHAN ---
    setIsModalOpen(true);
    setOpenActionMenuId(null); // Tutup menu kebab
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdating(false);
    // Kasih jeda dikit biar animasi exit modalnya alus
    setTimeout(() => {
      setSelectedLink(null);
    }, 300);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLink) return;

    setIsUpdating(true);
    console.log(`API CALL: Update link ${selectedLink.id}`, formData);

    /* // --- CONTOH API UPDATE BENERAN ---
    // try {
    //   const response = await fetch(`/api/links/${selectedLink.id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!response.ok) throw new Error("Gagal update link");
    //   
    //   // Update data di state links (biar UI-nya update)
    //   setLinks(links.map(l => l.id === selectedLink.id ? {...l, ...formData} : l));
    //   closeModal();
    // } catch (err) {
    //   console.error(err);
    //   alert("Gagal menyimpan perubahan");
    // } finally {
    //   setIsUpdating(false);
    // }
    */

    // --- SIMULASI UPDATE ---
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLinks(
      links.map((l) =>
        l.id === selectedLink.id
          ? {
              ...l,
              ...formData,
              shortUrl: `short.link/${formData.alias}`, // Update shortUrl juga
            }
          : l
      )
    );
    setIsUpdating(false);
    closeModal();
    // --- AKHIR SIMULASI ---
  };

  const handleHideLink = async (id: string) => {
    console.log(`API CALL: Hide link ${id}`);
    setOpenActionMenuId(null); // Tutup menu
    // Logika API buat hide link...
    // Setelah sukses, mungkin lu mau filter link-nya dari state:
    // setLinks(links.filter(l => l.id !== id));
    alert(`Link ${id} disembunyikan (simulasi)`);
  };

  return (
    <>
      {/* ======================= */}
      {/* === CARD UTAMA === */}
      {/* ======================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        {/* Header (Title + Dropdown Sort) */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight">
            {t("topPerformingLinks")}
          </h3>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={` flex items-center gap-2 text-[1.4em] font-medium text-grays hover:text-bluelight transition-colors`}
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

        {/* Konten (List Link) */}
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
              onWheel={(e) => {
                // Stop scroll dari bocor ke parent (halaman)
                e.stopPropagation();
              }}
              className="h-[300px] overflow-y-auto pr-2 space-y-2 overscroll-contain custom-scrollbar-minimal"
            >
              {" "}
              {/* pr-2 buat ngasih jarak ke scrollbar */}
              {links.map((link) => (
                <div
                  key={link.id}
                  className={`rounded-xl transition-colors ${
                    openAccordionId === link.id ? "bg-blues" : "bg-white"
                  }`}
                >
                  {/* === Link Item (Accordion Trigger) === */}
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
                      {/* === Kebab Menu (Action) === */}
                      <div className="relative" ref={actionMenuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Biar accordion gak ikutan nutup
                            handleActionMenuToggle(link.id);
                          }}
                          className={`p-1 rounded-full hover:text-bluelight text-grays ${
                            openActionMenuId === link.id
                              ? "text-bluelight bg-blue-dashboard"
                              : ""
                          }`}
                        >
                          <MoreHorizontal className="w-5 h-5 " />
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

                      {/* === Chevron Accordion === */}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform rounded-full ${
                          openAccordionId === link.id
                            ? "rotate-180 text-bluelight bg-blue-dashboard"
                            : "text-grays"
                        }`}
                      />
                    </div>
                  </div>

                  {/* === Accordion Content === */}
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
                            {/* Info Detail */}
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
                            {/* Tombol Detail */}
                            <Link
                              href={`/analytics/${link.id}`} // Asumsi rute detail
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

      {/* ======================= */}
      {/* === MODAL EDIT === */}
      {/* ======================= */}
      <AnimatePresence>
        {isModalOpen && selectedLink && (
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 rounded-full text-grays hover:bg-blues"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleModalSubmit}>
                {/* Header Modal */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-dashboard rounded-lg flex items-center justify-center">
                    <Edit className="w-5 h-5 text-bluelight" />
                  </div>
                  <div>
                    <h3 className="text-[1.8em] font-semibold text-shortblack">
                      {selectedLink.shortUrl}
                    </h3>
                    <p className="text-[1.4em] text-grays line-clamp-1 w-[95%]">
                      {selectedLink.originalUrl}
                    </p>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  {/* Alias */}
                  <div>
                    <label
                      htmlFor="alias"
                      className="block text-[1.4em] font-medium text-shortblack mb-1"
                    >
                      Set alias url here
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="alias"
                        name="alias"
                        value={formData.alias}
                        onChange={handleFormChange}
                        className="w-full text-[1.6em] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bluelight"
                        placeholder="cth: link-keren-saya"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[1.4em] font-medium text-shortblack mb-1"
                    >
                      Enter password here
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        className="w-full text-[1.6em] px-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bluelight"
                        placeholder="(Opsional)"
                      />
                    </div>
                  </div>

                  {/* === UBAH BLOK INI === */}
                  {/* Expired Date */}
                  <div>
                    <label
                      htmlFor="expiresAt"
                      className="block text-[1.4em] font-medium text-shortblack mb-1"
                    >
                      {/* Kita pake terjemahan dari CreateShortlink */}
                      {t("setExpiry")}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="datetime-local" // <-- 1. GANTI TYPE
                        id="expiresAt"
                        name="expiresAt"
                        value={formData.expiresAt}
                        onChange={handleFormChange}
                        className="w-full text-[1.6em] px-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bluelight"
                        min={getMinDateTimeLocal()} // <-- 2. GANTI MIN
                      />
                    </div>
                  </div>
                  {/* === AKHIR PERUBAHAN === */}
                </div>

                {/* Tombol Submit Modal */}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-bluelight text-white text-[1.6em] font-semibold py-3 rounded-xl mt-6 disabled:opacity-50 flex items-center justify-center"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
