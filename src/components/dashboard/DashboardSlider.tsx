"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Megaphone, Wallet, ArrowRight, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import clsx from "clsx";

// --- DATA SLIDE (Bisa dari API nanti) ---
const SLIDES = [
  {
    id: "welcome",
    title: "Selamat Datang, Kevin! 👋",
    desc: "Semoga harimu menyenangkan. Yuk cek performa link kamu dan tingkatkan trafik hari ini!",
    cta: "Buat Link Baru",
    link: "/new-link",
    icon: Sparkles,
    theme: "blue", // Custom theme key
  },
  {
    id: "event",
    title: "Bonus CPM Weekend! 🚀",
    desc: "Dapatkan kenaikan CPM +15% untuk semua traffic dari Indonesia khusus Sabtu & Minggu ini.",
    cta: "Lihat Info",
    link: "/ads-info",
    icon: Megaphone,
    theme: "purple",
  },
  {
    id: "feature",
    title: "Withdraw via Crypto 💎",
    desc: "Kabar gembira! Sekarang kamu bisa menarik saldo ke wallet USDT (TRC20) dengan fee rendah.",
    cta: "Atur Payment",
    link: "/settings?tab=payment",
    icon: Wallet,
    theme: "orange",
  },
];

// Helper Styles
const getTheme = (theme: string) => {
  switch (theme) {
    case "purple":
      return {
        bg: "bg-gradient-to-br from-[#6b21a8] to-[#a855f7]",
        text: "text-white",
        button: "bg-white text-purple-700 hover:bg-purple-50",
        icon: "text-purple-200",
      };
    case "orange":
      return {
        bg: "bg-gradient-to-br from-[#c2410c] to-[#fb923c]",
        text: "text-white",
        button: "bg-white text-orange-700 hover:bg-orange-50",
        icon: "text-orange-200",
      };
    default: // blue
      return {
        bg: "bg-gradient-to-br from-bluelight to-blue-600",
        text: "text-white",
        button: "bg-white text-bluelight hover:bg-blue-50",
        icon: "text-blue-300",
      };
  }
};

export default function DashboardSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = kanan, -1 = kiri

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // Ganti slide tiap 6 detik
    return () => clearInterval(timer);
  }, [index]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  // Variasi Animasi
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const currentSlide = SLIDES[index];
  const theme = getTheme(currentSlide.theme);
  const Icon = currentSlide.icon;

  return (
    <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden shadow-lg group">
      {/* Container Slide */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className={clsx(
            "absolute inset-0 w-full h-full p-8 flex flex-col justify-center rounded-3xl",
            theme.bg,
            theme.text
          )}
        >
          {/* Background Decorations */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-10 bottom-[-40px] w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[1.2em] font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Info Terbaru
                </span>
              </div>

              <h2 className="text-[2.4em] font-bold leading-tight tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-[1.5em] opacity-90 max-w-lg leading-snug">
                {currentSlide.desc}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={currentSlide.link}
                  className={clsx(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[1.4em] transition-transform active:scale-95 shadow-md",
                    theme.button
                  )}
                >
                  {currentSlide.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Illustration (Opsional, hidden di mobile) */}
            <div className="hidden sm:block w-1/3 flex-shrink-0 text-right opacity-20">
              <Icon className="w-32 h-32 ml-auto" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={clsx(
              "w-3 h-3 rounded-full transition-all duration-300",
              i === index
                ? "bg-white w-8" // Active dot lebih panjang
                : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
