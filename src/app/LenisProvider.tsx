// src/app/LenisProvider.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import ReactLenis from "lenis/react";
import { usePathname, useSearchParams } from "next/navigation";

type LenisScrollProviderProps = {
  children: React.ReactNode;
};

const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (lenisRef.current?.lenis) {
      const hash = window.location.hash;

      if (hash) {
        const targetEl = document.querySelector(hash);

        // 1. Scroll Instan (Biar gak bengong di top page)
        // Kita kasih offset lebih gede (-150) buat jaga-jaga header
        lenisRef.current.lenis.scrollTo(hash, {
          offset: -150,
          duration: 1.2,
        });

        // 2. SAFETY SCROLL (Penting!)
        // Kita scroll ulang setelah 1 detik (asumsi loading data kelar)
        // Biar kalau layoutnya geser/nambah tinggi, scrollnya ngikutin.
        setTimeout(() => {
          lenisRef.current.lenis.scrollTo(hash, {
            offset: -150, // Sesuaikan sama tinggi Header lu
            duration: 0.5, // Durasi cepet aja buat koreksi
            force: true,
          });
        }, 1200); // 1200ms = 1.2 detik (lebih lama dari mock API 800ms)
      } else {
        // Reset ke atas kalau ganti halaman biasa
        lenisRef.current.lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, searchParams]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        gestureOrientation: "vertical",
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
