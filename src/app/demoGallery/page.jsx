"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button"; 
import { BookOpen, List, CheckCircle, Pencil, ArrowLeft } from "lucide-react"; 
import Link from "next/link";

// --- Static Demo Data ---
const DEMO_BOOKS = [
    {
        id: 101,
        title: "Dune",
        cover: "https://covers.openlibrary.org/b/id/13257321-L.jpg",
        status: "reading",
        notes: "Starting this classic finally! The world-building is incredibly dense but rewarding. I'm focusing on the political structures and ecological themes.",
    },
    {
        id: 102,
        title: "The Name of the Wind (The Kingkiller Chronicle)",
        cover: "https://covers.openlibrary.org/b/id/8254427-L.jpg",
        status: "read",
        notes: "Absolutely epic storytelling. Kvothe's journey feels intensely personal. A masterpiece of fantasy prose. Highly recommend!",
    },
    {
        id: 103,
        title: "The Hitchhiker's Guide to the Galaxy",
        cover: "https://covers.openlibrary.org/b/id/10188059-L.jpg",
        status: "want",
        notes: "Heard the audio adaptation is brilliant. Must pick this up next for a light, fun read.",
    },
    {
        id: 104,
        title: "Pride and Prejudice",
        cover: "https://covers.openlibrary.org/b/id/14354276-L.jpg",
        status: "read",
        notes: "A beautiful commentary on societal norms and expectations. Elizabeth and Darcy's dynamic is timeless and sharp.",
    },
    {
        id: 105,
        title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        cover: "https://covers.openlibrary.org/b/id/10531500-L.jpg",
        status: "reading",
        notes: "Great practical advice. Applying the 'make it obvious' rule to my morning routine. Very actionable book.",
    },
    {
        id: 106,
        title: "To Kill a Mockingbird",
        cover: "https://covers.openlibrary.org/b/id/926610-L.jpg",
        status: "read",
        notes: null, // Example of a book read without notes
    },
    {
        id: 107,
        title: "Sapiens: A Brief History of Humankind",
        cover: "https://covers.openlibrary.org/b/id/8302195-L.jpg",
        status: "want",
        notes: null,
    },
];


// --- Configuration (Same as PublicProfilePage) ---
const STATUS_DETAILS = {
  reading: { label: "Currently Reading", icon: BookOpen, className: "bg-blue-500 text-white hover:bg-blue-600" },
  want: { label: "Want to Read", icon: Pencil, className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  read: { label: "Finished Reading", icon: CheckCircle, className: "bg-green-500 text-white hover:bg-green-600" },
};

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: STATUS_DETAILS.reading.label, Icon: BookOpen },
  { value: "want", label: STATUS_DETAILS.want.label, Icon: Pencil },
  { value: "read", label: STATUS_DETAILS.read.label, Icon: CheckCircle },
];


export default function DemoGalleryPage() {
  const [filter, setFilter] = useState("all");
  const username = "The Book Gallery Demo"; // Static username for the demo

  // Memoize filtered books for display based on the static data
  const filteredBooks = useMemo(() => {
    if (filter === "all") return DEMO_BOOKS;
    return DEMO_BOOKS.filter((book) => book.status === filter);
  }, [filter]);
  
  // Calculate counts for filters
  const filterCounts = useMemo(() => {
    const counts = { all: DEMO_BOOKS.length, reading: 0, want: 0, read: 0 };
    DEMO_BOOKS.forEach(book => {
      counts[book.status]++;
    });
    return counts;
  }, [DEMO_BOOKS]);


  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-8">
      <div className="max-w-5xl mx-auto py-6">

        {/* Top Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-white drop-shadow-sm">
            📚 Demo Book Gallery
          </h1>
          <p className="text-white/70 mt-1 text-lg">
            Experience how your public reading profile will look.
          </p>

          <Link href="/" className="inline-flex mt-6 items-center text-white/70 hover:text-amber-300 transition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </header>

        {/* --- Filter Section --- */}
        <section aria-labelledby="filter-heading" className="mb-8">
          <h2 id="filter-heading" className="sr-only">
            Filter books by status
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {FILTERS.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-full border backdrop-blur-md transition
                ${
                  filter === value
                    ? "bg-white/20 border-white/50 text-white shadow"
                    : "bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="inline h-4 w-4 mr-1" />
                {label} ({filterCounts[value]})
              </button>
            ))}
          </div>

        </section>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filteredBooks.map((book) => {
            const status = STATUS_DETAILS[book.status] || STATUS_DETAILS.reading;
            
            return (
              <Card className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all overflow-hidden">
                <div className="relative">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-white font-semibold line-clamp-2">{book.title}</h3>

                  <Badge className={`inline-flex items-center ${STATUS_DETAILS[book.status].className}`}>

                    {STATUS_DETAILS[book.status].label}
                  </Badge>

                  {book.notes ? (
                    <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">{book.notes}</p>
                  ) : (
                    <p className="text-white/40 italic text-sm">No notes added.</p>
                  )}
                </div>
              </Card>

            );
          })}
        </div>
      </div>
    </main>
  );
}