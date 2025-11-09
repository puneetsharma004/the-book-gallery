"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function BookGalleryLoader() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0c0c0d] via-[#121214] to-[#0d0e10]">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1f2b_0%,#0b0f17_80%)] opacity-90" />

      {/* Animated spinner and text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
        >
          <Loader2 className="h-5 w-5 text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg font-medium text-white/80"
        >
          Loading your library...
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
          className="text-sm text-white/50 mt-2"
        >
          Preparing your bookshelf ✨
        </motion.p>
      </motion.div>
    </main>
  );
}
