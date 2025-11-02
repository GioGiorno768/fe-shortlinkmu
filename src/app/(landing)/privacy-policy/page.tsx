import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";

export default function PrivacyPolicy() {
  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten Privacy Policy */}
      <section
        id="privacy"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[8em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="Legal"
            h1Text="Privacy Policy"
            pText="Privasi Anda penting bagi kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan dan menggunakan data Anda."
            h1ClassName="text-center justify-center items-center"
            pClassName="sm:w-[35em] w-full"
          />

          {/* Konten Teks Legal */}
          <div className="w-full md:w-[80%] lg:w-[70%] m-auto bg-white p-[3em] sm:p-[5em] rounded-2xl shadow-lg border border-gray-100">
            <div className="space-y-[.5em] text-grays text-[1.8em] leading-relaxed">
              <p className="text-shortblack font-semibold">
                Terakhir diperbarui: 2 November 2025
              </p>

              <p>
                Kebijakan Privasi ini menjelaskan bagaimana Shortlinkmu ("kami",
                "milik kami", atau "kita") mengumpulkan, menggunakan, dan
                mengungkapkan informasi Anda saat Anda menggunakan layanan kami
                ("Layanan").
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                1. Informasi yang Kami Kumpulkan
              </h2>
              <p>
                Kami dapat mengumpulkan beberapa jenis informasi untuk
                menyediakan dan meningkatkan Layanan kami kepada Anda:
              </p>
              <ul className="list-disc list-inside space-y-[1em] pl-[2em]">
                <li>
                  <strong>Informasi Pribadi:</strong> Saat mendaftar akun, kami
                  mungkin meminta Anda untuk memberikan informasi yang dapat
                  diidentifikasi secara pribadi seperti alamat email, nama
                  pengguna, dan informasi pembayaran (untuk payout).
                </li>
                <li>
                  <strong>URL Asli:</strong> Kami mengumpulkan URL asli yang
                  ingin Anda perpendek.
                </li>
                <li>
                  <strong>Data Penggunaan dan Log:</strong> Kami secara otomatis
                  mengumpulkan informasi saat Anda menggunakan Layanan, seperti
                  alamat IP Anda, jenis browser, halaman yang Anda kunjungi,
                  waktu dan tanggal kunjungan, dan data klik.
                </li>
              </ul>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
              <p>
                Kami menggunakan informasi yang kami kumpulkan untuk berbagai
                tujuan:
              </p>
              <ul className="list-disc list-inside space-y-[1em] pl-[2em]">
                <li>
                  Untuk menyediakan, mengoperasikan, dan memelihara Layanan.
                </li>
                <li>Untuk memproses pendaftaran akun dan pembayaran Anda.</li>
                <li>
                  Untuk memantau dan menganalisis penggunaan dan tren untuk
                  meningkatkan Layanan.
                </li>
                <li>
                  Untuk mendeteksi dan mencegah aktivitas penipuan, spam, dan
                  pelanggaran terhadap Persyaratan Layanan kami.
                </li>
                <li>
                  Untuk berkomunikasi dengan Anda, termasuk mengirimkan
                  pembaruan layanan dan tanggapan dukungan.
                </li>
              </ul>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                3. Cookie dan Teknologi Pelacakan
              </h2>
              <p>
                Kami menggunakan cookie dan teknologi pelacakan serupa untuk
                melacak aktivitas di Layanan kami dan menyimpan informasi
                tertentu. Cookie adalah file dengan sejumlah kecil data yang
                mungkin menyertakan pengidentifikasi unik anonim. Anda dapat
                menginstruksikan browser Anda untuk menolak semua cookie atau
                menunjukkan kapan cookie sedang dikirim.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                4. Keamanan Data
              </h2>
              <p>
                Keamanan data Anda penting bagi kami. Kami menggunakan
                langkah-langkah keamanan yang wajar secara komersial untuk
                melindungi Informasi Pribadi Anda dari akses, pengungkapan,
                perubahan, atau penghancuran yang tidak sah. Namun, ingatlah
                bahwa tidak ada metode transmisi melalui Internet atau metode
                penyimpanan elektronik yang 100% aman.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                5. Privasi Anak-Anak
              </h2>
              <p>
                Layanan kami tidak ditujukan untuk siapa pun yang berusia di
                bawah 13 tahun ("Anak-Anak"). Kami tidak secara sadar
                mengumpulkan informasi yang dapat diidentifikasi secara pribadi
                dari anak di bawah umur 13 tahun.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                6. Perubahan pada Kebijakan Privasi Ini
              </h2>
              <p>
                Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke
                waktu. Kami akan memberi tahu Anda tentang perubahan apa pun
                dengan memposting Kebijakan Privasi baru di halaman ini. Anda
                disarankan untuk meninjau Kebijakan Privasi ini secara berkala
                untuk setiap perubahan.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                7. Hubungi Kami
              </h2>
              <p>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                silakan hubungi kami melalui halaman kontak kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
