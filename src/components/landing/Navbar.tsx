"use client";

import { usePathname, useRouter, Link } from "@/i18n/routing"; // PENTING: Pakai Link dari sini, bukan next/link
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

export default function Navbar() {
  const t = useTranslations("Navbar"); // Hook untuk mengambil teks dari en.json/id.json
  const locale = useLocale(); // 'en' atau 'id'
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  // --- FITUR GANTI BAHASA ---
  const switchLanguage = (nextLocale: "en" | "id") => {
    startTransition(() => {
      // router.replace akan mengganti URL saat ini dengan locale baru
      // misal: /en/about -> /id/about
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <>
      <nav className="text-[10px] fixed lg:relative w-full lg:bg-transparent font-figtree bg-white/95 lg:backdrop-blur-none backdrop-blur-md lg:shadow-none shadow-sm">
        <div className="max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto py-[1.6em] lg:py-[3em] flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-[2em]">
            <div className="w-[3em] h-[3em] rounded-full bg-bluelight"></div>
            <Link
              href="/"
              className="text-[2em] text-bluelight font-semibold tracking-tight"
            >
              Shortlinkmu
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="lg:flex hidden gap-[5em] items-center">
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

          {/* Desktop Right Side (Lang Switcher + Auth) */}
          <div className="items-center gap-[4em] hidden lg:flex">
            {/* === LANGUAGE SWITCHER BUTTON (DESKTOP) === */}
            <div className="flex items-center bg-blues rounded-full p-[0.5em] border border-bluelight/10">
              <button
                onClick={() => switchLanguage("en")}
                disabled={isPending}
                className={`px-[1.2em] py-[0.5em] rounded-full text-[1.4em] font-semibold transition-all ${
                  locale === "en"
                    ? "bg-bluelight text-white shadow-md"
                    : "text-grays hover:text-bluelight"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage("id")}
                disabled={isPending}
                className={`px-[1.2em] py-[0.5em] rounded-full text-[1.4em] font-semibold transition-all ${
                  locale === "id"
                    ? "bg-bluelight text-white shadow-md"
                    : "text-grays hover:text-bluelight"
                }`}
              >
                ID
              </button>
            </div>

            <Link
              href="/login"
              className={`text-[1.6em] font-semibold tracking-tight ${
                pathname != "/" ? "text-bluelight" : "text-white"
              }`}
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className={`text-[1.6em] font-semibold tracking-tight ${
                pathname != "/"
                  ? "bg-bluelight text-white"
                  : "bg-white text-bluelight"
              } px-[1.5em] py-[.5em] rounded-full`}
            >
              {t("register")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden static">
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

        {/* Mobile Menu Dropdown */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-[2em] max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto bg-white/95 backdrop-blur-md lg:hidden flex flex-col items-start gap-[1.5em] border-t border-gray-100">
            {/* === LANGUAGE SWITCHER (MOBILE) === */}
            <div className="w-full px-[2em] py-[1em] flex justify-center gap-[1em]">
              <button
                onClick={() => switchLanguage("en")}
                className={`w-1/2 py-[0.8em] rounded-full text-[1.6em] font-semibold transition-all border ${
                  locale === "en"
                    ? "bg-bluelight text-white border-bluelight"
                    : "bg-white text-grays border-gray-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => switchLanguage("id")}
                className={`w-1/2 py-[0.8em] rounded-full text-[1.6em] font-semibold transition-all border ${
                  locale === "id"
                    ? "bg-bluelight text-white border-bluelight"
                    : "bg-white text-grays border-gray-200"
                }`}
              >
                Indonesia
              </button>
            </div>

            <Link
              href="/payout-rates"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blue-50 text-bluelight py-[.8em] rounded-full hover:bg-blues"
            >
              {t("payoutRates")}
            </Link>
            <Link
              href="/about"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full hover:bg-blues"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full hover:bg-blues"
            >
              {t("contact")}
            </Link>
            <div className="w-full border-t border-gray-200 my-[1em]"></div>
            <div className="flex items-center gap-[3em] justify-stretch w-full">
              <button className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-gray-50 text-shortblack py-[.8em] rounded-full">
                {t("login")}
              </button>
              <button className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blues text-bluelight py-[.8em] rounded-full">
                {t("register")}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
