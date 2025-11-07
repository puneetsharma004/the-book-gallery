"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; // ✅ we use supabase directly
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button"; 
import { BookOpen, List, CheckCircle, Pencil } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";


const BG_COLOR = "bg-amber-50"; 
const TEXT_COLOR = "text-stone-900"; 
const ACCENT_COLOR = "text-amber-800";
const BORDER_COLOR = "border-amber-400";

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

const cardAnimation = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};


function PublicBookCard({ book }) {
  const status = STATUS_DETAILS[book.status] || STATUS_DETAILS.reading;
    
  return (
    <Card className={`rounded-xl shadow-md hover:shadow-lg flex flex-col h-full bg-white ${TEXT_COLOR}`}>
      <CardHeader className="pb-3 space-y-2">
        <h2 className="font-semibold text-lg line-clamp-2">{book.title}</h2>
        <Badge className={`w-fit text-sm font-medium ${status.className}`}>
          <status.icon className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-md shadow-sm" />
        ) : (
          <div className="w-full h-48 border border-dashed rounded-md flex items-center justify-center text-stone-500">
            No cover available
          </div>
        )}

        {book.notes ? (
          <p className="text-sm text-stone-700 line-clamp-3">
            <strong>Notes:</strong> {book.notes}
          </p>
        ) : (
          <p className="text-sm italic text-stone-500">No public notes available.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PublicProfilePage() {
  const { username } = useParams();
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");

  // ✅ NEW — Fetch actual public user's books
  useEffect(() => {
    async function fetchPublicData() {
      // 1) get user by username
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (!profile) return;

      // 2) fetch books for that user
      const { data: userBooks } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      setBooks(userBooks || []);
    }

    fetchPublicData();
  }, [username]);

  const filteredBooks = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const filterCounts = useMemo(() => {
    const counts = { all: books.length, reading: 0, want: 0, read: 0 };
    books.forEach((b) => counts[b.status]++);
    return counts;
  }, [books]);

  return (
    <main className={`min-h-screen ${BG_COLOR} p-6`}>
      <div className="max-w-5xl mx-auto py-8">
        <header className={`text-center mb-10 bg-white p-6 rounded-xl shadow-lg border ${BORDER_COLOR}`}>
          <h1 className={`text-4xl font-extrabold ${TEXT_COLOR} font-serif mb-2`}>
            {username}'s Book Gallery 📚
          </h1>
          <p className="text-lg text-stone-600">A look at their reading journey.</p>
        </header>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {FILTERS.map(({ value, label, Icon }) => (
            <Button
              key={value}
              onClick={() => setFilter(value)}
              className={filter === value ? "bg-amber-600 text-white" : "border-amber-300 text-amber-700"}
            >
              <Icon className="mr-2 h-4 w-4" /> {label} ({filterCounts[value]})
            </Button>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl bg-white mt-10 text-stone-500">
            No books here yet…
          </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={cardAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <PublicBookCard book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

      </div>
    </main>
  );
}
