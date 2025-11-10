"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InteractiveBookShowcase from "../common/InteractiveBookShowcase";
import { BookDetailModal } from "./BookDetailModal";
import MobileBookShowcase from "../common/MobileBookShowcase.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function BookGrid({ books, onUpdate, onDelete }) {
  const [openBookId, setOpenBookId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chunkSize, setChunkSize] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  

  // Responsive chunk sizing: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
  useEffect(() => {
    const updateChunkSize = () => {
      if (typeof window === 'undefined') return;
      
      if (window.innerWidth < 640) {
        setChunkSize(1); // Mobile: 1 column
      } else if (window.innerWidth < 1024) {
        setChunkSize(2); // Tablet: 2 columns
      } else {
        setChunkSize(3); // Desktop: 3 columns
      }
    };

    updateChunkSize();
    window.addEventListener('resize', updateChunkSize);
    return () => window.removeEventListener('resize', updateChunkSize);
  }, []);

  const handleToggle = (id) => {
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  const handleBookClick = (book) => {
    setSelectedBookId(book.id);
    setIsModalOpen(true);
  };


    // Detect mobile view
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
  

  const selectedBook = books.find((b) => b.id === selectedBookId);

  const bookRows = chunkArray(books, chunkSize);

  const [openIndex, setOpenIndex] = useState(null);
  
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
                  onBookClick={() => handleBookClick(book)}
                  isPublicView={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>

                {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
        </div>
      );
    }
    
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 mx-auto max-w-fit px-2 sm:px-4">
        {bookRows.map((row, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            layout
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center sm:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
          >
            {row.map((book) => (
              <InteractiveBookShowcase
                key={book.id}
                book={book}
                isOpen={openBookId === book.id}
                onToggle={() => handleToggle(book.id)}
                onBookClick={() => handleBookClick(book)}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
