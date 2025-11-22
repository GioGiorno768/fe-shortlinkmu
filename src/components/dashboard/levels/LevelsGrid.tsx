"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Star,
  Trophy,
  Gem,
  Rocket,
  Crown,
  Check,
  Lock,
} from "lucide-react";
import clsx from "clsx";
import type { UserLevel, LevelConfig } from "@/types/type";

interface LevelsGridProps {
  currentLevel: UserLevel;
}

// Config Data Statis (Bisa dipindah ke database nanti)
const LEVELS: LevelConfig[] = [
  {
    no: 1,
    id: "beginner",
    name: "Beginner",
    minEarnings: 0, // $0
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
    minEarnings: 50, // $50 (Setara +/- 10-20k views indo)
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
    minEarnings: 250, // $250
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
    minEarnings: 1000, // $1,000
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
    minEarnings: 5000, // $5,000
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
    minEarnings: 20000, // $20,000
    cpmBonus: 40,
    benefits: ["+40% CPM Bonus", "VIP Status", "Revenue Share 100%"],
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
];

// Helper Icon
const getIcon = (id: UserLevel) => {
  switch (id) {
    case "beginner":
      return Shield;
    case "rookie":
      return Star;
    case "elite":
      return Trophy;
    case "pro":
      return Gem;
    case "master":
      return Rocket;
    case "mythic":
      return Crown;
    default:
      return Shield;
  }
};

export default function LevelsGrid({ currentLevel }: LevelsGridProps) {
  // Cari index level user sekarang buat logic "Locked"
  const currentIndex = LEVELS.findIndex((l) => l.id === currentLevel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {LEVELS.map((level, index) => {
        const isUnlocked = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = getIcon(level.id);
        console.log(isUnlocked);

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl p-8 border-2 transition-all duration-300 ${
              isUnlocked
                ? "bg-white border-gray-200 shadow-lg"
                : "bg-gray-50 border-gray-200/50 shadow-sm"
            }`}
          >
            {/* Badge Status */}
            {isCurrent && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bluelight text-white px-4 py-1 rounded-full text-[1.2em] font-bold shadow-lg">
                CURRENT LEVEL
              </div>
            )}
            {!isUnlocked && (
              <div className="absolute top-4 right-4 text-gray-400">
                <Lock className="w-6 h-6" />
              </div>
            )}

            {/* Header Card */}
            <div className="text-center mb-6">
              <div
                className={clsx(
                  "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner",
                  level.bgColor
                )}
              >
                <Icon
                  className={clsx("w-10 h-10", level.iconColor)}
                  fill={level.id === "mythic" ? "currentColor" : "none"}
                />
              </div>
              <h3 className="text-[2.2em] font-bold text-shortblack mb-1">
                {level.name}
              </h3>
              <p className="text-[1.4em] text-grays">
                Min. Earnings ${level.minEarnings.toLocaleString()}
              </p>
            </div>

            {/* CPM Bonus Highlight */}
            <div className="bg-slate-50 rounded-xl p-4 text-center mb-6 border border-gray-100">
              <p className="text-[1.2em] text-grays uppercase font-semibold tracking-wider">
                CPM Bonus
              </p>
              <p className={clsx("text-[2.4em] font-bold", level.iconColor)}>
                +{level.cpmBonus}%
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-3">
              {level.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-[1.4em]">
                  <div
                    className={clsx(
                      "p-1 rounded-full flex-shrink-0 mt-0.5",
                      isUnlocked
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span
                    className={isUnlocked ? "text-shortblack" : "text-gray-500"}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
