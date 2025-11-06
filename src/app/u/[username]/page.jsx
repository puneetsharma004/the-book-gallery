"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button"; 
import { BookOpen, List, CheckCircle, Pencil } from "lucide-react"; 

// --- Theme and Configuration ---

// Theme Colors (Refined for a softer, richer look)
const BG_COLOR = "bg-amber-50"; 
const TEXT_COLOR = "text-stone-900"; 
const ACCENT_COLOR = "text-amber-800"; // Slightly darker, richer accent color
const BORDER_COLOR = "border-amber-400"; 

// Status details (Reading status kept high-contrast blue/green for quick recognition)
const STATUS_DETAILS = {
  reading: { label: "Currently Reading", icon: BookOpen, className: "bg-blue-600 text-white" }, 
  want: { label: "Want to Read", icon: Pencil, className: "bg-amber-100 text-amber-800" }, 
  read: { label: "Finished Reading", icon: CheckCircle, className: "bg-green-600 text-white" }, 
};

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: STATUS_DETAILS.reading.label, Icon: BookOpen },
  { value: "want", label: STATUS_DETAILS.want.label, Icon: Pencil },
  { value: "read", label: STATUS_DETAILS.read.label, Icon: CheckCircle },
];

// --- Extracted Component for Book Display ---
function PublicBookCard({ book }) {
    const status = STATUS_DETAILS[book.status] || STATUS_DETAILS.reading;
    
    return (
        <Card 
            key={book.id} 
            className={`rounded-xl shadow-md transition-shadow hover:shadow-lg flex flex-col h-full bg-white ${TEXT_COLOR}`}
        >
            <CardHeader className="pb-3 space-y-2">
                <h2 className="font-semibold text-lg line-clamp-2 text-stone-800">
                    {book.title}
                </h2>
                <Badge 
                    className={`w-fit text-sm font-medium ${status.className}`}
                >
                    <status.icon className="mr-1 h-3 w-3" aria-hidden="true" />
                    {status.label}
                </Badge>
            </CardHeader>
            
            <CardContent className="space-y-3 flex-1">
                {/* Book Cover */}
                {book.cover && book.cover !== "N/A" ? (
                    <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-48 object-cover rounded-md shadow-sm"
                        loading="lazy"
                    />
                ) : (
                    <div 
                        className="w-full h-48 bg-stone-100 border border-dashed border-stone-300 rounded-md flex items-center justify-center text-stone-500 text-sm"
                        role="img"
                        aria-label={`No cover image available for ${book.title}`}
                    >
                        No cover available
                    </div>
                )}

                {/* Notes (Truncated) */}
                {book.notes && (
                    <p className="text-sm mt-2 text-stone-700 line-clamp-3">
                        <strong className="font-medium text-stone-800">Notes:</strong> {book.notes}
                    </p>
                )}
                {!book.notes && (
                    <p className="text-sm italic text-stone-500">
                        No public notes available for this entry.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// --- Main Component ---

export default function PublicProfilePage() {
  const { username } = useParams();
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("bg_books");
    if (stored) setBooks(JSON.parse(stored));
  }, [username]);

  // Memoize filtered books for display
  const filteredBooks = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((book) => book.status === filter);
  }, [books, filter]);
  
  // Calculate counts for filters
  const filterCounts = useMemo(() => {
    const counts = { all: books.length, reading: 0, want: 0, read: 0 };
    books.forEach(book => {
      counts[book.status]++;
    });
    return counts;
  }, [books]);


  return (
    <main className={`min-h-screen ${BG_COLOR} p-6`}>
      <div className="max-w-5xl mx-auto py-8">
        
        {/* --- Header & Title (Themed) --- */}
        <header className={`text-center mb-10 bg-white p-6 rounded-xl shadow-lg border ${BORDER_COLOR}`}>
          <h1 className={`text-4xl font-extrabold ${TEXT_COLOR} font-serif mb-2`}>
            {username}'s Book Gallery 📚
          </h1>
          <p className="text-lg text-stone-600">
            A look at their reading journey.
          </p>
        </header>

        {/* --- Filter Section --- */}
        <section aria-labelledby="filter-heading" className="mb-8">
          <h2 id="filter-heading" className="sr-only">
            Filter books by status
          </h2>
          <div 
            className="flex flex-wrap gap-3 justify-center"
            role="tablist"
            aria-label="Book status filters"
          >
            {FILTERS.map(({ value, label, Icon }) => (
              <Button
                key={value}
                variant={filter === value ? "default" : "outline"}
                onClick={() => setFilter(value)}
                role="tab"
                aria-selected={filter === value}
                // Refined filter button styling: Uses softer amber for active state
                className={`transition-all ${filter === value ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'hover:bg-amber-100 border-amber-300 text-amber-700'}`}
              >
                <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {label} ({filterCounts[value]})
              </Button>
            ))}
          </div>
        </section>

        {/* --- Content Grid --- */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-300 rounded-xl bg-white mt-10">
              <BookOpen className="h-10 w-10 mx-auto text-stone-400 mb-4" />
              <p className="text-stone-500 text-lg font-medium">
                {filter === "all" 
                  ? `${username} hasn't added any books yet.`
                  : `No books currently marked as "${FILTERS.find(f => f.value === filter)?.label.toLowerCase()}" in this gallery.`
                }
              </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredBooks.map((book) => (
              <PublicBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}