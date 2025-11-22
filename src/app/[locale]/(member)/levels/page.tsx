"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";
import type { UserLevelProgress } from "@/types/type";

import CurrentLevelHeader from "@/components/dashboard/levels/CurrentLevelHeader";
import LevelsGrid from "@/components/dashboard/levels/LevelsGrid";

// --- MOCK API ---
async function fetchUserLevelProgress(): Promise<UserLevelProgress> {
  console.log("MANGGIL API: /api/user/level-progress");
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    currentLevel: "rookie",
    currentEarnings: 35.5, // $35.50
    nextLevelEarnings: 50.0, // Target $50.00
    progressPercent: 71, // (35.5 / 50) * 100
  };
}

export default function LevelsPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserLevelProgress | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchUserLevelProgress();
        setData(res);
      } catch (error) {
        showAlert("Gagal memuat data level.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Header Page */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-[2.5em] font-bold text-shortblack">
          Level & Achievements
        </h1>
        <p className="text-[1.6em] text-grays mt-2">
          Naikkan levelmu untuk mendapatkan CPM lebih tinggi dan fitur
          eksklusif.
        </p>
      </div>

      {/* 1. Current Progress Header */}
      {data && <CurrentLevelHeader data={data} />}

      {/* 2. All Levels Grid */}
      {data && <LevelsGrid currentLevel={data.currentLevel} />}
    </div>
  );
}
