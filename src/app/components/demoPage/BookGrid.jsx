"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import InteractiveBookShowcase from "../common/InteractiveBookShowcase";
import MobileBookShowcase from "../common/MobileBookShowcase.jsx";

// Helper: chunk array into groups of n
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function BookGrid({ books }) {
  const [openBookId, setOpenBookId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = (id) => {
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  // Split into rows of 3 for desktop
  const bookRows = chunkArray(books, 3);

  const [openIndex, setOpenIndex] = React.useState(null);

  // ✅ MOBILE VIEW (Swiper)
  if (isMobile) {
    return (
      <div className="w-full mt-8">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1.15}
          centeredSlides={true}
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {books.map((book, i) => (
            <SwiperSlide key={book.id} className="flex justify-center">
              <MobileBookShowcase
                book={book}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                onBookClick={() => console.log("Edit", book)}
                isPublicView={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  // ✅ DESKTOP VIEW (Framer Motion Grid)
  return (
    <div className="flex flex-col gap-8 mt-10 mx-auto max-w-fit">
      {bookRows.map((row, rowIndex) => (
        <motion.div
          key={`row-${rowIndex}`}
          layout
          className="flex gap-8 justify-center"
        >
          {row.map((book) => (
            <InteractiveBookShowcase
              key={book.id}
              book={book}
              isOpen={openBookId === book.id}
              onToggle={() => handleToggle(book.id)}
              onBookClick={() => {}}
              isPublicView={true}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
