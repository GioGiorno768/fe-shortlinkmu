"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      question: "Is it safe to use this shortlink service?",
      answer:
        "Yes, absolutely! Our platform uses industry-standard security measures to protect your links and data. All links are scanned for malware and suspicious content before being shortened.",
    },
    {
      question: "How can I earn money from shortened links?",
      answer:
        "Every time someone clicks your shortlink, you earn based on CPM (cost per 1000 views). With our high CPM rates, your links can generate more income compared to other platforms.",
    },
    {
      question: "What is the minimum payout amount?",
      answer:
        "Our minimum payout threshold is very low, starting from just $5. This means you can withdraw your earnings faster without long waiting times.",
    },
    {
      question: "How do referral links work?",
      answer:
        "Share your unique referral link with friends and earn extra rewards when they sign up and start using the service. You'll earn a percentage of their earnings as a bonus.",
    },
    {
      question: "Can I customize my shortlinks?",
      answer:
        "Yes! You can create custom, branded shortlinks with your own aliases. This makes your links more memorable and professional.",
    },
    {
      question: "How fast are payouts processed?",
      answer:
        "Payouts are typically processed within 24-48 hours after your withdrawal request. We support multiple payment methods including PayPal, bank transfer, and cryptocurrency.",
    },
  ];

  return (
    <section
      id="faq"
      className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white "
    >
      <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[12em] ">
        {/* Header */}
        <div className="text-center mb-[8em]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-[2em]"
          >
            <span className="bg-bluelight text-[1.6em] text-white px-[2em] rounded-full py-[.5em] w-fit">
              FAQ
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Frequently ask question
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 m-auto lg:w-[45%] xl:w-[35%] md:w-[50%] sm:w-[60%] w-full"
          >
            Packed with simple yet powerful tools to make every link cleaner,
            smarter, and more useful.
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 w-full md:w-[70%] m-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-[3em] py-[2em] flex items-center justify-between text-left gap-[2em] hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-[2.5em]">
                  <div className="w-[3.5em] h-[3.5em] bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-bluelight font-bold text-[1.5em]">
                      ?
                    </span>
                  </div>
                  <span className="text-shortblack font-medium text-[2em] font-figtree">
                    {faq.question}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-[3em] py-[2em]">
                      <p className="text-grays leading-relaxed text-[1.6em]">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
