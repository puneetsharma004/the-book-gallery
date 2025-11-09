import React, { useState } from "react";
import { BookCard } from "./BookCard";
import { BookDetailModal } from "./BookDetailModal";


export function BookList({ books, onUpdate, onDelete }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="gap-4">
        {books.map((book) => (
          <BookCard 
            key={book.id}
            book={book}
            onCardClick={() => handleCardClick(book)}
          />
        ))}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
}
