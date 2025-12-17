"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setupCrossTabLogoutListener } from "@/services/authService";

/**
 * Hook to setup cross-tab logout sync
 * When user logs out in one tab, all other tabs will also be logged out
 */
export function useCrossTabLogout() {
  const router = useRouter();

  useEffect(() => {
    const cleanup = setupCrossTabLogoutListener(() => {
      // Another tab logged out - redirect to login
      router.push("/login");
    });

    return cleanup;
  }, [router]);
}
