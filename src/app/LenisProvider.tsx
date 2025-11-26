// src/app/LenisProvider.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import ReactLenis from "lenis/react";
import { usePathname } from "next/navigation"; // 1. Import usePathname

type LenisScrollProviderProps = {
  children: React.ReactNode;
};

const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<any>(null); // Pake any dulu biar aman ref-nya
  const pathname = usePathname(); // 2. Ambil URL sekarang

  // 3. Tambahin Effect ini: Jalan tiap kali ganti halaman
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      // Force scroll ke posisi 0 (paling atas) secara instan (tanpa animasi lambat)
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        // smoothTouch: true,
        gestureOrientation: "vertical",
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
