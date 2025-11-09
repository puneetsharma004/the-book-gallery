"use client";

import { useState, useMemo } from "react";
import DemoHeader from "../components/demoPage/DemoHeader";
import FilterSection from "../components/demoPage/FilterSection";
import BookGrid from "../components/demoPage/BookGrid";
import { DEMO_BOOKS } from "./data/demoBooks";


export default function DemoGalleryPage() {
  const [filter, setFilter] = useState("all");

  const filteredBooks = useMemo(() => {
    if (filter === "all") return DEMO_BOOKS;
    return DEMO_BOOKS.filter((book) => book.status === filter);
  }, [filter]);

  const filterCounts = useMemo(() => {
    const counts = { all: DEMO_BOOKS.length, reading: 0, want: 0, read: 0 };
    DEMO_BOOKS.forEach((book) => counts[book.status]++);
    return counts;
  }, []);

  return (
    <main className="relative overflow-hidden bg-linear-to-b from-[#0c0c0d] via-[#121214] to-[#0d0e10] min-h-screen w-full">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        <DemoHeader />
        <FilterSection
          filter={filter}
          setFilter={setFilter}
          filterCounts={filterCounts}
        />
        <BookGrid books={filteredBooks} />
      </div>

      {/* Radial vignette overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-90 bg-[radial-gradient(ellipse_at_center,#1a1f2b,#0b0f17)]" />
    </main>
  );
}
