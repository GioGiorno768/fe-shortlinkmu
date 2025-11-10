"use client";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavItem } from "@/types/type";
import { Link } from "@/i18n/routing";

// Kita pisah biar rapi, karena logikanya jadi agak kompleks
export default function SidebarItem({
  item,
  isCollapsed,
  isActive,
  isChildActive,
  onClose,
}: {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  isChildActive: boolean;
  onClose: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(isChildActive);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const pathname = usePathname();

  // Efek buat nutup popup kalo diklik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // Efek buat nutup popup/dropdown kalo sidebar di-toggle
  useEffect(() => {
    if (isCollapsed) {
      setIsDropdownOpen(false); // Tutup dropdown inline
    } else {
      setIsPopupOpen(false); // Tutup popup
    }
  }, [isCollapsed]);

  // === 1. JIKA ITEM PUNYA ANAK (DROPDOWN / POPUP) ===
  if (item.children) {
    return (
      <div ref={ref} className="relative mb-1">
        {/* Tombol Parent (My Links) */}
        <button
          onClick={() => {
            if (isCollapsed) {
              setIsPopupOpen(!isPopupOpen); // Toggle popup
            } else {
              setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown inline
            }
          }}
          className={`
            flex items-center justify-between w-full gap-3 px-[3em] py-3 rounded-md
            transition-all duration-200
            ${isChildActive ? "text-white" : "text-slate-400"}
            ${
              isCollapsed
                ? "justify-center"
                : "hover:bg-[#1f2545] hover:text-white"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} flex-shrink-0`}
            />
            {!isCollapsed && (
              <span className="font-medium text-[1.6em] line-clamp-1">
                {item.label}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Transisi Dropdown (Mode Expanded) */}
        {!isCollapsed && (
          <div
            className={`
              grid transition-all duration-300 ease-in-out
              ${
                isDropdownOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="mt-1 ml-[3em] pl-[1.5em] border-l border-slate-700">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive =
                    pathname === child.href || pathname === `/id${child.href}`;
                  return (
                    <Link
                      key={child.href}
                      href={child.href!}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md mt-1
                        transition-all duration-200 text-[1.5em]
                        ${
                          isChildActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                        }
                      `}
                    >
                      <ChildIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">
                        {child.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Popup Flyout (Mode Collapsed) */}
        {isCollapsed && isPopupOpen && (
          <div
            className="
              absolute left-full top-0 ml-[1.5em] z-50
              bg-[#10052C] shadow-lg rounded-md p-2
              w-max animate-in fade-in-0 slide-in-from-left-2 duration-150
            "
          >
            {/* <div className="text-white text-[1.4em] font-medium px-3 pt-2 pb-1">
              {item.label}
            </div> */}
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive =
                pathname === child.href || pathname === `/id${child.href}`;
              return (
                <Link
                  key={child.href}
                  href={child.href!}
                  onClick={() => {
                    onClose();
                    setIsPopupOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md mt-1
                    transition-all duration-200 text-[1.4em] w-full
                    ${
                      isChildActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                    }
                  `}
                >
                  <ChildIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium line-clamp-1">
                    {child.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  //  === 2. JIKA ITEM BIASA (LINK LANGSUNG) ===
  return (
    <Link
      key={item.href}
      href={item.href!}
      onClick={onClose}
      className={`
        flex items-center gap-3 px-[3em] py-3 rounded-md mb-1
        transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <Icon
        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} flex-shrink-0`}
      />
      {!isCollapsed && (
        <span className="font-medium text-[1.6em] line-clamp-1">
          {item.label}
        </span>
      )}
    </Link>
  );
}
