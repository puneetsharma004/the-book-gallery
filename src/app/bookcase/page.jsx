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
    <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
      <h2 className="text-4xl font-serif font-bold text-center mb-12 text-white">
        Your Reading, Beautifully Presented
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
        {FEATURED_BOOKS.map((book, i) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            {/* 🔥 Your animated 3D Book */}
            <BookShowcase
              image={book.cover}
              size="lg"
              className="cursor-pointer"
            />

            {/* 📚 Title and Author below */}
            <div className="mt-4">
              <h3 className="text-white font-medium text-lg group-hover:text-gray-300 transition-colors duration-300">
                {book.title}
              </h3>
              <p className="text-sm text-gray-400">{book.author}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
