"use client";

import { Link, usePathname } from "@/i18n/routing";
import { User, Settings2 } from "lucide-react";
import clsx from "clsx";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/admin/settings/profile",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Settings2,
      href: "/admin/settings/preferences",
    },
  ];

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-8">
        Admin Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR (STICKY) */}
        <div className="w-full lg:w-[280px] shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 z-20 sticky sm:top-[15em] top-[10em]">
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {tabs.map((tab) => {
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

        {/* CONTENT AREA */}
        <div className="flex-1 w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}
