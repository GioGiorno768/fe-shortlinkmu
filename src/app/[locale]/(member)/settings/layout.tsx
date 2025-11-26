// src/app/[locale]/(member)/settings/layout.tsx
"use client";

import { Link, usePathname } from "@/i18n/routing";
import { User, Lock, CreditCard, Settings2 } from "lucide-react";
import clsx from "clsx";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Buat ngecek kita lagi di page mana

  // Mapping Tab ke URL Path
  const tabs = [
    { id: "profile", label: "Profile", icon: User, href: "/settings/profile" },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      href: "/settings/security",
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      href: "/settings/payment",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Settings2,
      href: "/settings/preferences",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-8">
        Account Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR (STICKY) */}
        <div className="w-full lg:w-[280px] flex-shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 z-20 sticky top-[15em]">
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {tabs.map((tab) => {
              // Cek apakah path sekarang mengandung href tab ini
              const isActive = pathname.includes(tab.href);

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={clsx(
                    "flex items-center sm:justify-baseline justify-center gap-4 sm:px-6 px-4 py-4 rounded-2xl transition-all whitespace-nowrap text-[1.4em] font-medium w-full",
                    isActive
                      ? "bg-bluelight text-white shadow-md shadow-blue-200"
                      : "text-grays hover:bg-blues hover:text-shortblack"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA (DYNAMIC) */}
        <div className="flex-1 w-full min-w-0">
          {/* Efek animasi transisi bisa ditambahin di template.tsx kalo mau */}
          {children}
        </div>
      </div>
    </div>
  );
}
