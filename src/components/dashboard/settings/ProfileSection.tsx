"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Loader2, Save } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { UserProfile } from "@/types/type";

interface ProfileSectionProps {
  initialData: UserProfile | null;
}

export default function ProfileSection({ initialData }: ProfileSectionProps) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    username: initialData?.username || "",
    avatarUrl: initialData?.avatarUrl || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler Ganti Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler Upload Foto (Simulasi)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Di sini nanti upload ke API, dapet URL baru
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatarUrl: fakeUrl });
      showAlert("Foto profil diperbarui (preview only)", "info");
    }
  };

  // Handler Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // === API CALL UPDATE PROFILE ===
    console.log("MANGGIL API: PUT /api/user/profile", formData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi
      showAlert("Profil berhasil diperbarui!", "success");
    } catch (error) {
      showAlert("Gagal menyimpan profil.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-[2em] font-bold text-shortblack mb-8">
        Profile Information
      </h2>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-blues border-4 border-white shadow-lg overflow-hidden">
              {/* Tampilkan avatar atau inisial */}
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-bluelight">
                  {formData.name.charAt(0)}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-3 bg-bluelight text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h3 className="text-[1.8em] font-bold text-shortblack">
              {formData.username}
            </h3>
            <p className="text-[1.4em] text-grays">
              Max file size is 5MB (JPG/PNG)
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]"
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
            disabled={isLoading}
            className="bg-bluelight text-white px-8 py-3 rounded-xl font-semibold text-[1.5em] hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
