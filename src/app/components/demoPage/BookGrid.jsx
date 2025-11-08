"use client";
import DemoBookCard from "./DemoBookCard";

export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {books.map((book) => (
        <DemoBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
