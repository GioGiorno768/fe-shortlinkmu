"use client";
import { options } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Jakarta", // GMT+7
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      setTime(`${formatted} GMT+7`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000); // update tiap detik

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-bluelight ">
      <div className="max-w-[130em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[5em] md:py-[6em] mx-auto space-y-[5em]">
        <div className="flex flex-col md:flex-row justify-between gap-[5em]">
          {/* Logo Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <span className="text-[2.4em] font-bold text-white">LOGO</span>
            </div>
            <p className="text-purple-200 text-[1.6em] w-[60%]">
              Easiest and most trusted link shortener
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap lg:gap-[20em]  gap-[5em]">
            {/* Discover */}
            <div className="w-fit">
              <h3 className="font-semibold mb-[1em] text-[2em] text-white ">
                Discover
              </h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payout-rates"
                    className="hover:text-white transition-colors"
                  >
                    Payout Rates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div className="w-fit">
              <h3 className="font-semibold mb-[1em] text-[2em] text-white">
                Help & Support
              </h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="hover:text-white transition-colors"
                  >
                    Forum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/advertisers"
                    className="hover:text-white transition-colors"
                  >
                    Advertisers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resource */}
            <div className="w-fit">
              <h3 className="font-semibold mb-[1em] text-[2em] text-white">
                Resource
              </h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Term Of Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dmca"
                    className="hover:text-white transition-colors"
                  >
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-purple-200">
            © {currentYear} Shortut. All Rights Reserved
          </p>
          <p className="text-sm text-purple-200">{time}</p>
        </div>
      </div>
    </footer>
  );
}
