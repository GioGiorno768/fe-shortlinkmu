// Service for managing ad levels (Super Admin)
// Uses types from type.ts

export interface AdLevelConfig {
  id: string;
  levelNumber: number;
  name: string;
  description: string;
  revenueShare: number; // percentage
  cpcRate: number; // cost per click in dollars
  colorTheme: "green" | "blue" | "orange" | "red";
  isPopular: boolean;
  demoUrl: string;
  features: AdFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdFeature {
  id: string;
  label: string;
  included: boolean;
  value?: string | boolean;
}

// Mock data for development
const mockAdLevels: AdLevelConfig[] = [
  {
    id: "1",
    levelNumber: 1,
    name: "Low",
    description: "Minimal ads for best user experience",
    revenueShare: 50,
    cpcRate: 0.0025, // $0.0025 per click → CPM $2.50
    colorTheme: "green",
    isPopular: false,
    demoUrl: "https://demo.shortlink.com/low",
    features: [
      {
        id: "f1",
        label: "Interstitial Ads",
        included: true,
        value: "1x per visit",
      },
      { id: "f2", label: "Banner Ads", included: false },
      { id: "f3", label: "Popups", included: false },
      { id: "f4", label: "Direct Link", included: true },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    levelNumber: 2,
    name: "Medium",
    description: "Balanced ads and earnings",
    revenueShare: 60,
    cpcRate: 0.004, // $0.004 per click → CPM $4.00
    colorTheme: "blue",
    isPopular: true,
    demoUrl: "https://demo.shortlink.com/medium",
    features: [
      {
        id: "f1",
        label: "Interstitial Ads",
        included: true,
        value: "2x per visit",
      },
      { id: "f2", label: "Banner Ads", included: true },
      { id: "f3", label: "Popups", included: true, value: "1x per 24h" },
      { id: "f4", label: "Direct Link", included: true },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    levelNumber: 3,
    name: "High",
    description: "More ads, higher earnings",
    revenueShare: 70,
    cpcRate: 0.006, // $0.006 per click → CPM $6.00
    colorTheme: "orange",
    isPopular: false,
    demoUrl: "https://demo.shortlink.com/high",
    features: [
      {
        id: "f1",
        label: "Interstitial Ads",
        included: true,
        value: "3x per visit",
      },
      { id: "f2", label: "Banner Ads", included: true },
      { id: "f3", label: "Popups", included: true, value: "3x per 24h" },
      { id: "f4", label: "Direct Link", included: false },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    levelNumber: 4,
    name: "Extreme",
    description: "Maximum ads and revenue",
    revenueShare: 80,
    cpcRate: 0.0085, // $0.0085 per click → CPM $8.50
    colorTheme: "red",
    isPopular: false,
    demoUrl: "https://demo.shortlink.com/extreme",
    features: [
      {
        id: "f1",
        label: "Interstitial Ads",
        included: true,
        value: "5x per visit",
      },
      { id: "f2", label: "Banner Ads", included: true },
      { id: "f3", label: "Popups", included: true, value: "5x per 24h" },
      { id: "f4", label: "Direct Link", included: false },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

let adLevels = [...mockAdLevels];

// Get all ad levels
export const getAdLevels = async (): Promise<AdLevelConfig[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...adLevels];
};

// Create new ad level
export const createAdLevel = async (
  data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
): Promise<AdLevelConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newLevel: AdLevelConfig = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  adLevels.push(newLevel);
  return newLevel;
};

// Update existing ad level
export const updateAdLevel = async (
  id: string,
  data: Partial<Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">>
): Promise<AdLevelConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = adLevels.findIndex((level) => level.id === id);
  if (index === -1) throw new Error("Ad level not found");

  adLevels[index] = {
    ...adLevels[index],
    ...data,
    updatedAt: new Date(),
  };

  return adLevels[index];
};

// Delete ad level
export const deleteAdLevel = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  adLevels = adLevels.filter((level) => level.id !== id);
};

// Utility: Convert CPC to CPM
export const calculateCPM = (cpc: number): number => {
  return cpc * 1000;
};

// Utility: Format CPM for display
export const formatCPM = (cpc: number): string => {
  const cpm = calculateCPM(cpc);
  return `$${cpm.toFixed(2)}`;
};
