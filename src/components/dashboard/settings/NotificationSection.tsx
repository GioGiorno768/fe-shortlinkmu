"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Mail, ShieldAlert, Megaphone } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { NotificationSettings } from "@/types/type";

interface NotificationSectionProps {
  initialData: NotificationSettings | null;
}

export default function NotificationSection({
  initialData,
}: NotificationSectionProps) {
  const { showAlert } = useAlert();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailLogin: initialData?.emailLogin ?? true,
    emailWithdrawal: initialData?.emailWithdrawal ?? true,
    emailMarketing: initialData?.emailMarketing ?? false,
  });

  const handleToggle = async (key: keyof NotificationSettings) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });

    // === API CALL SAVE PREFERENCES ===
    console.log(
      `MANGGIL API: PUT /api/user/notifications { ${key}: ${newValue} }`
    );
    // showAlert("Preferensi disimpan.", "success"); // Optional alert biar ga spam
  };

  const items = [
    {
      key: "emailLogin",
      title: "Login Alert",
      desc: "Terima email saat ada login baru dari perangkat tidak dikenal.",
      icon: ShieldAlert,
    },
    {
      key: "emailWithdrawal",
      title: "Withdrawal Updates",
      desc: "Dapatkan notifikasi status permintaan penarikan dana Anda.",
      icon: Bell,
    },
    {
      key: "emailMarketing",
      title: "News & Offers",
      desc: "Berlangganan newsletter fitur baru dan promo menarik.",
      icon: Megaphone,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-[2em] font-bold text-shortblack mb-8 flex items-center gap-3">
        <Mail className="w-6 h-6 text-bluelight" />
        Email Notifications
      </h2>

      <div className="space-y-6">
        {items.map((item) => {
          const isActive = settings[item.key as keyof NotificationSettings];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="flex items-start gap-6">
                <div
                  className={`p-3 rounded-xl ${
                    isActive
                      ? "bg-blue-100 text-bluelight"
                      : "bg-gray-100 text-grays"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[1.6em] font-bold text-shortblack">
                    {item.title}
                  </h3>
                  <p className="text-[1.4em] text-grays max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() =>
                  handleToggle(item.key as keyof NotificationSettings)
                }
                className={`
                            relative w-14 h-8 rounded-full transition-colors duration-300
                            ${isActive ? "bg-bluelight" : "bg-gray-300"}
                        `}
              >
                <div
                  className={`
                            absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300
                            ${isActive ? "translate-x-6" : "translate-x-0"}
                        `}
                />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
