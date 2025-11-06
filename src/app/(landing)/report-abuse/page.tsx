import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";
import {
  Link as LinkIcon,
  Mail,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export default function ReportAbuse() {
  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten Report Abuse */}
      <section
        id="report-abuse"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[8em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="Security"
            h1Text="Report Abuse"
            pText="Kami menangani penyalahgunaan dengan serius. Jika Anda menemukan link yang melanggar, laporkan di sini."
            h1ClassName="text-center justify-center items-center"
            pClassName="sm:w-[35em] w-full"
          />

          {/* Form Laporan */}
          <div className="w-full md:w-[80%] lg:w-[60%] m-auto bg-white p-[3em] sm:p-[5em] rounded-2xl shadow-lg border border-gray-100">
            <form className="space-y-[4em]">
              {/* Input Link yang Dilaporkan */}
              <div className="relative">
                <label
                  htmlFor="abusive-link"
                  className="text-shortblack font-medium text-[1.8em] mb-[1em] block"
                >
                  Link yang Dilaporkan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-grays absolute left-[3em] top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="abusive-link"
                    name="abusive-link"
                    className="py-[1em] px-[4.5em] block w-full shadow-sm text-[1.6em] focus:outline-bluelight border border-gray-200 rounded-full bg-white"
                    placeholder="https://short.link/link-berbahaya"
                    required
                  />
                </div>
              </div>

              {/* Input Alasan Pelaporan */}
              <div className="relative">
                <label
                  htmlFor="reason"
                  className="text-shortblack font-medium text-[1.8em] mb-[1em] block"
                >
                  Alasan Pelaporan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldAlert className="w-5 h-5 text-grays absolute left-[3em] top-1/2 -translate-y-1/2" />
                  <select
                    id="reason"
                    name="reason"
                    className="py-[1em] px-[4.5em] block w-full shadow-sm text-[1.6em] focus:outline-bluelight border border-gray-200 rounded-full bg-white appearance-none"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih kategori...
                    </option>
                    <option value="phishing">Phishing</option>
                    <option value="malware">Malware / Virus</option>
                    <option value="spam">Spam</option>
                    <option value="illegal_content">
                      Konten Ilegal (Judi, Pornografi, dll)
                    </option>
                    <option value="copyright">Pelanggaran Hak Cipta</option>
                    <option value="other">Lainnya</option>
                  </select>
                  {/* Panah dropdown */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pe-[3em] text-grays">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Input Email (Opsional) */}
              <div className="relative">
                <label
                  htmlFor="reporter-email"
                  className="text-shortblack font-medium text-[1.8em] mb-[1em] block"
                >
                  Email Anda (Opsional)
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-grays absolute left-[3em] top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="reporter-email"
                    name="reporter-email"
                    className="py-[1em] px-[4.5em] block w-full shadow-sm text-[1.6em] focus:outline-bluelight border border-gray-200 rounded-full bg-white"
                    placeholder="Email Anda untuk tindak lanjut"
                  />
                </div>
              </div>

              {/* Input Detail (Opsional) */}
              <div className="relative">
                <label
                  htmlFor="details"
                  className="text-shortblack font-medium text-[1.8em] mb-[1em] block"
                >
                  Detail Tambahan (Opsional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-grays absolute left-[3em] top-[2.5em]" />
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    className="py-[1.3em] px-[4.5em] block w-full shadow-sm text-[1.6em] focus:outline-bluelight border border-gray-200 rounded-3xl bg-white"
                    placeholder="Jelaskan lebih lanjut (jika perlu)..."
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="text-[1.8em] w-full bg-bluelight text-white px-[2em] py-[1.5em] rounded-full cursor-pointer font-semibold hover:bg-opacity-90 transition-all"
              >
                Kirim Laporan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
