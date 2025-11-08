"use client";

import { motion } from "framer-motion";
import { Share2, Pencil, Zap, Heart } from "lucide-react";

const FEATURES = [
  { icon: Share2, title: "Public Gallery", description: "Curate and share your reading profile with a beautiful, custom link." },
  { icon: Pencil, title: "Private Notes", description: "Write down reflections, quotes, and thoughts that are meaningful only to you." },
  { icon: Zap, title: "Status Tracking", description: "Effortlessly track progress: Reading, Want to Read, or Finished." },
  { icon: Heart, title: "Quote Highlights", description: "Capture and categorize your favorite passages for easy lookup later." },
];

export default function FeatureGrid() {
  return (
    <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden ">
      {/* Soft gradient background */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-30"
        style={{ backgroundImage: "url(/gridLg.png)", transform: "translateZ(0)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl sm:text-5xl font-serif font-bold text-white mb-10"
        >
          Features Designed for Readers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1 }}
          className="text-stone-300 text-lg max-w-2xl mx-auto mb-20"
        >
          A quiet place to document your journey, honor your growth, and share your bookshelf with intention.
        </motion.p>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl border border-white/15 bg-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-white/10 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition group"
            >
              <feature.icon className="w-6 h-6 text-amber-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-xl text-white font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-stone-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
