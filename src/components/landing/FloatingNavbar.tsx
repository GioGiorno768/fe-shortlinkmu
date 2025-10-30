"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FloatingNavbar() {
  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling 100vh (full screen height)
      if (window.scrollY > window.innerHeight) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setIsOpen(false);
        if (openMenu.current) {
          openMenu.current.checked = false;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Floating Navbar */}
      <nav
        className={`text-[10px] fixed bottom-[3em] left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "translate-y-[10em] opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-blue-950 text-white rounded-[2.5em] shadow-2xl backdrop-blur-md border border-white/10">
          {/* Desktop Navbar */}
          <div className="hidden lg:flex items-center gap-[3em] px-[3em] py-[1.5em]">
            <a href="#" className="flex items-center gap-[1em]">
              <div className="w-[2.5em] h-[2.5em] rounded-full bg-white"></div>
            </a>
            <div className="flex gap-[3em] items-center">
              <Link
                href="#"
                className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#faq"
                className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="#blog"
                className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
              >
                Contact
              </Link>
            </div>
            {/* <button className="ml-[2em]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[2.4em] h-[2.4em]"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button> */}
          </div>

          {/* Mobile Navbar */}
          <div className="lg:hidden flex items-center justify-between px-[2em] py-[1.5em]">
            <a href="#" className="flex items-center gap-[1em]">
              <div className="w-[2.5em] h-[2.5em] rounded-full bg-white"></div>
            </a>
            <label className="flex flex-col gap-[0.4em] w-[3.5em] h-[3.5em] justify-center items-center cursor-pointer border-[0.15em] border-white rounded-[0.8em] hover:bg-white/10 transition-all duration-200">
              <input
                className="peer hidden"
                type="checkbox"
                ref={openMenu}
                onChange={handleOpenMenu}
              />
              <span className="block h-[0.2em] w-[2em] bg-white rounded-full transition-all duration-300 ease-out peer-checked:rotate-45 peer-checked:translate-y-[0.6em]" />
              <span className="block h-[0.2em] w-[2em] bg-white rounded-full transition-all duration-300 ease-out peer-checked:opacity-0 peer-checked:scale-0" />
              <span className="block h-[0.2em] w-[2em] bg-white rounded-full transition-all duration-300 ease-out peer-checked:-rotate-45 peer-checked:-translate-y-[0.6em]" />
            </label>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-[50em] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-[2em] pb-[2em] flex flex-col gap-[1.5em] border-t border-white/10 pt-[2em]">
              <a
                href="#home"
                className="text-[1.6em] font-medium tracking-tight w-full px-[2em] py-[1em] rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Home
              </a>
              <a
                href="#portfolio"
                className="text-[1.6em] font-medium tracking-tight w-full px-[2em] py-[1em] rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Portfolio
              </a>
              <a
                href="#blog"
                className="text-[1.6em] font-medium tracking-tight w-full px-[2em] py-[1em] rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Blog
              </a>
              <a
                href="#about"
                className="text-[1.6em] font-medium tracking-tight w-full px-[2em] py-[1em] rounded-full transition-all duration-300 hover:bg-white/10"
              >
                About Me
              </a>
              <a
                href="#contact"
                className="text-[1.6em] font-medium tracking-tight w-full px-[2em] py-[1em] rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
