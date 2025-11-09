"use client";

import { motion } from "framer-motion";
import BookShowcase from "../components/common/BookShowcase";

const FEATURED_BOOKS = [
  { title: "Bhagavad Gita as it is", author: "Srila Prabhupada", cover: "/books/gita.png" },
  { title: "The Alchemist", author: "Paulo Coelho", cover: "/books/alchemist.jpg" },
  { title: "Think and Grow Rich", author: "Napoleon Hill", cover: "/books/thinkandgrowrich.jpg" },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", cover: "/books/wings.jpg" },
];

export default function FeaturedBooks() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-8 sm:mb-10 md:mb-12 text-white">
        Your Reading, Beautifully Presented
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
        {FEATURED_BOOKS.map((book, i) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center group w-full max-w-[180px] sm:max-w-none"
          >
            {/* 🔥 Your animated 3D Book */}
            <BookShowcase
              image={book.cover}
              size="lg"
              responsiveSize={{
                mobile: "sm",
                laptop: "md",
                desktop: "lg",
              }}
              className="cursor-pointer"
            />

            {/* 📚 Title and Author below */}
            <div className="mt-3 sm:mt-4 px-2">
              <h3 className="text-white font-medium text-base sm:text-lg md:text-xl group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mt-1 truncate">
                {book.author}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
