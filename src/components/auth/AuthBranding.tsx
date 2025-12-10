// Auth Branding Component - Purple left side
"use client";

import { motion } from "motion/react";
import { Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface AuthBrandingProps {
  title: string;
  subtitle: string;
  accentColor?: "blue" | "purple";
}

export default function AuthBranding({
  title,
  subtitle,
  accentColor = "blue",
}: AuthBrandingProps) {
  const colorConfig = {
    blue: {
      circle1: "bg-blue-500/10",
      circle2: "bg-purple-500/10",
      gradient: "from-blue-500 to-purple-600",
      shadow: "shadow-blue-500/50",
      backText: "text-blue-200",
    },
    purple: {
      circle1: "bg-purple-500/10",
      circle2: "bg-blue-500/10",
      gradient: "from-purple-500 to-blue-600",
      shadow: "shadow-purple-500/50",
      backText: "text-purple-200",
    },
  };

  const colors = colorConfig[accentColor];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hidden lg:flex bg-gradient-to-br from-[#10052C] via-[#1a0b3e] to-[#10052C] items-center justify-center relative overflow-hidden"
    >
      {/* Back button */}
      <Link
        href="/"
        className={`absolute top-8 left-8 flex items-center gap-2 ${colors.backText} hover:text-white transition-colors group z-20`}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Kembali ke Home</span>
      </Link>

      {/* Decorative circles */}
      <div
        className={`absolute top-20 left-20 w-64 h-64 ${colors.circle1} rounded-full blur-3xl animate-pulse`}
      />
      <div
        className={`absolute bottom-20 right-20 w-80 h-80 ${colors.circle2} rounded-full blur-3xl animate-pulse delay-700`}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-20 h-20 mx-auto mb-8 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${colors.shadow}`}
        >
          <LinkIcon className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold text-white mb-4"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-xl ${colors.backText}`}
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
