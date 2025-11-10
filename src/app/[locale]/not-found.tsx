// src/app/[locale]/not-found.tsx
"use client";

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

/**
 * Locale-aware 404 page
 * Supports both /en/not-found and /id/not-found
 */
export default function NotFound() {
  const t = useTranslations("NotFound");

  // Set document title untuk SEO
  useEffect(() => {
    document.title = `404 - ${t("title")} | Shortlinkmu`;
  }, [t]);

  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* 404 Content */}
      <section className="flex-1 max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto text-center flex flex-col items-center justify-center">
        {/* Big 404 Number */}
        <h1 className="font-bold text-bluelight text-[12em] sm:text-[15em] tracking-tight mb-[0.3em] leading-none">
          404
        </h1>

        {/* Title */}
        <h2 className="font-semibold text-shortblack text-[3em] sm:text-[4em] mb-[0.5em]">
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p className="text-[1.8em] sm:text-[2em] font-medium text-grays mb-[2em] max-w-[35em] px-[2em]">
          {t("subtitle")}
        </p>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-block bg-bluelight text-white px-[3em] py-[1.5em] rounded-full font-semibold text-[1.8em] hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg"
        >
          {t("goHome")}
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
