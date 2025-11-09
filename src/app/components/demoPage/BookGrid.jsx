"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import InteractiveBookShowcase from "../common/InteractiveBookShowcase";

// Chunk array into groups of size n
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function BookGrid({ books }) {
  const [openBookId, setOpenBookId] = useState(null);

  const handleToggle = (id) => {
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  // Split books into rows of 3
  const bookRows = chunkArray(books, 3);

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
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
