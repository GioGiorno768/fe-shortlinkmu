"use client";

import { useState, useEffect } from "react";
import { X, Crown, Check } from "lucide-react";
import clsx from "clsx";
import type {
  AdLevelConfig,
  AdFeature,
  GlobalFeature,
  CountryRate,
} from "@/services/adLevelService";
import { formatCPM } from "@/services/adLevelService";
import { motion, AnimatePresence } from "motion/react";
import FeatureSelector from "./FeatureSelector";
import CountryRateEditor from "./CountryRateEditor";

interface AdLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  editingLevel?: AdLevelConfig | null;
  nextLevelNumber: number;
  isSubmitting: boolean;
  globalFeatures: GlobalFeature[];
}

const COLOR_THEMES = [
  {
    value: "green",
    label: "Green",
    gradient: "from-emerald-500 to-green-600",
    icon: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    value: "blue",
    label: "Blue",
    gradient: "from-blue-500 to-indigo-600",
    icon: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    value: "orange",
    label: "Orange",
    gradient: "from-orange-500 to-amber-600",
    icon: "bg-orange-50",
    text: "text-orange-700",
  },
  {
    value: "red",
    label: "Red",
    gradient: "from-red-500 to-rose-600",
    icon: "bg-red-50",
    text: "text-red-700",
  },
] as const;

export default function AdLevelModal({
  isOpen,
  onClose,
  onSubmit,
  editingLevel,
  nextLevelNumber,
  isSubmitting,
  globalFeatures,
}: AdLevelModalProps) {
  const [formData, setFormData] = useState({
    levelNumber: nextLevelNumber,
    name: "",
    description: "",
    revenueShare: 50,
    cpcRate: 0.005,
    colorTheme: "blue" as "green" | "blue" | "orange" | "red",
    demoUrl: "",
  });

  // Legacy features (for backward compatibility)
  const [features, setFeatures] = useState<AdFeature[]>([
    {
      id: "1",
      label: "Interstitial Ads",
      included: true,
      value: "1x per visit",
    },
  ]);

  // New global features selection
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  // Country-specific CPC rates
  const [countryRates, setCountryRates] = useState<CountryRate[]>([]);

  // Initialize form with editing data
  useEffect(() => {
    if (editingLevel) {
      setFormData({
        levelNumber: editingLevel.levelNumber,
        name: editingLevel.name,
        description: editingLevel.description,
        revenueShare: editingLevel.revenueShare,
        cpcRate: editingLevel.cpcRate,
        colorTheme: editingLevel.colorTheme,
        demoUrl: editingLevel.demoUrl,
      });
      setFeatures(editingLevel.features);
      setEnabledFeatures(editingLevel.enabledFeatures || []);
      setCountryRates(editingLevel.countryRates || []);
    } else {
      setFormData({
        levelNumber: nextLevelNumber,
        name: "",
        description: "",
        revenueShare: 50,
        cpcRate: 0.005,
        colorTheme: "blue",
        demoUrl: "",
      });
      setFeatures([
        {
          id: "1",
          label: "Interstitial Ads",
          included: true,
          value: "1x per visit",
        },
      ]);
      setEnabledFeatures([]);
      setCountryRates([]);
    }
  }, [editingLevel, nextLevelNumber, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      isPopular: false, // Popular status is now controlled via button in card, not modal
      features, // Keep legacy features for backward compatibility
      enabledFeatures, // New global features
      countryRates, // Per-country CPC rates
    };

    await onSubmit(data);
    onClose();
  };

  const toggleFeature = (id: string) => {
    setEnabledFeatures((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Get current theme style
  const selectedTheme =
    COLOR_THEMES.find((t) => t.value === formData.colorTheme) ||
    COLOR_THEMES[1];

  // Get enabled feature names for preview
  const enabledFeatureNames = globalFeatures
    .filter((f) => enabledFeatures.includes(f.id))
    .map((f) => f.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 h-screen bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh] font-figtree text-[10px]"
            >
              {/* LEFT: Form */}
              <div
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 p-8 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-[2.2em] font-bold text-shortblack">
                      {editingLevel ? "Edit Ad Level" : "New Ad Level"}
                    </h2>
                    <p className="text-[1.3em] text-grays mt-1">
                      Configure monetization settings for users
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-grays" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                        Level #
                      </label>
                      <input
                        type="number"
                        value={formData.levelNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            levelNumber: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]"
                        placeholder="e.g., Medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em] resize-none"
                      rows={2}
                      placeholder="Brief description..."
                      required
                    />
                  </div>

                  {/* Revenue & CPC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                        Revenue Share (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.revenueShare}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              revenueShare: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]"
                          required
                          min="0"
                          max="100"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[1.2em] text-grays font-medium">
                          %
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[1.3em] font-bold text-shortblack mb-2 flex justify-between">
                        <span>CPC Rate ($)</span>
                        <span className="text-bluelight font-semibold">
                          CPM: {formatCPM(formData.cpcRate)}
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.cpcRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cpcRate: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]"
                        placeholder="0.005"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Country-Specific CPC Rates */}
                  <CountryRateEditor
                    countryRates={countryRates}
                    onChange={setCountryRates}
                    defaultCpcRate={formData.cpcRate}
                    disabled={isSubmitting}
                  />

                  {/* Color Theme */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-3">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {COLOR_THEMES.map((theme) => (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              colorTheme: theme.value,
                            })
                          }
                          className={clsx(
                            "p-4 rounded-2xl border-2 transition-all group relative overflow-hidden",
                            formData.colorTheme === theme.value
                              ? "border-shortblack shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className={clsx(
                              "w-full h-12 rounded-xl mb-2 bg-gradient-to-br",
                              theme.gradient
                            )}
                          />
                          <p className="text-[1.2em] font-bold text-shortblack">
                            {theme.label}
                          </p>
                          {formData.colorTheme === theme.value && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-shortblack rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article/Demo URL */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-2">
                      Article/Demo Page URL
                    </label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, demoUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-bluelight focus:bg-white focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]"
                      placeholder="https://artikel.shortlink.com/demo-level-1"
                    />
                    <p className="text-[1.1em] text-grays mt-2">
                      Link to article page with ads setup (separate project)
                    </p>
                  </div>

                  {/* Global Features Selector */}
                  <div>
                    <label className="block text-[1.3em] font-bold text-shortblack mb-3">
                      Features ({enabledFeatures.length} selected)
                    </label>
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="max-h-80 overflow-y-auto pr-2"
                    >
                      <FeatureSelector
                        features={globalFeatures}
                        selectedIds={enabledFeatures}
                        onToggle={toggleFeature}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-shortblack to-gray-800 text-white py-4 rounded-2xl font-bold text-[1.6em] hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingLevel
                        ? "Update Level"
                        : "Create Level"}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Live Preview */}
              <div className="hidden md:flex flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 flex-col items-center justify-center border-l border-gray-200">
                <h3 className="text-[1.5em] font-bold text-gray-400 mb-8 uppercase tracking-wider">
                  Live Preview
                </h3>

                {/* Card Preview (matching ads-info display) */}
                <div className="relative w-full max-w-sm rounded-3xl p-8 transition-all duration-500 border-2 shadow-xl bg-white border-gray-100">
                  {/* Popular Badge - Not shown in preview since it's controlled via button */}

                  {/* Header */}
                  <div className="text-center mb-6">
                    <div
                      className={clsx(
                        "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
                        selectedTheme.icon
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[2.5em] font-bold",
                          selectedTheme.text
                        )}
                      >
                        {formData.levelNumber}
                      </span>
                    </div>
                    <h3 className="text-[2.2em] font-bold text-shortblack mb-2">
                      {formData.name || "Level Name"}
                    </h3>
                    <p className="text-[1.3em] text-grays leading-snug min-h-[3em]">
                      {formData.description ||
                        "Your description will appear here"}
                    </p>
                  </div>

                  {/* Revenue Info */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center space-y-2">
                    <div className="flex justify-center items-baseline gap-1">
                      <span className="text-[2.8em] font-bold text-shortblack">
                        {formData.revenueShare}%
                      </span>
                      <span className="text-[1.2em] text-grays font-medium">
                        Revenue
                      </span>
                    </div>
                    <p className="text-[1.2em] text-bluelight font-medium">
                      CPM: {formatCPM(formData.cpcRate)}
                    </p>
                  </div>

                  {/* Features Preview */}
                  <div className="mb-4">
                    <p className="text-[1.2em] font-semibold text-shortblack mb-3">
                      Features
                    </p>
                    <div className="space-y-2">
                      {enabledFeatureNames.length > 0 ? (
                        <>
                          {enabledFeatureNames.slice(0, 3).map((name, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-[1.2em]"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span className="text-shortblack">{name}</span>
                            </div>
                          ))}
                          {enabledFeatureNames.length > 3 && (
                            <p className="text-[1.1em] text-grays italic">
                              +{enabledFeatureNames.length - 3} more...
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-[1.2em] text-gray-400 italic">
                          No features selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-gray-400 text-center max-w-xs text-[1.2em]">
                  This is how the level will appear on user ads-info page.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
