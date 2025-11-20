"use client"; // Kita butuh state, jadi harus "use client"

import { useState } from "react";
import {
  Link as LinkIcon,
  ClipboardCopy,
  Check,
  Share2,
  Loader2,
  OctagonAlert, // Icon buat loading
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

export default function ShortLink() {
  const { showAlert } = useAlert();
  const [urlInput, setUrlInput] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  // Fungsi buat generate link
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Biar halaman gak reload
    if (!urlInput) {
      setError("Link tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setError("");
    setShortLink("");
    setIsCopied(false);

    // --- KERANGKA REST API (Fetch POST) ---
    // Nanti lu tinggal ganti URL-nya dan sesuaikan body-nya
    try {
      /*
      // --- INI CONTOH KALO PAKE API Beneran ---
      const response = await fetch("/api/v1/generate", { // Ganti URL API lu di sini
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: urlInput }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat shortlink");
      }

      const data = await response.json();
      setShortLink(data.shortUrl); // Asumsi API ngembaliin { shortUrl: "short.link/xyz" }
      */

      // --- SIMULASI API (Hapus aja kalo API udah jadi) ---
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi loading 1 detik
      // Cek kalo URL valid (simulasi simpel)
      if (!urlInput.startsWith("http")) {
        throw new Error("URL tidak valid. Harus diawali http:// atau https://");
      }
      const randomString = Math.random().toString(36).substring(7);
      setShortLink(`short.link/${randomString}`);
      setUrlInput(""); // Kosongin input setelah sukses
      // ---------------------------------------------------
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi buat copy link
  const handleCopy = () => {
    if (!shortLink) return;

    navigator.clipboard.writeText(`https://${shortLink}`);
    setIsCopied(true);

    // Tambahin alert sukses copy (opsional, karena udah ada icon check)
    showAlert("Link telah disalin ke clipboard!", "success", "Copied!");

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Fungsi buat share (Pake Web Share API)
  const handleShare = async () => {
    if (!shortLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortlinkmu Link",
          text: `Lihat link saya: ${shortLink}`,
          url: `https://${shortLink}`,
        });
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      // Fallback kalo browser gak support
      handleCopy();
      // alert("Link disalin! (Browser Anda tidak mendukung fitur share)"); <-- HAPUS

      // GANTI JADI
      showAlert(
        "Browser Anda tidak mendukung fitur share. Link telah disalin.",
        "info",
        "Info"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-[2em] w-full relative">
        <input
          type="text"
          id="hero-input"
          name="hero-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="py-[1em] sm:py-[1em] px-[2.5em] block w-full shadow-sm shadow-slate-500/40 text-[1.6em] focus:outline-bluelight disabled:opacity-50 disabled:pointer-events-none rounded-full bg-white"
          placeholder="Tempel link panjang Anda di sini..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="text-[1.6em] bg-bluelight text-white px-[3em] rounded-full cursor-pointer flex-shrink-0 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" /> // Ikon loading muter
          ) : (
            "Generate"
          )}
        </button>
      </form>
      <div className="font-figtree h-[10em]">
        {" "}
        {/* Kasih tinggi biar layout gak "lompat" */}
        {/* Tampilkan Error kalo ada */}
        {error && (
          <div className="text-redshortlink ms-[3em] w-fit text-[1.4em] text-start mt-[1em] flex gap-[1em]">
            <OctagonAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {/* Tampilkan Card Link KALO shortLink udah ada isinya */}
        {shortLink && (
          <div className="shadow-sm mt-[2em] px-[3.5em] py-[2em] shadow-slate-500/40 rounded-3xl flex justify-between items-center bg-white animate-in fade-in-0 slide-in-from-top-5 duration-500">
            <div className="w-fit flex gap-[3em] items-center overflow-hidden">
              <LinkIcon className="w-5 h-5 text-bluelight flex-shrink-0" />
              <div className="gap-[.5em] flex flex-col">
                <span className="text-[1.4em]">Your Link</span>
                <a
                  href={`https://${shortLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shortblack text-[1.6em] font-semibold hover:underline truncate"
                >
                  {shortLink}
                </a>
              </div>
            </div>
            <div className="flex gap-[3em] items-center">
              <button
                onClick={handleCopy}
                title={isCopied ? "Disalin!" : "Salin link"}
              >
                {isCopied ? (
                  <Check className="w-6 h-6 text-greenlight" />
                ) : (
                  <ClipboardCopy className="w-6 h-6 text-bluelight" />
                )}
              </button>
              <button onClick={handleShare} title="Bagikan link">
                <Share2 className="w-6 h-6 text-bluelight" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
