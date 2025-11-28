// src/services/adsInfoService.ts
import type { AdLevelConfig } from "@/types/type";

// --- MOCK API CALLS ---

export async function getAdLevels(): Promise<AdLevelConfig[]> {
  // NANTI GANTI: fetch('/api/ads-levels')
  console.log("MANGGIL API: /api/ads-levels");

  // Simulasi loading
  await new Promise((resolve) => setTimeout(resolve, 800));

  // --- MOCK DATA ---
  return [
    {
      id: "1",
      name: "Low",
      slug: "low",
      description: "User-friendly, minimal ads focused on retention.",
      cpmRate: "Variable",
      revenueShare: 30,
      demoUrl: "https://demo.shortlinkmu.com/low",
      colorTheme: "green",
      features: [
        { label: "Banner Ads", value: true, included: true },
        { label: "Interstitial", value: false, included: false },
        { label: "Popunder", value: "1 / 24h", included: true },
        { label: "Push Notif", value: false, included: false },
        { label: "Captcha", value: "Simple", included: true },
      ],
    },
    {
      id: "2",
      name: "Medium",
      slug: "medium",
      description: "Balanced experience between earnings and comfort.",
      cpmRate: "Variable",
      revenueShare: 50,
      isPopular: true,
      demoUrl: "https://demo.shortlinkmu.com/medium",
      colorTheme: "blue",
      features: [
        { label: "Banner Ads", value: true, included: true },
        { label: "Interstitial", value: "On Page Load", included: true },
        { label: "Popunder", value: "2 / 24h", included: true },
        { label: "Push Notif", value: false, included: false },
        { label: "Captcha", value: "Standard", included: true },
      ],
    },
    {
      id: "3",
      name: "High",
      slug: "high",
      description: "Maximized for earnings with more ad formats.",
      cpmRate: "Variable",
      revenueShare: 75,
      demoUrl: "https://demo.shortlinkmu.com/high",
      colorTheme: "orange",
      features: [
        { label: "Banner Ads", value: "Aggressive", included: true },
        { label: "Interstitial", value: "Every Page", included: true },
        { label: "Popunder", value: "3 / 24h", included: true },
        { label: "Push Notif", value: true, included: true },
        { label: "Captcha", value: "Double", included: true },
      ],
    },
    {
      id: "4",
      name: "Aggressive",
      slug: "aggressive",
      description: "Highest possible revenue. Not for sensitive traffic.",
      cpmRate: "Variable",
      revenueShare: 100,
      demoUrl: "https://demo.shortlinkmu.com/aggressive",
      colorTheme: "red",
      features: [
        { label: "Banner Ads", value: "Max", included: true },
        { label: "Interstitial", value: "Multipoint", included: true },
        { label: "Popunder", value: "Unlimited", included: true },
        { label: "Push Notif", value: "High Freq", included: true },
        { label: "Captcha", value: "Triple", included: true },
      ],
    },
  ];
}
