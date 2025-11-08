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
      // Small delay to let hydration finish, then stagger children
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
    <section className="py-12 px-6 sm:px-12 lg:px-20 text-center">
      {/* ONE motion container - viewport once prevents re-triggering */}
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
          className="text-4xl sm:text-5xl font-serif font-bold text-white mb-8"
        >
          Show who you are by what you read.
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          variants={child}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12"
        >
          Build a bookshelf that reflects your growth, curiosity, and identity — and
          share it with anyone, anywhere.
        </motion.p>

        {/* Gita verse block */}
        <motion.div variants={child} className="max-w-2xl mx-auto mb-14">
          <div className="w-20 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto mb-6" />

          <p className="text-xl sm:text-2xl text-amber-100 font-serif leading-relaxed mb-3">
            “न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।” 
          </p>

          <p className="text-white/60 italic text-lg mb-2">— Bhagavad Gītā 4.38</p>

          <motion.p
            variants={child}
            className="text-white/80 text-lg sm:text-xl font-light max-w-xl mx-auto leading-relaxed"
          >
            <span className="text-amber-200">“There is no purifier like knowledge —”</span>{" "}
            it refines the soul, awakens the mind, and reveals the light we already
            carry within.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={child} className="flex justify-center">
          <Link href="/signup">
            <Button className="px-8 py-6 text-lg bg-white text-black hover:bg-white/80 rounded-full cursor-pointer">
              Create Your Library
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
