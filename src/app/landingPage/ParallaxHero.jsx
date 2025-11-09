"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function ParallaxHero() {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth parallax transforms
  // const y = useTransform(scrollYProgress, [0, 0.8], ["10px", "0px"]);  // moves up
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.8, 1]);      // scales up
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);      // fades in

  return (
    <section 
      ref={ref}
      className="relative w-full py-32 h-screen px-6 sm:px-12 overflow-hidden"
    >
      {/* Fixed Background Parallax Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/library-bg-refined.png')",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70" />
      {/* Foreground Content with Scroll Transforms */}
      <motion.div 
        style={{ scale, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center h-full px-8 sm:px-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)] mb-6 sm:mb-8 max-w-4xl"
        >
          Show Who You Are <br className="hidden sm:block" /> By What You Read.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl drop-shadow-md font-light leading-relaxed px-4"
        >
          Build a bookshelf that reflects your curiosity, growth, and <br /> story — beautifully displayed for the world to see.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 w-full max-w-lg sm:max-w-none px-2"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white/15 backdrop-blur-lg border border-white/30 text-white hover:bg-white/25 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-xl transition-all cursor-pointer font-medium active:scale-95">
              Create Your Library
            </Button>
          </Link>

          <Link href="/demoGallery" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/20 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-xl transition-all backdrop-blur-2xl cursor-pointer font-medium active:scale-95"
            >
              View Demo Gallery
            </Button>
          </Link>
        </motion.div>
      </motion.div>

    </section>
  );
}
