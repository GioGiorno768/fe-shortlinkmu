"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // [UBAH] Pake next/navigation
import { useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl"; // [TAMBAH]
import { Globe } from "lucide-react"; // [TAMBAH] Pake Lucide

// [TAMBAH] Komponen Link Khusus
function LocaleLink({
  href,
  locale,
  children,
  ...props
}: {
  href: string;
  locale: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // Fungsi ini ganti locale tanpa reload full
  const onClick = () => {
    startTransition(() => {
      // Ganti URL dengan locale baru
      window.location.href = `/${locale}${pathname}`;
    });
  };

  return (
    <button onClick={onClick} disabled={isPending} {...props}>
      {children}
    </button>
  );
}

export default function Navbar() {
  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); // [TAMBAH] State dropdown bahasa
  const path = usePathname();
  const t = useTranslations("Navbar"); // [TAMBAH] Hook translator
  const locale = useLocale(); // [TAMBAH] Hook dapetin locale (en/id)

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  return (
    <>
      <nav className="text-[10px] fixed lg:relative w-full lg:bg-transparent font-figtree bg-white/95 lg:backdrop-blur-none backdrop-blur-md lg:shadow-none shadow-sm">
        <div className="max-w-[140em] px-[1.6em] lg:px-[2.4em]  m-auto py-[1.6em] lg:py-[3em] flex justify-between items-center">
          <div className="flex items-center gap-[2em]">
            <div className="w-[3em] h-[3em] rounded-full bg-bluelight"></div>
            <Link
              href="/"
              className="text-[2em] text-bluelight font-semibold tracking-tight"
            >
              Shortlinkmu
            </Link>
          </div>
          <div className="lg:flex hidden gap-[5em] items-center">
            {/* [UBAH] Pake t('...') */}
            <Link
              href="/payout-rates"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("payoutRates")}
            </Link>
            <Link
              href="/about"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("contact")}
            </Link>
          </div>
          <div className="items-center gap-[4em] hidden lg:flex">
            {/* [UBAH] Tombol Bahasa Jadi Interaktif */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-[1em] "
              >
                <Globe // [UBAH] Pake Lucide
                  className={`w-[2.5em] h-[2.5em] ${
                    path === "/" ? "text-white" : "text-bluelight"
                  }`}
                />
                <span
                  className={`text-[1.6em] font-semibold tracking-tight ${
                    path === "/" ? "text-white" : "text-bluelight"
                  }`}
                >
                  {locale.toUpperCase()} {/* Tampilkan locale aktif */}
                </span>
              </button>

              {/* [TAMBAH] Dropdown Bahasa */}
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-[1em] w-[15em] bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                  <LocaleLink
                    href={path}
                    locale="id"
                    className="w-full text-left px-[1.5em] py-[1em] text-[1.6em] text-shortblack hover:bg-blues transition-colors"
                  >
                    {t("indonesian")} (ID)
                  </LocaleLink>
                  <LocaleLink
                    href={path}
                    locale="en"
                    className="w-full text-left px-[1.5em] py-[1em] text-[1.6em] text-shortblack hover:bg-blues transition-colors"
                  >
                    {t("english")} (EN)
                  </LocaleLink>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className={`text-[1.6em] font-semibold tracking-tight ${
                path !== "/" ? "text-bluelight" : "text-white"
              }`}
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className={`text-[1.6em] font-semibold tracking-tight ${
                path !== "/"
                  ? "bg-bluelight text-white"
                  : "bg-white text-bluelight"
              } px-[1.5em] py-[.5em] rounded-full`}
            >
              {t("register")}
            </Link>
          </div>
          <div className="lg:hidden static">
            {/* ... (kode hamburger menu mobile, gak berubah) ... */}
            <label className="flex flex-col gap-[0.4em] w-[3.5em] h-[3.5em] justify-center items-center cursor-pointer border-[0.15em] border-bluelight rounded-[0.8em] hover:bg-bluelight/5 transition-all duration-200">
              <input
                className="peer hidden"
                type="checkbox"
                ref={openMenu}
                onChange={handleOpenMenu}
              />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:rotate-45 peer-checked:translate-y-[0.6em]" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:opacity-0 peer-checked:scale-0" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:-rotate-45 peer-checked:-translate-y-[0.6em]" />
            </label>
          </div>
        </div>

        {/* [UBAH] Menu Mobile juga pake t('...') */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-[2em] max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto bg-white/95 backdrop-blur-md lg:hidden flex flex-col items-start gap-[1.5em] border-t border-gray-100">
            <Link
              href="/payout-rates"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blue-50 text-bluelight py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
            >
              {t("payoutRates")}
            </Link>
            <Link
              href="/about"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
            >
              {t("contact")}
            </Link>
            {/* ... (sisanya sama) ... */}
          </div>
        </div>
      </nav>
    </>
  );
}
