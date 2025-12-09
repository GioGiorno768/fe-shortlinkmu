// src/services/levelsService.ts
import type { UserLevelProgress, LevelConfig } from "@/types/type";

// --- MOCK API CALLS ---

export async function getUserLevelProgress(): Promise<UserLevelProgress> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Data dummy user
  return {
    currentLevel: "rookie",
    currentEarnings: 35.5, // $35.50
    nextLevelEarnings: 50.0, // Target $50.00
    progressPercent: 71, // (35.5 / 50) * 100
  };
}

export async function getLevelsConfig(): Promise<LevelConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Ini data yang tadinya di-hardcode di LevelsGrid.tsx
  // Sekarang udah "seolah-olah" dari database
  return [
    {
      no: 1,
      id: "beginner",
      name: "Beginner",
      minEarnings: 0,
      cpmBonus: 0,
      benefits: ["Basic Analytics", "Standard Support", "Monthly Payout"],
      iconColor: "text-gray-500",
      bgColor: "bg-white",
      borderColor: "border-gray-200",
    },
    {
      no: 2,
      id: "rookie",
      name: "Rookie",
      minEarnings: 50,
      cpmBonus: 5,
      benefits: ["+5% CPM Bonus", "Priority Support", "Faster Withdrawal"],
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      no: 3,
      id: "elite",
      name: "Elite",
      minEarnings: 250,
      cpmBonus: 10,
      benefits: [
        "+10% CPM Bonus",
        "Daily Payout Request",
        "No Captcha for Users",
      ],
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      no: 4,
      id: "pro",
      name: "Pro",
      minEarnings: 1000,
      cpmBonus: 15,
      benefits: ["+15% CPM Bonus", "Dedicated Manager", "Custom Alias Domain"],
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      no: 5,
      id: "master",
      name: "Master",
      minEarnings: 5000,
      cpmBonus: 25,
      benefits: ["+25% CPM Bonus", "Instant Payout", "Exclusive Events"],
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      no: 6,
      id: "mythic",
      name: "Mythic",
      minEarnings: 20000,
      cpmBonus: 40,
      benefits: ["+40% CPM Bonus", "VIP Status", "Revenue Share 100%"],
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  ];
}

// ============== CRUD OPERATIONS ==============

// Update level configuration
export async function updateLevelConfig(
  levelId: string,
  updates: Partial<LevelConfig>
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // TODO: Replace with actual API call
  console.log('Updating level:', levelId, updates);
}

// Create new level
export async function createLevel(
  newLevel: Omit<LevelConfig, 'no'>
): Promise<LevelConfig> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // TODO: Replace with actual API call
  console.log('Creating level:', newLevel);
  return {
    ...newLevel,
    no: 7, // Will be assigned by backend
  };
}

// Delete level
export async function deleteLevel(levelId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // TODO: Replace with actual API call
  console.log('Deleting level:', levelId);
}
