"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function Navbar() {
  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  return (
    <>
      <nav className="text-[10px] fixed lg:relative w-full lg:bg-transparent font-figtree bg-white/95 lg:backdrop-blur-none backdrop-blur-md lg:shadow-none shadow-sm">
        <div className="max-w-[140em] px-[1.6em] lg:px-[2.4em]  m-auto py-[1.6em] lg:py-[3em] flex justify-between items-center">
          <div className="flex items-center gap-[2em]">
            <div className="w-[3em] h-[3em] rounded-full bg-bluelight"></div>
            <Link
              href="/"
              className="text-[2em] text-bluelight font-semibold tracking-tight"
            >
              Shortlinkmu
            </Link>
          </div>
          <div className="lg:flex hidden gap-[5em] items-center">
            <Link
              href="/payout-rates"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              Payout Rates
            </Link>
            <Link
              href="/about"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              Contact
            </Link>
          </div>
          <div className="items-center gap-[4em] hidden lg:flex">
            <button className="flex items-center gap-[1em] ">
              <span
                className={`tabler--world w-[2.5em] h-[2.5em] ${
                  path == "/" ? "bg-white" : "bg-bluelight"
                }`}
              ></span>
              <span
                className={`text-[1.6em] font-semibold tracking-tight ${
                  path == "/" ? "text-white" : "text-bluelight"
                }`}
              >
                EN
              </span>
            </button>
            <Link
              href="/login"
              className={`text-[1.6em] font-semibold tracking-tight ${
                path != "/" ? "text-bluelight" : "text-white"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`text-[1.6em] font-semibold tracking-tight ${
                path != "/"
                  ? "bg-bluelight text-white"
                  : "bg-white text-bluelight"
              } px-[1.5em] py-[.5em] rounded-full`}
            >
              Register
            </Link>
          </div>
          <div className="lg:hidden static">
            <label className="flex flex-col gap-[0.4em] w-[3.5em] h-[3.5em] justify-center items-center cursor-pointer border-[0.15em] border-bluelight rounded-[0.8em] hover:bg-bluelight/5 transition-all duration-200">
              <input
                className="peer hidden"
                type="checkbox"
                ref={openMenu}
                onChange={handleOpenMenu}
              />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:rotate-45 peer-checked:translate-y-[0.6em]" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:opacity-0 peer-checked:scale-0" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:-rotate-45 peer-checked:-translate-y-[0.6em]" />
            </label>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-[2em] max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto bg-white/95 backdrop-blur-md lg:hidden flex flex-col items-start gap-[1.5em] border-t border-gray-100">
            <Link
              href="/payout-rates"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blue-50 text-bluelight py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "0ms" }}
            >
              Payout Rates
            </Link>
            <Link
              href="/about"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "100ms" }}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "200ms" }}
            >
              Contact
            </Link>
            <div className="w-full border-t border-gray-200 my-[1em]"></div>
            <div className="flex items-center gap-[3em] justify-stretch w-full">
              <button className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-gray-50 text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform">
                Login
              </button>
              <button className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blues text-bluelight py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02] transform">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
