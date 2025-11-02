import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import TitleSection from "@/components/landing/TitleSection";
import { UserCheck } from "lucide-react"; // Kita pake icon biar clean

export default function Contact() {
  const contacts = [
    {
      id: 1,
      name: "Customer Support 1",
      description:
        "Untuk pertanyaan umum, kendala teknis, atau masalah terkait akun Anda.",
      email: "kevinragil768@gmail.com",
    },
    {
      id: 2,
      name: "Customer Support 2",
      description:
        "Untuk pertanyaan seputar payout, billing, kerjasama, atau kemitraan.",
      email: "kevinkrisna768@gmail.com",
    },
  ];

  return (
    <main className="text-[10px] max-w-[155em] m-auto bg-white">
      {/* Navbar */}
      <header>
        <div className="relative z-50">
          <Navbar />
        </div>
      </header>

      {/* Konten Kontak */}
      <section
        id="contact"
        className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white"
      >
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[12em]">
          {/* Title */}
          <TitleSection
            parentClassName="text-center justify-center items-center"
            sectionText="Contact"
            h1Text="Get In Touch"
            pText="Ada pertanyaan? Tim support kami siap membantu Anda. Pilih salah satu kontak di bawah ini."
            h1ClassName="text-center justify-center items-center"
            pClassName="sm:w-[35em] w-full"
          />

          {/* Card Kontak */}
          <div className="w-full md:w-[80%] lg:w-[70%] m-auto flex flex-col lg:flex-row justify-center items-stretch gap-[5em]">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col w-full bg-white p-[3em] sm:p-[4em] rounded-2xl shadow-lg border border-gray-100 text-center items-center"
              >
                {/* Icon */}
                <div className="w-[8em] h-[8em] bg-blue-100 rounded-full flex items-center justify-center mb-[2em] flex-shrink-0">
                  <UserCheck className="w-[4em] h-[4em] text-bluelight" />
                </div>

                {/* Judul Card */}
                <h2 className="text-shortblack font-semibold text-[2.4em] mb-[1em]">
                  {contact.name}
                </h2>

                {/* Deskripsi */}
                <p className="text-grays text-[1.6em] mb-[3em] min-h-[5em]">
                  {contact.description}
                </p>

                {/* Tombol Mailto */}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[1.8em] w-full mt-auto bg-bluelight text-white px-[2em] py-[1.5em] rounded-full cursor-pointer font-semibold hover:bg-opacity-90 transition-all"
                >
                  Hubungi via Email
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
