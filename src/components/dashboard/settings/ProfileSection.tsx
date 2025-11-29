// src/components/dashboard/settings/ProfileSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Loader2, Save } from "lucide-react";
import type { UserProfile } from "@/types/type";
import Image from "next/image";
import AvatarSelectionModal from "./AvatarSelectionModal";
import { useProfileLogic } from "@/hooks/useSettings"; // Pake Hook baru

interface ProfileSectionProps {
  initialData: UserProfile | null;
}

export default function ProfileSection({ initialData }: ProfileSectionProps) {
  const { updateProfile, isUpdating } = useProfileLogic();

  // State Modal Avatar
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // State Form
  const [formData, setFormData] = useState<UserProfile>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    username: initialData?.username || "",
    avatarUrl:
      initialData?.avatarUrl || "https://avatar.iran.liara.run/public/35",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (newUrl: string) => {
    setFormData({ ...formData, avatarUrl: newUrl });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 font-figtree"
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-8">
          Profile Information
        </h2>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-blues border-4 border-white shadow-lg overflow-hidden relative">
                <Image
                  src={formData.avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 p-3 bg-bluelight text-white rounded-full shadow-md hover:bg-blue-700 transition-colors z-10"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-[1.8em] font-bold text-shortblack">
                {formData.username}
              </h3>
              <p className="text-[1.4em] text-grays">
                Klik ikon kamera untuk mengganti avatar.
              </p>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none text-[1.5em] text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-bluelight text-white px-8 py-3 rounded-xl font-semibold text-[1.5em] hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      {/* Modal Avatar */}
      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={formData.avatarUrl}
        onSelect={handleAvatarSelect}
      />
    </>
  );
}
