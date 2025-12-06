"use client"; // Butuh "use client" untuk search bar (useState) dan animasi (framer-motion)

import { useState } from "react";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";
import { motion } from "motion/react";
import { Banknote, DollarSign, Globe, Search, Wallet } from "lucide-react";
import Image from "next/image"; // Impor 'Image' dari 'next/image'

// --- DATA CONTOH (Nanti ganti ini dengan data asli lu) ---
// Ditambahin 'isoCode' buat narik gambar bendera
const payoutRates = [
  { country: "United States", cpm: 22.0, isoCode: "us" },
  { country: "United Kingdom", cpm: 18.5, isoCode: "gb" },
  { country: "Canada", cpm: 17.0, isoCode: "ca" },
  { country: "Australia", cpm: 16.0, isoCode: "au" },
  { country: "Germany", cpm: 12.0, isoCode: "de" },
  { country: "France", cpm: 11.5, isoCode: "fr" },
  { country: "Sweden", cpm: 10.0, isoCode: "se" },
  { country: "Norway", cpm: 9.5, isoCode: "no" },
  { country: "Indonesia", cpm: 8.0, isoCode: "id" },
  { country: "Malaysia", cpm: 7.5, isoCode: "my" },
  { country: "Brazil", cpm: 5.0, isoCode: "br" },
  { country: "India", cpm: 4.5, isoCode: "in" },
  { country: "Negara Lain", cpm: 3.0, isoCode: "all" }, // 'all' buat case khusus
];
// --------------------------------------------------------

const paymentMethods = [
  { name: "PayPal", icon: Wallet, desc: "Minimal payout $5.00" },
  {
    name: "Bank Transfer (IDR)",
    icon: Banknote,
    desc: "Minimal payout $10.00",
  },
  { name: "Crypto (USDT)", icon: DollarSign, desc: "Minimal payout $25.00" },
];

export default function PayoutRates() {
  const [search, setSearch] = useState("");

  const filteredRates = payoutRates.filter((rate) =>
    rate.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten Payout Rates */}
      <section
        id="payout-rates"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[10em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="Rates"
            h1Text="Payout Rates Kami"
            pText="Kami menawarkan CPM rate tertinggi, pastikan Anda mendapatkan bayaran terbaik untuk traffic Anda."
            h1ClassName="text-center justify-center items-center"
            pClassName="sm:w-[35em] w-full"
          />

          {/* Bagian Tabel (Interaktif & Clean) */}
          <div className="w-full md:w-[80%] lg:w-[85%] m-auto space-y-[5em]">
            {/* Search Bar (Interaktif) */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* <label
                htmlFor="search-country"
                className="text-shortblack font-medium text-[1.6em] mb-[.8em] block"
              >
                Cari Negara
              </label> */}
              <div className="relative">
                <Search className="w-5 h-5 text-grays absolute left-[3em] top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="search-country"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-[1.5em] px-[4.5em] block w-full text-[1.6em] border border-transparent bg-blues rounded-3xl focus:outline-none focus:ring-2 focus:ring-bluelight/50 focus:border-bluelight transition-all duration-300"
                  placeholder="Ketik nama negara... (cth: Indonesia)"
                />
              </div>
            </motion.div>

            {/* Tabel (Clean) */}
            <motion.div
              className="overflow-hidden rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <table className="w-full text-left">
                {/* Header Tabel */}
                <thead className="bg-shortblack text-white  uppercase">
                  <tr>
                    <th className="px-[4em] py-[2em]">
                      <div className="flex items-center gap-[1em]">
                        <Globe className="w-5 h-5" />
                        <span className="text-[1.6em]">Negara</span>
                      </div>
                    </th>
                    <th className="px-[4em] py-[2em]">
                      <div className="flex items-center gap-[1em]">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-[1.6em]">Rates/1K (CPM)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                {/* Body Tabel */}
                <tbody>
                  {filteredRates.length > 0 ? (
                    filteredRates.map((rate, index) => (
                      <tr
                        key={rate.country}
                        className={index % 2 === 0 ? "bg-white" : "bg-blues"}
                      >
                        {/* Bagian ini udah pake <Image> */}
                        <td className="px-[4em] py-[2em] font-medium text-shortblack">
                          <div className="flex items-center gap-[1.5em]">
                            {rate.isoCode === "all" ? (
                              <div className="w-[3em] h-[2em] bg-gray-200 rounded-sm flex items-center justify-center">
                                <Globe className="w-4 h-4 text-grays" />
                              </div>
                            ) : (
                              <Image
                                src={`https://flagcdn.com/${rate.isoCode}.svg`}
                                alt={`Bendera ${rate.country}`}
                                width={30} // 3em
                                height={20} // 2em
                                className="rounded-sm"
                              />
                            )}
                            <span className="text-[1.6em]">{rate.country}</span>
                          </div>
                        </td>
                        <td className="px-[4em] py-[2em] font-semibold text-bluelight text-[1.6em] ">
                          ${rate.cpm.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Kalo hasil search kosong
                    <tr className="bg-white">
                      <td
                        colSpan={2}
                        className="p-[4em] text-center text-grays"
                      >
                        Negara tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
            <p className="text-center text-grays text-[1.6em] italic">
              * Rates dapat berubah sewaktu-waktu tanpa pemberitahuan.
            </p>
          </div>

          {/* Metode Pembayaran (Menarik) */}
          <motion.div
            className="space-y-[5em]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center">
              <h2 className="text-shortblack font-semibold text-[3em]">
                Metode Pembayaran
              </h2>
              <p className="text-grays text-[1.8em] sm:w-[30em] w-full m-auto">
                Tarik penghasilan Anda dengan mudah dan cepat.
              </p>
            </div>

            {/* Grid Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4em]">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="bg-blues p-[3em] rounded-3xl text-center"
                >
                  <div className="w-[10em] h-[10em] bg-bluelight/20 rounded-full mx-auto mb-[2em] flex items-center justify-center">
                    <method.icon className="w-[5em] h-[5em] text-bluelight" />
                  </div>
                  <h3 className="text-shortblack font-semibold text-[2.2em]">
                    {method.name}
                  </h3>
                  <p className="text-bluelight text-[1.6em] font-medium">
                    {method.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

