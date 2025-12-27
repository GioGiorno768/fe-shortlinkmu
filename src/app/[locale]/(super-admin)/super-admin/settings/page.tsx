// src/app/[locale]/(super-admin)/super-admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Link2, Users, Settings2, Megaphone } from "lucide-react";
import clsx from "clsx";

// Section Components
import WithdrawalSettingsSection from "@/components/dashboard/super-admin/settings/WithdrawalSettingsSection";
import GlobalAlert from "@/components/dashboard/GlobalAlert";

// Tab Config
const TABS = [
  { id: "withdrawal", label: "Withdrawal", icon: CreditCard, disabled: false },
  { id: "links", label: "Links", icon: Link2, disabled: true },
  { id: "referral", label: "Referral", icon: Users, disabled: true },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    disabled: true,
  },
  { id: "general", label: "General", icon: Settings2, disabled: true },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SuperAdminSettingsPage() {
  // Get initial tab from URL hash
  const getInitialTab = (): TabId => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === hash && !t.disabled)) return hash as TabId;
    }
    return "withdrawal";
  };

  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);

  // Sync URL hash with active tab
  const handleTabChange = (tabId: TabId) => {
    const tab = TABS.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    setActiveTab(tabId);
    window.history.replaceState(null, "", `#${tabId}`);
  };

  // Listen for hash changes
  useEffect(() => {
    const initialHash = window.location.hash.slice(1);
    if (initialHash && TABS.some((t) => t.id === initialHash && !t.disabled)) {
      setActiveTab(initialHash as TabId);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === hash && !t.disabled)) {
        setActiveTab(hash as TabId);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-2">
        Platform Settings
      </h1>
      <p className="text-[1.4em] text-grays mb-8">
        Manage platform-wide configurations and features
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR (STICKY) */}
        <div className="w-full lg:w-[280px] flex-shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 z-20 sticky sm:top-[15em] top-[10em]">
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDisabled = tab.disabled;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={isDisabled}
                  className={clsx(
                    "flex items-center sm:justify-start justify-center gap-3 sm:px-5 px-4 py-3.5 rounded-2xl transition-all whitespace-nowrap text-[1.4em] font-medium w-full",
                    isActive
                      ? "bg-bluelight text-white shadow-md shadow-blue-200"
                      : isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-grays hover:bg-blues hover:text-shortblack"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {isDisabled && (
                    <span className="ml-auto text-[0.8em] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full hidden sm:block">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100"
            >
              {activeTab === "withdrawal" && <WithdrawalSettingsSection />}

              {activeTab === "links" && (
                <div className="text-center py-12">
                  <Link2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[1.6em] font-semibold text-gray-400">
                    Link Settings
                  </p>
                  <p className="text-[1.3em] text-gray-300 mt-1">
                    Coming soon...
                  </p>
                </div>
              )}

              {activeTab === "referral" && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[1.6em] font-semibold text-gray-400">
                    Referral Settings
                  </p>
                  <p className="text-[1.3em] text-gray-300 mt-1">
                    Coming soon...
                  </p>
                </div>
              )}

              {activeTab === "announcements" && (
                <div className="text-center py-12">
                  <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[1.6em] font-semibold text-gray-400">
                    Announcements
                  </p>
                  <p className="text-[1.3em] text-gray-300 mt-1">
                    Coming soon...
                  </p>
                </div>
              )}

              {activeTab === "general" && (
                <div className="text-center py-12">
                  <Settings2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[1.6em] font-semibold text-gray-400">
                    General Settings
                  </p>
                  <p className="text-[1.3em] text-gray-300 mt-1">
                    Coming soon...
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Alert for toast notifications */}
      <GlobalAlert />
    </div>
  );
}
