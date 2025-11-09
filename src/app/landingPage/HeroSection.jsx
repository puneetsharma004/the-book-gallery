"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HERO_BOOKS = [
  { id: 1, cover: "https://covers.openlibrary.org/b/id/13257321-M.jpg", title: "Dune", rotate: "-rotate-3" },
  { id: 2, cover: "https://covers.openlibrary.org/b/id/8254427-M.jpg", title: "The Name of the Wind", rotate: "rotate-2" },
  { id: 3, cover: "https://covers.openlibrary.org/b/id/14354276-M.jpg", title: "Pride and Prejudice", rotate: "rotate-1" },
];

export default function HeroSection() {
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-20 sm:py-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Subtle texture layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('/grain.png')] mix-blend-overlay" />

      {/* Text Content */}
      <div className="relative max-w-4xl text-center px-4 sm:px-6 z-10">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight"
        >
          Show <span className="sm:hidden"><br /></span>
          <span className="hidden sm:inline"> </span>
          Who You Are
          <br />
          By <span className="sm:hidden"><br /></span>
          <span className="hidden sm:inline"> </span>
          What You Read.
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mt-4 sm:mt-6 max-w-2xl mx-auto px-2"
        >
          A bookshelf worth sharing.  
          A space where your reading journey becomes part of your identity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white text-black hover:bg-white/80 rounded-full cursor-pointer font-medium shadow-lg hover:shadow-xl transition-all active:scale-95">
              Create Your Library
            </Button>
          </Link>

          <Link href="/demoGallery" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg border-white/40 text-white hover:bg-white/10 rounded-full backdrop-blur-2xl cursor-pointer font-medium transition-all active:scale-95">
              View Demo Gallery
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Book Covers */}
      <div className="absolute inset-0 pointer-events-none hidden md:block opacity-20">
        {HERO_BOOKS.map((book, i) => (
          <img
            key={book.id}
            src={book.cover}
            alt={book.title}
            className={`absolute w-32 lg:w-40 object-cover rounded shadow-2xl ${book.rotate} float-book`}
            style={{ top: `${25 + i * 15}%`, left: `${20 + i * 25}%` }}
            loading="lazy"
          />
        ))}
      </div>
    </motion.section>
  );
}
