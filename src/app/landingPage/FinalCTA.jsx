"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function FinalCTA() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="max-w-4xl mx-auto"
      >
        {/* Heading */}
        <motion.h2
          variants={child}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 sm:mb-8 px-2"
        >
          Show who you are by what you read.
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          variants={child}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
        >
          Build a bookshelf that reflects your growth, curiosity, and identity — and
          share it with anyone, anywhere.
        </motion.p>

        {/* Gita verse block */}
        <motion.div variants={child} className="max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14 px-4">
          <div className="w-16 sm:w-20 h-0.5 bg-linear-to-r from-amber-400 to-yellow-600 mx-auto mb-4 sm:mb-6" />

          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 font-serif leading-relaxed mb-2 sm:mb-3">
            "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।" 
          </p>

          <p className="text-white/60 italic text-sm sm:text-base md:text-lg mb-2">
            — Bhagavad Gītā 4.38
          </p>

          <motion.p
            variants={child}
            className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-xl mx-auto leading-relaxed"
          >
            <span className="text-amber-200">"There is no purifier like knowledge —"</span>{" "}
            it refines the soul, awakens the mind, and reveals the light we already
            carry within.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={child} className="flex justify-center px-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white text-black hover:bg-white/80 rounded-full cursor-pointer font-medium shadow-lg hover:shadow-xl transition-all active:scale-95">
              Create Your Library
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
