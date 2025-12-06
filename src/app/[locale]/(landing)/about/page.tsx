"use client"; // Kita butuh "use client" untuk framer-motion

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";
import { motion } from "motion/react";
import { Eye, Link as LinkIcon, Target, Users } from "lucide-react";

export default function AboutPage() {
  // Data placeholder untuk tim
  const team = [
    { id: 1, name: "Kevin Ragil K.D", role: "Co-Founder & CEO" },
    { id: 2, name: "Musthofa Ilmi", role: "Co-Founder & CTO" },
    { id: 3, name: "Septian Dwi P", role: "Co-Founder & CMO" },
  ];

  // Varian animasi untuk stagger (efek muncul satu per satu)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Jeda antar item
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten About Us */}
      <section
        id="about"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[10em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="About Us"
            h1Text="Tentang Shortlinkmu"
            pText="Pelajari lebih lanjut tentang siapa kami, apa yang kami lakukan, dan mengapa kami bersemangat tentang link."
            h1ClassName="text-center justify-center items-center"
            pClassName="sm:w-[35em] w-full"
          />

          {/* Section 1: Cerita Kami (Interaktif) */}
          <div className="flex flex-col lg:flex-row items-center gap-[5em] lg:gap-[10em]">
            {/* Kiri: Teks (Animasi slide-in) */}
            <motion.div
              className="w-full lg:w-1/2 space-y-[2em]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="text-shortblack font-semibold text-[3em]">
                Cerita Kami
              </h2>
              <p className="text-grays text-[1.8em] leading-relaxed">
                Shortlinkmu dimulai dari ide sederhana: membuat proses berbagi
                link menjadi lebih mudah, aman, dan menguntungkan. Kami melihat
                banyak kreator, marketer, dan pengguna sehari-hari berjuang
                dengan URL yang panjang dan tidak menarik.
              </p>
              <p className="text-grays text-[1.8em] leading-relaxed">
                Kami membangun platform ini untuk mengubah URL tersebut menjadi
                alat yang ampuh untuk branding, analitik, dan monetisasi. Misi
                kami adalah memberdayakan setiap orang untuk mendapatkan hasil
                maksimal dari setiap link yang mereka bagikan.
              </p>
            </motion.div>

            {/* Kanan: Grafik Interaktif (Animasi scale-in + pulse) */}
            <motion.div
              className="w-full lg:w-1/2 h-[30em] sm:h-[40em] bg-blues rounded-3xl p-[2em] flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              {/* Grafik animasi simpel */}
              <motion.div
                className="w-[10em] h-[10em] bg-bluelight rounded-full flex items-center justify-center text-white"
                animate={{ scale: [1, 1.1, 1] }} // Efek pulse
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <LinkIcon className="w-[5em] h-[5em]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Section 2: Misi & Visi (Clean Cards - Animasi slide-up) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[5em]">
            {/* Misi Card */}
            <motion.div
              className="bg-white p-[3em] sm:p-[4em] rounded-2xl shadow-lg border border-gray-100 text-center items-center flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-[8em] h-[8em] bg-blue-100 rounded-full flex items-center justify-center mb-[2em] flex-shrink-0">
                <Target className="w-[4em] h-[4em] text-bluelight" />
              </div>
              <h2 className="text-shortblack font-semibold text-[2.4em] mb-[1em]">
                Misi Kami
              </h2>
              <p className="text-grays text-[1.8em]">
                Menyediakan layanan shortlink yang paling aman, andal, dan
                menguntungkan bagi kreator di seluruh dunia.
              </p>
            </motion.div>

            {/* Visi Card */}
            <motion.div
              className="bg-white p-[3em] sm:p-[4em] rounded-2xl shadow-lg border border-gray-100 text-center items-center flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              {/* Ganti warna icon biar beda */}
              <div className="w-[8em] h-[8em] bg-purplelink/10 rounded-full flex items-center justify-center mb-[2em] flex-shrink-0">
                <Eye className="w-[4em] h-[4em] text-purplelink" />
              </div>
              <h2 className="text-shortblack font-semibold text-[2.4em] mb-[1em]">
                Visi Kami
              </h2>
              <p className="text-grays text-[1.8em]">
                Menjadi platform pilihan utama untuk manajemen link, di mana
                setiap link memiliki nilai lebih dari sekadar klik.
              </p>
            </motion.div>
          </div>

          {/* Section 3: Tim (Interaktif Stagger) */}
          <div className="space-y-[5em] py-[4em]">
            <TitleSection
              parentClassName="text-center justify-center items-center"
              sectionText="Team"
              h1Text="Team Kami"
              pText="Orang-orang hebat di balik layar yang membuat semua ini terjadi."
              h1ClassName="text-center justify-center items-center"
              pClassName="sm:w-[35em] w-full"
            />

            {/* Grid dengan animasi stagger */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4em]"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} // Muncul saat 30% bagian terlihat
            >
              {team.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-blues p-[3em] rounded-3xl text-center" // Pake bg-blues biar clean
                  variants={itemVariants}
                >
                  <div className="w-[10em] h-[10em] bg-bluelight/20 rounded-full mx-auto mb-[2em] flex items-center justify-center">
                    <Users className="w-[5em] h-[5em] text-bluelight" />
                  </div>
                  <h3 className="text-shortblack font-semibold text-[2.2em]">
                    {member.name}
                  </h3>
                  <p className="text-bluelight text-[1.6em] font-medium">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

