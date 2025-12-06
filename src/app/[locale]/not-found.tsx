"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import { motion } from "motion/react"; // Hapus import Variants kalau gak dipake eksplisit
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const router = useRouter();

  useEffect(() => {
    document.title = `404 - ${t("title")} | Shortlinkmu`;
  }, [t]);

  // --- Animation Variants ---
  // Hapus ": Variants" biar TS gak pusing, dia pinter kok inferensinya
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const, // <--- MAGIC FIX-NYA DISINI BROK
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Animasi ngambang buat ikon
  const floatAnimation = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const, // Tambahin as const juga biar aman
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden font-figtree text-[10px]">
      {/* --- Background Dekorasi (Blob Animasi) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[15%] w-[40em] h-[40em] bg-blue-50 rounded-full blur-3xl opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[15%] w-[50em] h-[50em] bg-purple-50 rounded-full blur-3xl opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.5, 0.4],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* --- Main Content --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-[60em] mx-auto"
      >
        {/* Icon 404 */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-10"
        >
          <motion.div
            {...floatAnimation}
            className="w-[12em] h-[12em] bg-white rounded-[3em] flex items-center justify-center shadow-xl shadow-blue-100 border border-blue-50"
          >
            <FileQuestion
              className="w-[6em] h-[6em] text-bluelight opacity-90"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        {/* Text 404 Besar */}
        <motion.h1
          variants={itemVariants}
          className="text-[14em] font-extrabold text-bluelight leading-none tracking-tighter mb-2 drop-shadow-sm"
        >
          404
        </motion.h1>

        {/* Judul & Subjudul */}
        <motion.h2
          variants={itemVariants}
          className="text-[3.2em] font-bold text-shortblack mb-4"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-[1.8em] text-grays mb-12 max-w-[40ch] mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* Tombol Aksi */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Tombol Back */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-gray-100 text-shortblack font-semibold text-[1.6em] hover:border-bluelight/30 hover:bg-blue-50 transition-all duration-300 min-w-[160px] justify-center"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-grays group-hover:text-bluelight" />
            <span className="group-hover:text-bluelight transition-colors">
              Back
            </span>
          </button>

          {/* Tombol Home */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-bluelight text-white font-semibold text-[1.6em] hover:bg-opacity-90 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1 min-w-[160px] justify-center"
          >
            <Home className="w-5 h-5" />
            <span>{t("goHome") || "Home"}</span>
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}

