// Auth Form Wrapper - Right side container
"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  allowScroll?: boolean;
}

export default function AuthFormWrapper({
  children,
  allowScroll = false,
}: AuthFormWrapperProps) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      onWheel={(e) => e.stopPropagation()}
      className={`flex items-center justify-center bg-white p-[6em] relative ${
        allowScroll ? "overflow-y-auto" : ""
      }`}
    >
      <div className="w-full">
        {/* Back button mobile */}
        <Link
          href="/"
          className="flex lg:hidden items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Home
        </Link>

        {children}
      </div>
    </motion.div>
  );
}
