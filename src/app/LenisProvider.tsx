"use client";

// lenis-provider.tsx
import { FC, useRef } from "react";
import ReactLenis from "lenis/react";

type LenisScrollProviderProps = {
  children: React.ReactNode;
};
const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef(null);
  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        // smoothTouch: true, // ⚡ WAJIB buat Android/iOS
        gestureOrientation: "vertical", // biar swipe kebaca
        touchMultiplier: 2, // biar swipe lebih responsif
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
