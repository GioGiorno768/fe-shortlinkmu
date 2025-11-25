"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2, User, Lock, CreditCard, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation"; // <-- 1. IMPORT INI
import clsx from "clsx";

import type {
  UserProfile,
  SecuritySettings,
  PaymentMethod,
  NotificationSettings,
  SavedPaymentMethod,
} from "@/types/type";
import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import SecuritySection from "@/components/dashboard/settings/SecuritySection";
import PaymentSection from "@/components/dashboard/settings/PaymentSection";
import NotificationSection from "@/components/dashboard/settings/NotificationSection";

// ... (Fungsi fetchUserSettings SAMA AJA) ...
async function fetchUserSettings() {
  console.log("MANGGIL API: /api/user/settings/all");
  await new Promise((r) => setTimeout(r, 800));
  return {
    // ... (data dummy sama)
    profile: {
      name: "Kevin Ragil",
      email: "kevinragil768@gmail.com",
      phone: "08123456789",
      avatarUrl: "",
      username: "Narancia",
    } as UserProfile,
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: "2025-10-01",
      isSocialLogin: false, // <--- SET 'true' KALAU MAU SIMULASI USER GOOGLE
    } as SecuritySettings,
    paymentMethods: [
      {
        id: "pm-1",
        provider: "PayPal",
        accountName: "Kevin Ragil",
        accountNumber: "kevin@example.com",
        isDefault: true,
        category: "wallet",
      },
      {
        id: "pm-2",
        provider: "BCA",
        accountName: "Kevin Ragil",
        accountNumber: "82137123",
        isDefault: false,
        category: "bank",
      },
    ] as SavedPaymentMethod[], // <-- Casting ke tipe baru
    notifications: {
      emailLogin: true,
      emailWithdrawal: true,
      emailMarketing: false,
    } as NotificationSettings,
  };
}

export default function SettingsPage() {
  const { showAlert } = useAlert();
  const searchParams = useSearchParams(); // <-- 2. AMBIL SEARCH PARAMS

  const [isLoading, setIsLoading] = useState(true);

  // 3. LOGIC PENENTUAN TAB AWAL
  // Cek apakah ada param 'tab' di URL, kalau ada dan valid pake itu, kalau nggak default 'profile'
  const initialTab = searchParams.get("tab");
  const validTabs = ["profile", "security", "payment", "notifications"];

  const [activeTab, setActiveTab] = useState(
    validTabs.includes(initialTab || "") ? initialTab! : "profile"
  );

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchUserSettings();
        setData(response);
      } catch (err) {
        showAlert("Gagal memuat pengaturan.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  // ... (SISANYA SAMA PERSIS) ...

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-8">
        Account Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-[280px] flex-shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 z-20 sticky top-[15em]">
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} // <-- Ini cuma ganti state lokal
                className={clsx(
                  "flex items-center sm:justify-baseline justify-center gap-4 sm:px-6 px-4 py-4 rounded-2xl transition-all whitespace-nowrap text-[1.4em] font-medium w-full",
                  activeTab === tab.id
                    ? "bg-bluelight text-white shadow-md shadow-blue-200"
                    : "text-grays hover:bg-blues hover:text-shortblack"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && (
                <ProfileSection initialData={data?.profile} />
              )}
              {activeTab === "security" && (
                <SecuritySection initialData={data?.security} />
              )}
              {/* 👇 PASSING DATA LEWAT PROPS */}
              {activeTab === "payment" && (
                <PaymentSection initialMethods={data?.paymentMethods || []} />
              )}
              {activeTab === "notifications" && (
                <NotificationSection initialData={data?.notifications} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
