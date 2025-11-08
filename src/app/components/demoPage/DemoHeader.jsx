"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DemoHeader() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-24 sm:py-32 h-screen">
      {/* Decorative radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Animated header content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-serif font-bold text-white drop-shadow-md">
          Demo Book Gallery
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
          A sneak peek of your public reading showcase — see how your book
          collection and notes will appear in style.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 text-sm text-white/70 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Soft bottom gradient for smooth section transition */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0c0c0d]" /> */}
    </section>
  );
}
