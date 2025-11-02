import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";

export default function TermsOfService() {
  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten Terms of Service */}
      <section
        id="terms"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[8em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="Legal"
            h1Text="Terms of Service"
            pText="Harap baca persyaratan layanan kami dengan saksama sebelum menggunakan layanan kami."
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
                Selamat datang di Shortlinkmu! Persyaratan Layanan ("Ketentuan")
                ini mengatur penggunaan Anda atas situs web kami yang berlokasi
                di [NamaDomainAnda.com] dan layanan apa pun yang terkait ("Layanan"),
                yang dioperasikan oleh Shortlinkmu ("kami", "milik kami", atau
                "kita").
              </p>

              <h2 className="text-shortblack font-semibold text-[2em]  pt-[1em]">
                1. Penerimaan Persyaratan
              </h2>
              <p>
                Dengan mengakses atau menggunakan Layanan kami, Anda setuju untuk
                terikat oleh Ketentuan ini. Jika Anda tidak setuju dengan bagian
                mana pun dari ketentuan ini, maka Anda tidak diizinkan untuk
                mengakses Layanan.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                2. Penggunaan Layanan
              </h2>
              <p>
                Anda setuju untuk tidak menggunakan Layanan untuk tujuan apa pun
                yang melanggar hukum atau dilarang oleh Ketentuan ini. Anda
                setuju untuk tidak:
              </p>
              <ul className="list-disc list-inside space-y-[1em] pl-[2em]">
                <li>
                  Menggunakan layanan untuk menyebarkan malware, phishing, atau
                  konten ilegal lainnya.
                </li>
                <li>
                  Melakukan aktivitas apa pun yang mengganggu atau mengacaukan
                  Layanan (atau server dan jaringan yang terhubung ke Layanan).
                </li>
                <li>
                  Mencoba untuk merekayasa balik, mendekompilasi, atau
                  mendapatkan kode sumber dari perangkat lunak yang mendasari
                  Layanan.
                </li>
              </ul>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                3. Akun Pengguna
              </h2>
              <p>
                Untuk mengakses beberapa fitur Layanan, Anda mungkin diharuskan
                membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan
                kata sandi Anda dan untuk semua aktivitas yang terjadi di bawah
                akun Anda.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                4. Batasan Tanggung Jawab
              </h2>
              <p>
                Dalam batas maksimal yang diizinkan oleh hukum yang berlaku,
                Shortlinkmu tidak akan bertanggung jawab atas kerugian tidak
                langsung, insidental, khusus, konsekuensial, atau hukuman, atau
                kerugian apa pun atas keuntungan atau pendapatan, baik yang
Jalan
                secara langsung maupun tidak langsung...
              </p>
              <p>
                [... Bagian ini dan bagian selanjutnya adalah placeholder. Anda
                HARUS menggantinya dengan T&C legal Anda yang sebenarnya ...]
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                5. Perubahan Persyaratan
              </h2>
              <p>
                Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau
                mengganti Ketentuan ini kapan saja. Kami akan memberi tahu Anda
                tentang perubahan apa pun dengan memposting Ketentuan baru di
                halaman ini.
              </p>

              <h2 className="text-shortblack font-semibold text-[2em] pt-[1em]">
                6. Hubungi Kami
              </h2>
              <p>
                Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan
                hubungi kami melalui halaman kontak kami.
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