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
      className="relative min-h-screen flex items-center justify-center overflow-hidden "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Subtle texture layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('/grain.png')] mix-blend-overlay" />

      {/* Text Content */}
      <div className="relative max-w-4xl text-center px-6 z-10">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl font-serif font-bold text-white leading-tight"
        >
          Show Who You Are
          <br />
          By What You Read.
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-2xl text-white/70 mt-6 max-w-2xl mx-auto"
        >
          A bookshelf worth sharing.  
          A space where your reading journey becomes part of your identity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/signup">
            <Button className="px-8 py-6 text-lg bg-white text-black hover:bg-white/80 rounded-full cursor-pointer">
              Create Your Library
            </Button>
          </Link>

          <Link href="/demoGallery">
            <Button variant="outline" className="px-8 py-6 text-lg border-white/40 text-white hover:bg-white/10 rounded-full backdrop-blur-2xl cursor-pointer">
              View Demo Gallery
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Book Covers (converted to CSS animations for performance) */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block opacity-20">
        {HERO_BOOKS.map((book, i) => (
          <img
            key={book.id}
            src={book.cover}
            alt={book.title}
            className={`absolute w-40 object-cover rounded shadow-2xl ${book.rotate} float-book`}
            style={{ top: `${25 + i * 15}%`, left: `${20 + i * 25}%` }}
            loading="lazy"
          />
        ))}
      </div>
    </motion.section>
  );
}
