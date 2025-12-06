"use client";

import { motion } from "motion/react";
import { Link2 } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[5em] left-[15em] w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center"
        >
          <Link2 className="w-10 h-10 text-blue-600" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-[5em] right-[15em] w-24 h-24 bg-yellow-100 rounded-2xl flex items-center justify-center"
        >
          <Link2 className="w-12 h-12 text-yellow-600" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[10em] left-[25em] w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center"
        >
          <Link2 className="w-8 h-8 text-pink-600" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-[10em] right-[25em] w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center"
        >
          <Link2 className="w-10 h-10 text-purple-600" />
        </motion.div>
      </div>

      <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[12em] ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-8 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-bluetitle border border-bluelight px-4 py-2 rounded-full">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-bluelight flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                A
              </div>
              <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                B
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                C
              </div>
            </div>
            <span className="text-primary font-medium text-sm">Let's Join</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Shorten Links, Grow Your <br />
            <span className="text-primary">Earnings</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 md:max-w-[50%] lg:max-w-[35%] mx-auto">
            Create clean, secure links you can share anywhere and get paid for
            every click.
          </p>

          {/* CTA Button */}
          <Link
            href="/register"
            className="inline-block bg-bluelight text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary-dark transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
