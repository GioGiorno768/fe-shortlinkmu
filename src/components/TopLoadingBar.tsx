// ============================================
// FILE 2: src/components/TopLoadingBar.tsx
// ============================================
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "@/styles/nprogress.css";

// Konfigurasi NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: "ease",
  speed: 500,
});

export default function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handler buat intercept semua link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        const currentUrl = new URL(window.location.href);

        // Cek apakah link internal (bukan external & bukan anchor link)
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname &&
          !anchor.target && // bukan target="_blank"
          !e.ctrlKey && // bukan Ctrl+Click
          !e.metaKey && // bukan Cmd+Click (Mac)
          !e.shiftKey // bukan Shift+Click
        ) {
          // START loading bar SEBELUM navigasi
          NProgress.start();
        }
      }
    };

    // Attach event listener ke document
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    // DONE loading bar pas route udah berubah
    NProgress.done();
  }, [pathname, searchParams]);

  // Handle browser back/forward button
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handlePopState = () => {
      NProgress.start();

      // Safety timeout: force done setelah 500ms kalau pathname ga berubah
      timeoutId = setTimeout(() => {
        NProgress.done();
      }, 500);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
