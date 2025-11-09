"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Share2, Pencil, Zap, Heart } from "lucide-react";

// Move static data outside component
const FEATURES = [
  { icon: Share2, title: "Public Gallery", description: "Curate and share your reading profile with a beautiful, custom link." },
  { icon: Pencil, title: "Private Notes", description: "Write down reflections, quotes, and thoughts that are meaningful only to you." },
  { icon: Zap, title: "Status Tracking", description: "Effortlessly track progress: Reading, Want to Read, or Finished." },
  { icon: Heart, title: "Quote Highlights", description: "Capture and categorize your favorite passages for easy lookup later." },
];

const FeatureGrid = memo(() => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-30"
        style={{ backgroundImage: "url(/gridLg.png)", transform: "translateZ(0)" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/60" />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 sm:mb-8 md:mb-10 px-4"
        >
          Features Designed for Readers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1 }}
          className="text-stone-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-4"
        >
          A quiet place to document your journey, honor your growth, and share your bookshelf with intention.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title} // Use unique key instead of index
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ willChange: "transform, opacity" }} // GPU acceleration hint
              className="p-5 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/15 bg-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-white/10 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all group"
            >
              <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-base sm:text-lg md:text-xl text-white font-medium mb-1.5 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-stone-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeatureGrid.displayName = "FeatureGrid";

export default FeatureGrid;
