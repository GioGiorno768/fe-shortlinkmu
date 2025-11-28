// src/hooks/useReferral.ts
"use client";

import { useState, useEffect } from "react";
import * as referralService from "@/services/referralService";
import type { ReferralStats, ReferredUser } from "@/types/type";

export function useReferral() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [users, setUsers] = useState<ReferredUser[]>([]);
  const [referralLink, setReferralLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch paralel biar cepet
        const [statsData, usersData, linkData] = await Promise.all([
          referralService.getReferralStats(),
          referralService.getReferredUsers(),
          referralService.getReferralLink(),
        ]);

        setStats(statsData);
        setUsers(usersData);
        setReferralLink(linkData);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data referral.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    stats,
    users,
    referralLink,
    isLoading,
    error,
  };
}
