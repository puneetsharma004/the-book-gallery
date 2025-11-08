"use client";

import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <section className="relative py-28 px-6 max-w-4xl mx-auto text-center overflow-hidden">
      {/* Subtle light gradient in background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-serif font-bold text-white mb-8"
      >
        Because books shape us.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="text-white/70 text-lg leading-relaxed"
      >
        I realized I was changing from the books I read — in quiet, subtle ways.
        But when I tried to look back, to remember who I had been, and who I was
        becoming, the details faded.
        <br />
        <br />
        I wanted a place to keep the stories that shaped me.
        Not a social feed. Not a list of ratings.
        Just a calm, personal room for the books that stayed with me.
      </motion.p>

      <div className="mx-auto mt-16 h-px w-32 bg-stone-300/40" />
    </section>
  );
}
