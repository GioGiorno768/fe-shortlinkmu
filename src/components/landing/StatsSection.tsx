"use client";

import { motion } from "motion/react";
import { Link2, MousePointerClick, Users } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Link2,
      label: "Total Links Created",
      value: "800K++",
      color: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      icon: MousePointerClick,
      label: "Total Clicks",
      value: "1.2M++",
      color: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      icon: Users,
      label: "Total Users",
      value: "750K++",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <section className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white ">
      <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[7em] md:py-[8em] mx-auto space-y-[12em] ">
        <div className="flex lg:flex-row flex-col justify-center items-center gap-[5em] md:flex-wrap">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl py-[3em] px-[4em] shadow-lg border border-gray-100 flex justify-between items-center gap-[5em]"
            >
              <div >
                <h3 className="text-shortblack text-[1.6em] text-sm font-medium ">
                  {stat.label}
                </h3>
                <p className="text-[4em] font-bold text-primary">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-[5em] h-[5em] ${stat.color} rounded-full flex items-center justify-center`}
              >
                <stat.icon className={`w-[2.5em] h-[2.5m] ${stat.iconColor}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
