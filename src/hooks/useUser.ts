// src/hooks/useUser.ts
"use client";

import { useState, useEffect } from "react";
import * as settingsService from "@/services/settingsService";
import type { UserProfile } from "@/types/type";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await settingsService.getUserProfile();
        setUser(data);
      } catch (error) {
        console.error("Gagal memuat profil user", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  return { user, isLoading };
}
