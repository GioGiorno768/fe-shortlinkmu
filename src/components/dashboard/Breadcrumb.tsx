// src/components/dashboard/Breadcrumb.tsx
"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Home,
  ChevronRight,
  LayoutDashboard,
  PlusSquare,
  ChartSpline,
  UserPlus2,
  BanknoteArrowDown,
  History,
  User,
  Settings,
  Link2, // Icon buat 'My Links' parent
} from "lucide-react";
import type { NavItem } from "@/types/type"; // Impor tipe NavItem
import { getMenuItems } from "./sidebar/Sidebar"; // Impor fungsi menu dari sidebar

export default function Breadcrumb() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  // Kita ambil definisi menu dari sidebar biar konsisten
  const menuItems = getMenuItems(t);

  // Ubah struktur menu jadi "kamus" (Map) biar gampang dicari
  const breadcrumbNameMap: {
    [key: string]: { label: string; icon: React.ElementType };
  } = {};

  // Fungsi rekursif untuk "meratakan" menu item (termasuk submenu)
  const flattenMenuItems = (items: NavItem[]) => {
    for (const item of items) {
      if (item.href) {
        // Ambil segmen terakhir dari href, cth: "/dashboard" -> "dashboard"
        const segment = item.href.split("/").pop();
        if (segment && !segment.includes("http")) {
          // Jangan masukkan link eksternal
          breadcrumbNameMap[segment] = { label: item.label, icon: item.icon };
        }
      }
      if (item.children) {
        // Jika punya anak (My Links), tambahkan juga mapping untuk parent-nya
        // Kita butuh key manual untuk parent
        if (item.label === t("myLinks")) {
          breadcrumbNameMap["my-links"] = {
            label: item.label,
            icon: item.icon,
          };
        }
        flattenMenuItems(item.children); // Rekursif ke anak
      }
    }
  };

  // Panggil fungsi untuk mengisi breadcrumbNameMap
  flattenMenuItems(menuItems);

  // Tambahkan mapping manual untuk parent 'My Links'
  // (karena dia gak punya href sendiri)
  breadcrumbNameMap["new-link"] = { label: t("createLink"), icon: PlusSquare };
  // (Anda bisa tambahkan halaman lain yang tidak ada di menu di sini)
  breadcrumbNameMap["profile"] = { label: t("myProfile"), icon: User };
  breadcrumbNameMap["settings"] = { label: t("settings"), icon: Settings };

  // Logika split path
  const pathSegments = pathname.split("/").filter(Boolean); // cth: ["dashboard"]

  // Dapatkan info halaman saat ini
  const currentSegment = pathSegments[pathSegments.length - 1] || "dashboard";
  const currentPageInfo = breadcrumbNameMap[currentSegment];
  const pageTitle = currentPageInfo ? currentPageInfo.label : "Dashboard";

  return (
    // Kita pakai class-class dari wrapper <div> lama lu
    <div className=" lg:text-[10px] text-[8px] font-figtree">
      <h1 className="lg:text-[1.8em] text-[2.3em] font-semibold text-shortblack">
        {pageTitle}
      </h1>

      <nav
        className="flex items-center  lg:text-[1.4em] text-[1.8em] text-grays"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2">
          {/* Link "Home" ke landing page */}
          <li>
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-bluelight transition-colors"
            >
              <Home className="w-[1em] h-[1em]" />
              <span>Home</span>
            </Link>
          </li>

          {/* Render segmen path dinamis */}
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const pageInfo = breadcrumbNameMap[segment];

            // Fallback jika halaman tidak ada di map
            const Icon = pageInfo?.icon || ChevronRight; // Default icon
            const label = pageInfo?.label || segment; // Default label

            // Jangan render segmen 'id' atau 'en'
            if (segment === "id" || segment === "en") return null;

            return (
              <li key={segment} className="flex items-center gap-2">
                <ChevronRight className="w-[1em] h-[1em] text-grays" />

                {isLast ? (
                  // Halaman terakhir (aktif)
                  <span className="flex items-center gap-2 text-gray-text ">
                    {pageInfo && <Icon className="w-[1em] h-[1em]" />}
                    <span>{label}</span>
                  </span>
                ) : (
                  // Halaman parent (bisa diklik)
                  <Link
                    href={href}
                    className="flex items-center gap-2 hover:text-bluelight transition-colors"
                  >
                    {pageInfo && <Icon className="w-[1em] h-[1em]" />}
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
