"use client"; // Perlu untuk framer-motion dan event handler

import { motion } from "framer-motion";
import { ArrowLeft, Link as LinkIcon, Lock, Mail } from "lucide-react";
// --- UBAH INI ---
import { Link } from "@/i18n/routing";
// --- DARI INI ---
// import Link from "next/link";

export default function RegisterPage() {
  // Varian animasi untuk form
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Efek muncul satu per satu
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="text-[10px] max-w-[155em] m-auto min-h-screen grid grid-cols-1 lg:grid-cols-2 font-figtree overflow-hidden">
      {/* ================================== */}
      {/* Bagian Kiri (Elegan & Interaktif) */}
      {/* ================================== */}
      <motion.div
        className="hidden lg:flex flex-col justify-between p-[4em] bg-bluelight text-white relative overflow-hidden"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="flex items-center gap-[1em] text-[1.6em] font-medium opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Home
        </Link>

        {/* Branding */}
        <div className="space-y-[2em] z-10">
          <div className="w-[6em] h-[6em] bg-white rounded-full flex items-center justify-center">
            <div className="w-[3em] h-[3em] bg-bluelight rounded-full"></div>
          </div>
          <h1 className="text-white text-[4em] font-bold leading-tight">
            Mulai Perjalanan
            <br />
            Anda di Sini.
          </h1>
          <p className="text-bluefooter text-[1.8em] w-[70%]">
            Daftar gratis untuk mulai mengubah link panjang menjadi link pendek
            yang menguntungkan.
          </p>
        </div>

        {/* Dekorasi Interaktif (Animasi) */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[15%] w-20 h-20 bg-white/10 rounded-2xl z-0"
        >
          <LinkIcon className="w-full h-full p-5" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[10%] w-24 h-24 bg-white/10 rounded-full z-0"
        >
          <Mail className="w-full h-full p-6" />
        </motion.div>

        <div className="text-bluefooter text-[1.4em]">
          © {new Date().getFullYear()} Shortlinkmu. All Rights Reserved.
        </div>
      </motion.div>

      {/* ================================== */}
      {/* Bagian Kanan (Clean Form)        */}
      {/* ================================== */}
      <motion.div
        className="bg-white p-[4em] flex flex-col items-center justify-center"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="w-full max-w-[45em]">
          {/* Tombol kembali untuk Mobile */}
          <Link
            href="/"
            className="flex lg:hidden items-center gap-[1em] text-[1.6em] font-medium text-grays hover:text-shortblack transition-colors mb-[4em]"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Home
          </Link>

          {/* Form dengan Animasi Stagger */}
          <motion.form
            className="space-y-[3em]"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Judul */}
            <motion.div variants={itemVariants} className="space-y-[1em]">
              <h1 className="text-shortblack text-[4em] font-bold">
                Buat Akun Baru
              </h1>
              <p className="text-grays text-[1.8em]">
                Gratis selamanya. Ayo bergabung!
              </p>
            </motion.div>

            {/* Input Email */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="text-shortblack font-medium text-[1.6em] mb-[.8em] block"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-grays absolute left-[1.5em] top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  // Desain input clean
                  className="py-[1.5em] px-[4.5em] block w-full text-[1.6em] border border-transparent bg-blues rounded-3xl focus:outline-none focus:ring-2 focus:ring-bluelight/50 focus:border-bluelight transition-all duration-300"
                  placeholder="email@anda.com"
                  required
                />
              </div>
            </motion.div>

            {/* Input Password */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="text-shortblack font-medium text-[1.6em] mb-[.8em] block"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-grays absolute left-[1.5em] top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="py-[1.5em] px-[4.5em] block w-full text-[1.6em] border border-transparent bg-blues rounded-3xl focus:outline-none focus:ring-2 focus:ring-bluelight/50 focus:border-bluelight transition-all duration-300"
                  placeholder="Buat password yang kuat"
                  required
                />
              </div>
            </motion.div>

            {/* Input Konfirmasi Password */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="confirm-password"
                className="text-shortblack font-medium text-[1.6em] mb-[.8em] block"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-grays absolute left-[1.5em] top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  className="py-[1.5em] px-[4.5em] block w-full text-[1.6em] border border-transparent bg-blues rounded-3xl focus:outline-none focus:ring-2 focus:ring-bluelight/50 focus:border-bluelight transition-all duration-300"
                  placeholder="Ulangi password Anda"
                  required
                />
              </div>
            </motion.div>

            {/* Tombol Submit */}
            <motion.button
              type="submit"
              variants={itemVariants}
              className="text-[1.8em] w-full bg-bluelight text-white px-[2em] py-[1.5em] rounded-full cursor-pointer font-semibold hover:bg-opacity-90 transition-all duration-300"
              whileTap={{ scale: 0.98 }} // Efek klik interaktif
            >
              Daftar
            </motion.button>

            {/* Link ke Login */}
            <motion.p
              variants={itemVariants}
              className="text-center text-[1.6em] text-grays"
            >
              Sudah punya akun?{" "}
              <Link
                href="/login" // Link ke halaman login
                className="font-semibold text-bluelight hover:underline"
              >
                Login di sini
              </Link>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>
    </main>
  );
}
