"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "motion/react";

export default function FloatingNavbar() {
  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const { scrollY } = useScroll();

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
      {/* Fixed Floating Navbar with Framer Motion */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.6,
            }}
            className="text-[10px] fixed bottom-[2em] left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              className="bg-blue-950 text-white rounded-[2.5em] shadow-2xl backdrop-blur-md border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Desktop Navbar */}
              <div className="hidden lg:flex items-center gap-[3em] px-[3em] py-[1.5em]">
                <motion.a
                  href="#"
                  className="flex items-center gap-[1em]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-[2.5em] h-[2.5em] rounded-full bg-white"></div>
                </motion.a>
                <div className="flex gap-[3em] items-center">
                  <motion.a
                    href="#"
                    className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Home
                  </motion.a>
                  <motion.a
                    href="#features"
                    className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Features
                  </motion.a>
                  <motion.a
                    href="#faq"
                    className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    FAQ
                  </motion.a>
                  <motion.a
                    href="/contact"
                    className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact
                  </motion.a>
                </div>
                {/* <motion.button
                  className="ml-[2em]"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
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
                </motion.button> */}
              </div>

              {/* Mobile Navbar */}
              <div className="lg:hidden flex items-center justify-between px-[2em] py-[1.5em] gap-[3em]">
                <motion.a
                  href="#"
                  className="flex items-center gap-[1em]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-[2.5em] h-[2.5em] rounded-full bg-white"></div>
                </motion.a>
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

              {/* Mobile Menu with Stagger Animation */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden overflow-hidden"
                  >
                    <motion.div
                      className="px-[2em] pb-[2em] flex flex-row gap-[2em] border-t border-white/10 pt-[2em] justify-center items-center"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                          },
                        },
                      }}
                    >
                      {["Home", "Features", "FAQ", "Contact"].map(
                        (item, index) => (
                          <motion.a
                            key={item}
                            href={
                              item == "Contact"
                                ? `/${item.toLowerCase()}`
                                : item == "Home"
                                ? `#`
                                : `#${item.toLowerCase()}`
                            }
                            className="text-[1.6em] font-medium tracking-tight hover:text-white/70 transition-colors"
                            variants={{
                              hidden: { y: 10, opacity: 0 },
                              visible: { y: 0, opacity: 1 },
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item}
                          </motion.a>
                        )
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
