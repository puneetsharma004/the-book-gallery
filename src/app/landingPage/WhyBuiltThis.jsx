"use client";

import { motion } from "framer-motion";

export default function WhyBuiltThis() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 max-w-4xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-8 sm:mb-10 px-2"
      >
        Why I Built This
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed sm:leading-relaxed md:leading-loose font-light px-2 max-w-3xl mx-auto"
      >
        I've read many books over the years. They've shaped the way I think, the way I speak, 
        the way I see the world. But every time someone asked me,{" "}
        <span className="italic">"What have you read?"</span> — I didn't have a way to show the journey.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed sm:leading-relaxed md:leading-loose font-light mt-6 sm:mt-8 px-2 max-w-3xl mx-auto"
      >
        This space is my answer —  
        a place to remember who I was when I read each book,  
        and to honor the things that changed me.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 px-2"
      >
        <p className="text-white/60 italic text-sm sm:text-base md:text-lg text-right">
          — Puneet Sharma
        </p>
      </motion.div>
    </section>
  );
}
