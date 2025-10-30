"use client";

import { useRef, useState } from "react";

export default function Navbar() {
  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  return (
    <>
      <nav className="text-[10px] fixed lg:relative w-full lg:bg-transparent font-figtree bg-white/95 lg:backdrop-blur-none backdrop-blur-md lg:shadow-none shadow-sm">
        <div className="max-w-[140em] px-[1.6em] lg:px-[2.4em]  m-auto py-[1.6em] lg:py-[3em] flex justify-between items-center">
          <div className="flex items-center gap-[2em]">
            <div className="w-[3em] h-[3em] rounded-full bg-bluelight"></div>
            <a
              href="#"
              className="text-[2em] text-bluelight font-semibold tracking-tight"
            >
              Shortlinkmu
            </a>
          </div>
          <div className="lg:flex hidden gap-[5em] items-center">
            <a href="#features" className="text-[1.8em] font-semibold tracking-tight">
              Features
            </a>
            <a href="#faq" className="text-[1.8em] font-semibold tracking-tight">
              FAQ
            </a>
            <a href="#contact" className="text-[1.8em] font-semibold tracking-tight">
              Contact
            </a>
          </div>
          <div className="items-center gap-[4em] hidden lg:flex">
            <button className="flex items-center gap-[1em] ">
              <span className="tabler--world w-[2.5em] h-[2.5em] bg-white"></span>
              <span className="text-[1.6em] font-semibold text-white">
                EN
              </span>
            </button>
            <button className="text-[1.6em] font-semibold tracking-tight text-white">
              Login
            </button>
            <button className="text-[1.6em] font-semibold tracking-tight bg-white text-bluelight px-[1.5em] py-[.5em] rounded-full">
              Register
            </button>
          </div>
          <div className="lg:hidden static">
            <label className="flex flex-col gap-2 w-8">
              <input
                className="peer hidden"
                type="checkbox"
                ref={openMenu}
                onChange={handleOpenMenu}
              />
              <div className="rounded-2xl h-[3px] w-1/2 bg-black duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]" />
              <div className="rounded-2xl h-[3px] w-full bg-black duration-500 peer-checked:-rotate-45" />
              <div className="rounded-2xl h-[3px] w-1/2 bg-black duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]" />
            </label>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-[2em] max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto bg-white/95 backdrop-blur-md lg:hidden flex flex-col items-start gap-[1.5em] border-t border-gray-100">
            <a
              href="#"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blue-50 text-bluelight py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "0ms" }}
            >
              Features
            </a>
            <a
              href="#"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "100ms" }}
            >
              FAQ
            </a>
            <a
              href="#"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full transition-all duration-300 hover:bg-blues hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transform"
              style={{ animationDelay: "200ms" }}
            >
              Contact
            </a>
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
