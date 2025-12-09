"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import clsx from "clsx";
import type { GlobalFeature } from "@/services/adLevelService";

interface FeatureSelectorProps {
  features: GlobalFeature[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export default function FeatureSelector({
  features,
  selectedIds,
  onToggle,
  disabled = false,
}: FeatureSelectorProps) {
  const isSelected = (id: string) => selectedIds.includes(id);

  if (features.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-[1.4em] text-gray-400">
          No features available. Add features from the global feature
          management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((feature) => {
        const selected = isSelected(feature.id);

        return (
          <motion.div
            key={feature.id}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onToggle(feature.id)}
            className={clsx(
              "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
              selected
                ? "bg-blue-50 border-bluelight shadow-md"
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Checkmark Icon */}
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                  selected
                    ? "bg-bluelight text-white scale-100"
                    : "bg-gray-200 text-transparent scale-90"
                )}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>

              {/* Feature Info */}
              <div className="flex-1">
                <h4
                  className={clsx(
                    "text-[1.5em] font-semibold transition-colors",
                    selected ? "text-bluelight" : "text-gray-800"
                  )}
                >
                  {feature.name}
                </h4>
                {feature.description && (
                  <p className="text-[1.3em] text-gray-500 mt-1">
                    {feature.description}
                  </p>
                )}
              </div>

              {/* Selected Badge */}
              {selected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-bluelight text-white rounded-full text-[1.2em] font-medium shrink-0"
                >
                  Selected
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
