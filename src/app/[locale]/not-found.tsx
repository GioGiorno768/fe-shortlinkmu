"use client"; // Kita butuh client component buat useTranslations

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Link } from "@/i18n/routing"; // Pake Link dari i18n
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Kita pake Navbar & Footer landing page biar konsisten */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      <section className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto text-center flex flex-col items-center">
        <h1 className="font-bold text-bluelight text-6xl tracking-tight mb-[0.5em]">
          404
        </h1>
        <h2 className="font-semibold text-shortblack text-3xl mb-[1em]">
          {t("title")}
        </h2>
        <p className="text-[2em] font-medium text-grays mb-[2em] max-w-lg">
          {t("subtitle")}
        </p>
        <Link
          href="/"
          className="inline-block bg-bluelight text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-opacity-90 transition-all"
        >
          {t("goHome")}
        </Link>
      </section>

      <Footer />
    </main>
  );
}
