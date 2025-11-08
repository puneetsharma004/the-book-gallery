"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ShowcasePreview() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Scale from small to full size
  const scale = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  
  // 3D rotation - starts tilted back (like lying flat), lifts to upright
  const rotateX = useTransform(scrollYProgress, [0, 1], [100, 0]);
  
  // Move up as it lifts
  const y = useTransform(scrollYProgress, [0, 1], ["100px", "0px"]);
  
  // Fade in
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* Background shelves image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]"
        style={{ backgroundImage: "url(/libBg.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl sm:text-5xl font-serif font-bold text-white mb-8"
        >
          A Bookshelf Worth Sharing.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto mb-16"
        >
          Because books shape who we are — and that story deserves to be seen.
        </motion.p>

        {/* 3D Perspective Container */}
        <div 
          className="relative mx-auto max-w-xl"
          style={{ 
            perspective: "1200px", // Creates 3D space
            perspectiveOrigin: "50% 50%"
          }}
        >
          {/* Image with 3D book-lifting effect */}
          <motion.div
            style={{ 
              scale, 
              y, 
              opacity,
              rotateX, // 3D rotation on X-axis
              transformStyle: "preserve-3d", // Maintains 3D space
            }}
            className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl border border-white/15"
          >
            <img
              src="/showcaseMockup.png"
              alt="Library Showcase"
              className="w-full max-h-[600px] sm:max-h-[700px] lg:max-h-[800px] object-contain mx-auto"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
