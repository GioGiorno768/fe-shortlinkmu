"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Crown,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import type { AdLevelConfig, AdFeature } from "@/services/adLevelService";
import { formatCPM } from "@/services/adLevelService";
import { motion, AnimatePresence } from "motion/react";

interface AdLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  editingLevel?: AdLevelConfig | null;
  nextLevelNumber: number;
  isSubmitting: boolean;
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
}: AdLevelModalProps) {
  const [formData, setFormData] = useState({
    levelNumber: nextLevelNumber,
    name: "",
    description: "",
    revenueShare: 50,
    cpcRate: 0.005,
    colorTheme: "blue" as "green" | "blue" | "orange" | "red",
    isPopular: false,
    demoUrl: "",
  });

  const [features, setFeatures] = useState<AdFeature[]>([
    {
      id: "1",
      label: "Interstitial Ads",
      included: true,
      value: "1x per visit",
    },
  ]);

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
        isPopular: editingLevel.isPopular,
        demoUrl: editingLevel.demoUrl,
      });
      setFeatures(editingLevel.features);
    } else {
      setFormData({
        levelNumber: nextLevelNumber,
        name: "",
        description: "",
        revenueShare: 50,
        cpcRate: 0.005,
        colorTheme: "blue",
        isPopular: false,
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
    }
  }, [editingLevel, nextLevelNumber, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      features,
    };

    await onSubmit(data);
    onClose();
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        id: Date.now().toString(),
        label: "",
        included: true,
        value: "",
      },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<AdFeature>) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // Get current theme style
  const selectedTheme =
    COLOR_THEMES.find((t) => t.value === formData.colorTheme) ||
    COLOR_THEMES[1];

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

                  {/* Popular Toggle */}
                  <div
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isPopular: !formData.isPopular,
                      })
                    }
                    className={clsx(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      formData.isPopular
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {/* Check Icon */}
                    <div
                      className={clsx(
                        "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all shrink-0",
                        formData.isPopular
                          ? "bg-purple-500 border-purple-500"
                          : "bg-white border-gray-300"
                      )}
                    >
                      {formData.isPopular && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[1.3em] font-bold text-shortblack flex-1">
                      <Crown
                        className={clsx(
                          "w-5 h-5",
                          formData.isPopular
                            ? "text-purple-600"
                            : "text-gray-400"
                        )}
                      />
                      Mark as Popular
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

                  {/* Features */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[1.3em] font-bold text-shortblack">
                        Features ({features.length})
                      </label>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-[1.2em] font-medium hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="space-y-2 max-h-64 overflow-y-auto pr-2"
                    >
                      {features.map((feature, index) => (
                        <div
                          key={feature.id}
                          onClick={() =>
                            updateFeature(feature.id, {
                              included: !feature.included,
                            })
                          }
                          className={clsx(
                            "relative flex gap-3 items-start p-4 rounded-xl border-2 transition-all cursor-pointer group",
                            feature.included
                              ? "bg-green-50 border-green-200 hover:border-green-300"
                              : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {/* Check Icon */}
                          <div
                            className={clsx(
                              "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all shrink-0 mt-1",
                              feature.included
                                ? "bg-green-500 border-green-500"
                                : "bg-white border-gray-300 group-hover:border-gray-400"
                            )}
                          >
                            {feature.included && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>

                          {/* Input Fields */}
                          <div
                            className="flex-1 space-y-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={feature.label}
                              onChange={(e) =>
                                updateFeature(feature.id, {
                                  label: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[1.2em] focus:outline-none focus:border-bluelight focus:ring-2 focus:ring-bluelight/20"
                              placeholder="Feature name"
                              required
                            />
                            <input
                              type="text"
                              value={
                                typeof feature.value === "string"
                                  ? feature.value
                                  : ""
                              }
                              onChange={(e) =>
                                updateFeature(feature.id, {
                                  value: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[1.1em] focus:outline-none focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 text-grays"
                              placeholder="Optional value (e.g., '3x per day')"
                            />
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFeature(feature.id);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
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
                <div
                  className={clsx(
                    "relative w-full max-w-sm rounded-3xl p-8 transition-all duration-500 border-2 shadow-xl bg-white",
                    formData.isPopular
                      ? "border-bluelight shadow-blue-100 scale-105"
                      : "border-gray-100"
                  )}
                >
                  {/* Popular Badge */}
                  {formData.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bluelight text-white px-4 py-1 rounded-full text-[1.1em] font-semibold shadow-md flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>POPULAR</span>
                    </div>
                  )}

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
                      {features.slice(0, 3).map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-center gap-2 text-[1.2em]"
                        >
                          <div
                            className={clsx(
                              "w-1.5 h-1.5 rounded-full",
                              feature.included ? "bg-green-500" : "bg-gray-300"
                            )}
                          />
                          <span
                            className={
                              feature.included
                                ? "text-shortblack"
                                : "text-gray-400"
                            }
                          >
                            {feature.label || "Feature name"}
                          </span>
                        </div>
                      ))}
                      {features.length > 3 && (
                        <p className="text-[1.1em] text-grays italic">
                          +{features.length - 3} more...
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
