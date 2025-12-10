// Dashboard Auth Check - Check on mount (optimized)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function DashboardAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check auth immediately on mount
    if (!authService.isAuthenticated()) {
      router.replace("/login"); // Use replace instead of push
    }
  }, [router]);

  // No loading state - middleware handles first check, this is just backup
  return <>{children}</>;
}
