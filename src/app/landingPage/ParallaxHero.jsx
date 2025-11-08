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
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
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
          className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)] mb-8"
        >
          Show Who You Are <br className="hidden sm:block" /> By What You Read.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-lg sm:text-xl text-white/80 max-w-3xl drop-shadow-md font-light leading-relaxed"
        >
          Build a bookshelf that reflects your curiosity, growth, and <br /> story — beautifully displayed for the world to see.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-12 flex flex-wrap justify-center gap-5"
        >
          <Link href="/signup">
            <Button className="bg-white/15 backdrop-blur-lg border border-white/30 text-white hover:bg-white/25 px-10 py-6 text-lg rounded-xl transition-all cursor-pointer">
              Create Your Library
            </Button>
          </Link>

          <Link href="/demoGallery">
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/20 px-10 py-6 text-lg rounded-xl transition-all backdrop-blur-2xl cursor-pointer"
            >
              View Demo Gallery
            </Button>
          </Link>
        </motion.div>
      </motion.div>

    </section>
  );
}
