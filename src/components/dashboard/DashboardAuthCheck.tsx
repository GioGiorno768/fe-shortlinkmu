// Dashboard Auth Check - Check on mount with role validation
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authService, { getUser } from "@/services/authService";
import { useCrossTabLogout } from "@/hooks/useCrossTabLogout";

interface DashboardAuthCheckProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "super-admin" | "member";
}

export default function DashboardAuthCheck({
  children,
  requiredRole,
}: DashboardAuthCheckProps) {
  const router = useRouter();

  // 📢 Listen for logout events from other tabs
  useCrossTabLogout();

  useEffect(() => {
    // Check auth immediately on mount
    if (!authService.isAuthenticated()) {
      router.replace("/login");
      return;
    }

    // Check role if required
    if (requiredRole) {
      const user = getUser();
      const userRole = user?.role || "user";

      // Admin/super-admin routes require admin or super_admin role
      if (requiredRole === "admin" || requiredRole === "super-admin") {
        if (userRole !== "admin" && userRole !== "super_admin") {
          // Redirect non-admin users to member dashboard
          router.replace("/dashboard");
          return;
        }
      }

      // Super-admin routes require super_admin role only
      if (requiredRole === "super-admin") {
        if (userRole !== "super_admin") {
          // Redirect non-super-admin to admin dashboard
          router.replace("/admin/dashboard");
          return;
        }
      }
    }
  }, [router, requiredRole]);

  // No loading state - middleware handles first check, this is just backup
  return <>{children}</>;
}
