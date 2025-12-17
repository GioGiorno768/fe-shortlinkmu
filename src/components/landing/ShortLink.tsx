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
import * as linkService from "@/services/linkService";

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

    try {
      // Call Real API
      const data = await linkService.createGuestLink(urlInput);

      // Detect protocol automatically (http on dev, https on prod)
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Construct display URL: e.g. http://localhost:3000/ABC123
      const fullShortUrl = `${host}/${data.code}`;

      setShortLink(fullShortUrl);
      setUrlInput(""); // Clear input on success

      // Optional: Show guest info
      if (data.isGuest) {
        // You could show a small toast/alert here if needed
        // console.log("Guest link created");
      }
    } catch (err: any) {
      // Error message is already formatted in service (e.g. "Guest limit reached...")
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi buat copy link
  const handleCopy = () => {
    if (!shortLink) return;

    const protocol = window.location.protocol;
    navigator.clipboard.writeText(`${protocol}//${shortLink}`);
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

    const protocol = window.location.protocol;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortlinkmu Link",
          text: `Lihat link saya: ${shortLink}`,
          url: `${protocol}//${shortLink}`,
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
                  rel="noopener"
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
