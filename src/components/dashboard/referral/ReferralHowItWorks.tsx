"use client";

import { motion } from "framer-motion";
import { UserPlus, Gift, Wallet } from "lucide-react";

interface ReferralHowItWorksProps {
  commissionRate: number;
}

export default function ReferralHowItWorks({
  commissionRate,
}: ReferralHowItWorksProps) {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Undang Teman",
      desc: "Bagikan link referral unik Anda ke teman, grup WhatsApp, atau sosial media.",
    },
    {
      icon: Gift,
      title: "2. Mereka Mendaftar",
      desc: "Teman Anda mendaftar menggunakan link tersebut dan mulai memendekkan link.",
    },
    {
      icon: Wallet,
      title: "3. Anda Dapat Komisi",
      desc: `Otomatis dapat ${commissionRate}% dari setiap penghasilan yang mereka dapatkan!`,
    },
  ];

  return (
    <div className="py-8 font-figtree">
      <h2 className="text-[2.2em] font-bold text-shortblack mb-8 text-center">
        Cara Kerja Referral
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="w-20 h-20 bg-blues mx-auto rounded-full flex items-center justify-center mb-6 text-bluelight">
              <step.icon className="w-10 h-10" />
            </div>
            <h3 className="text-[1.8em] font-bold text-shortblack mb-2">
              {step.title}
            </h3>
            <p className="text-[1.4em] text-grays leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
