"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, logout } from "@/lib/auth";
import { getBooks, addBook, updateBook as updateBookDB, deleteBook as deleteBookDB } from "@/lib/books";
import { fetchBookCover } from "@/lib/covers";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, List, CheckCircle, Pencil, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookCard } from "../components/BookCard";

// THEME
const BG_COLOR = "bg-amber-50";
const TEXT_COLOR = "text-stone-900";
const ACCENT_COLOR = "text-amber-800";
const BORDER_COLOR = "border-stone-200";

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: "Reading", Icon: BookOpen },
  { value: "want", label: "Want to Read", Icon: Pencil },
  { value: "read", label: "Read", Icon: CheckCircle },
];

export default function UserPage() {
  const router = useRouter();
  const bookInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newBook, setNewBook] = useState("");
  const [isAddingBook, setIsAddingBook] = useState(false);

  // ✅ Load user session + books from database
    useEffect(() => {
    let ignore = false;

    async function init() {
        const sessionUser = await getCurrentUser();
        if (!sessionUser && !ignore) return router.push("/login");

        if (!ignore) {
        setUser(sessionUser);
        const data = await getBooks(sessionUser.id);
        setBooks(data);
        }
    }

    init();
    return () => { ignore = true };
    }, [router]);


  const handleAddBook = useCallback(async () => {
  const title = newBook.trim();
  if (!title || !user) return;

  setIsAddingBook(true);

  // Fetch cover
  const cover_url = await fetchBookCover(title);

  // Save to database
  await addBook({
    user_id: user.id,
    title,
    status: "reading",
    notes: "",
    cover_url,
  });

  // Reload from DB
  const updated = await getBooks(user.id);
  setBooks(updated);
  setNewBook("");
  setIsAddingBook(false);
}, [newBook, user]);


  const handleDeleteBook = useCallback(
    async (bookId) => {
      await deleteBookDB(bookId);
      const updated = await getBooks(user.id);
      setBooks(updated);
    },
    [user]
  );

  const handleUpdateBook = useCallback(
    async (bookId, key, value) => {
      await updateBookDB(bookId, { [key]: value });
      const updated = await getBooks(user.id);
      setBooks(updated);
    },
    [user]
  );

  const handleLogout = useCallback(async () => {
  await logout();
  router.push("/login");
}, []);

  const filteredBooks =
    filter === "all" ? books : books.filter((book) => book.status === filter);

    if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <Loader2 className="h-8 w-8 animate-spin text-amber-800" />
      <span className="ml-3 text-lg font-medium text-amber-800">
        Loading your library...
      </span>
    </div>
  );
}


  return (
    <div className={`min-h-screen ${BG_COLOR}`}>
      {/* HEADER */}
      <header className="sticky top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className={`text-xl font-serif font-bold ${TEXT_COLOR}`}>
           Welcome, {user?.profile?.display_name || user?.profile?.username || "Reader"}!
          </h1>

          <div className="flex gap-3">
            {user && (
              <Button
                variant="outline"
                onClick={() => router.push(`/u/${user.profile.username}`)}
                className="border-amber-400 text-amber-700 hover:bg-amber-100"
              >
                Share Profile
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-stone-400 text-stone-700 hover:bg-stone-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Add Book */}
        <section className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <h2 className={`text-xl font-semibold mb-4 ${ACCENT_COLOR}`}>
            Add a Book
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              ref={bookInputRef}
              placeholder="Enter book title..."
              value={newBook}
              onChange={(e) => setNewBook(e.target.value)}
              disabled={isAddingBook}
            />

            <Button
              onClick={handleAddBook}
              disabled={isAddingBook}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              {isAddingBook ? <Loader2 className="animate-spin" /> : "Add Book"}
            </Button>
          </div>
        </section>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8">
          {FILTERS.map(({ value, label, Icon }) => (
            <Button
              key={value}
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
              className={
                filter === value
                  ? "bg-amber-700 hover:bg-amber-800 text-white"
                  : "hover:bg-amber-100 border-amber-300 text-amber-700"
              }
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDeleteBook}
                onUpdate={handleUpdateBook}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
