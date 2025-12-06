import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Megaphone,
  Wallet,
  Star,
  Zap,
  Check,
  ChevronRight,
} from "lucide-react";
import type { AdminAnnouncement } from "@/types/type";
import { motion, AnimatePresence } from "motion/react";

// --- CONSTANTS ---
const ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Megaphone", icon: Megaphone },
  { name: "Wallet", icon: Wallet },
  { name: "Star", icon: Star },
  { name: "Zap", icon: Zap },
];

const THEMES = [
  {
    name: "blue",
    bg: "bg-gradient-to-br from-[#6b21a8] to-[#a855f7]",
    text: "text-white",
    buttonText: " text-purple-500 ",
  },
  {
    name: "purple",
    bg: "bg-gradient-to-br from-[#c2410c] to-[#fb923c]",
    text: "text-white",
    buttonText: "text-orange-500",
  },
  {
    name: "orange",
    bg: "bg-gradient-to-br from-bluelight to-blue-600",
    text: "text-white",
    buttonText: "text-bluelight",
  },
];

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: AdminAnnouncement | null;
  isSubmitting: boolean;
}

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: CreateAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    cta: "",
    link: "",
    icon: "Sparkles",
    theme: "blue" as "blue" | "purple" | "orange",
    scheduledFor: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        desc: initialData.desc,
        cta: initialData.cta,
        link: initialData.link,
        icon: initialData.icon,
        theme: initialData.theme,
        scheduledFor: initialData.scheduledFor
          ? initialData.scheduledFor.slice(0, 16)
          : "",
      });
    } else {
      setFormData({
        title: "",
        desc: "",
        cta: "",
        link: "",
        icon: "Sparkles",
        theme: "blue",
        scheduledFor: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      status: formData.scheduledFor
        ? "scheduled"
        : initialData?.status || "active",
      scheduledFor: formData.scheduledFor
        ? new Date(formData.scheduledFor).toISOString()
        : undefined,
    };

    await onSubmit(finalData);
    onClose();
  };

  // Preview Component Logic
  const SelectedIcon =
    ICONS.find((i) => i.name === formData.icon)?.icon || Sparkles;
  const selectedTheme =
    THEMES.find((t) => t.name === formData.theme) || THEMES[0];

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 h-screen"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh]">
              {/* LEFT: Form */}
              <div onWheel={(e) => e.stopPropagation()} className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[2em] font-bold text-shortblack">
                    {initialData ? "Edit Announcement" : "New Announcement"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.4em]"
                      placeholder="e.g. Welcome Back!"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData({ ...formData, desc: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.4em]"
                      placeholder="Short description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* CTA Label */}
                    <div>
                      <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                        Button Label
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cta}
                        onChange={(e) =>
                          setFormData({ ...formData, cta: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.4em]"
                        placeholder="e.g. Check Now"
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                        Target URL
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.4em]"
                        placeholder="e.g. /settings"
                      />
                    </div>
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                      Icon
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      {ICONS.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, icon: item.name })
                          }
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.icon === item.name
                              ? "border-bluelight bg-blue-50 text-bluelight"
                              : "border-gray-100 hover:border-gray-200 text-gray-400"
                          }`}
                        >
                          <item.icon className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Picker */}
                  <div>
                    <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                      Theme Color
                    </label>
                    <div className="flex gap-4">
                      {THEMES.map((t) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, theme: t.name as any })
                          }
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            t.bg
                          } ${
                            formData.theme === t.name
                              ? "ring-4 ring-offset-2 ring-gray-200 scale-110"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          {formData.theme === t.name && (
                            <Check className="w-6 h-6 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Picker */}
                  <div>
                    <label className="block text-[1.4em] font-medium text-shortblack mb-2">
                      Schedule Publish (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledFor: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.4em]"
                    />
                    <p className="text-gray-400 text-[1.1em] mt-1">
                      Leave empty to publish immediately.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-shortblack text-white py-4 rounded-xl font-bold text-[1.6em] hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : initialData
                        ? "Update Announcement"
                        : "Create Announcement"}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Live Preview */}
              <div className="hidden md:flex flex-1 bg-gray-50 p-8 flex-col items-center justify-center border-l border-gray-100">
                <h3 className="text-[1.4em] font-bold text-gray-400 mb-8 uppercase tracking-wider">
                  Live Preview
                </h3>

                {/* Card Preview (Mirrors DashboardSlider) */}
                <div
                  className={`relative w-full max-w-md rounded-[2.5em] p-8 overflow-hidden shadow-xl transition-all duration-500 ${selectedTheme.bg} ${selectedTheme.text}`}
                >
                  {/* Watermark Icon */}
                  <SelectedIcon className="absolute -right-4 top-1/2 -translate-y-1/2 w-48 h-48 text-white/10 rotate-12" />

                  <div className="relative z-10 h-full flex flex-col justify-between mb-4">
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                        <SelectedIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium">
                        Info Terbaru
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mt-auto mb-6">
                      <h3 className="text-2xl font-bold leading-tight line-clamp-1">
                        {formData.title || "Your Title Here"}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2 leading-relaxed">
                        {formData.desc ||
                          "Your description will appear here. Make it catchy and informative!"}
                      </p>
                    </div>

                    {/* Footer: CTA + Dots */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-2 text-sm font-bold bg-white ${
                          (selectedTheme as any).buttonText
                        } px-6 py-3 rounded-2xl shadow-lg cursor-default transition-transform hover:scale-105`}
                      >
                        {formData.cta || "Check Now"}
                        <ChevronRight className="w-4 h-4" />
                      </div>

                      {/* Pagination Dots (Visual) */}
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                        <div className="w-8 h-2.5 rounded-full bg-white" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-gray-400 text-center max-w-xs text-sm">
                  This is how the announcement will appear on the user
                  dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
