"use client";
import { useState, useEffect } from "react";
import * as service from "@/services/superAdminService";
import type { SuperAdminStats } from "@/types/type";

export function useSuperAdmin() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    service.getSuperAdminStats().then((data) => {
      setStats(data);
      setIsLoading(false);
    });
  }, []);

  return { stats, isLoading };
}
