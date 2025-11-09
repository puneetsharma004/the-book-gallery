"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import toast from "react-hot-toast";
import { uploadCoverImage } from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchGoogleBooks } from "@/lib/googleBooks";
import { motion } from "framer-motion";

import {
  BookOpen,
  List,
  CheckCircle,
  Pencil,
  Loader2,
  Search,
  Plus,
  ImageIcon,
  Upload,
  Check,
  X,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { BookCard } from "../components/user/BookList";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


import { useUserStore } from "@/lib/store/useUserStore";
import { useBooksStore } from "@/lib/store/useBookStore";




// THEME
const ACCENT_COLOR = "text-amber-800";

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: "Reading", Icon: BookOpen },
  { value: "want", label: "Want to Read", Icon: Pencil },
  { value: "read", label: "Read", Icon: CheckCircle },
];

// Build a cover URL from OpenLibrary data
function buildCoverUrl(doc) {
  // prefer cover_i
  if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  // fall back to ISBN cover if present
  const isbn = (doc.isbn && doc.isbn[0]) || null;
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  return null;
}

// Map OpenLibrary doc → our app book preview
function mapDocToPreview(doc) {
  return {
    ol_key: doc.key, // e.g. "/works/OL12345W"
    title: doc.title ?? "Untitled",
    author: (doc.author_name && doc.author_name.join(", ")) || "Unknown author",
    year: doc.first_publish_year || doc.publish_year?.[0] || "",
    cover_url: buildCoverUrl(doc),
    isbn: (doc.isbn && doc.isbn[0]) || "",
  };
}

export default function UserPage() {
  const router = useRouter();
  const bookInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const { user, loadUser, logoutUser  } = useUserStore();
  const { books, fetchBooks, addBookToStore, updateBookInStore, deleteBookFromStore } = useBooksStore();

  const [filter, setFilter] = useState("all");

  // Search & Import
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("any"); // any | title | author | isbn
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("reading");
  const [modalNotes, setModalNotes] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualStatus, setManualStatus] = useState("reading");
  const [manualFile, setManualFile] = useState(null);
  const [manualPreview, setManualPreview] = useState(null);
  const [manualSubmitting, setManualSubmitting] = useState(false);



useEffect(() => {
  const q = searchQuery.trim();
  if (!q) {
    setSuggestions([]);
    return;
  }

  const delay = setTimeout(async () => {
    setIsSuggesting(true);
    try {
      // === 1) Fetch OpenLibrary
      const olRes = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8`
      );
      const olData = await olRes.json();
      const olSuggestions = (olData.docs || []).map((doc) => ({
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown",
        cover: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
          : null,
        source: "openlibrary",
      }));

      // === 2) Fetch Google Books
      const gbRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=8&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      const gbData = await gbRes.json();
      const gbSuggestions = (gbData.items || []).map((item) => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", ") || "Unknown",
        cover: item.volumeInfo.imageLinks?.thumbnail || null,
        source: "google",
      }));

      // === 3) Combine + Remove Duplicates (by Title match)
      const merged = [...olSuggestions, ...gbSuggestions];
      const seen = new Set();
      const unique = merged.filter((book) => {
        const key = book.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // === 4) Fuzzy Rank
      const fuse = new Fuse(unique, {
        keys: ["title", "author"],
        threshold: 0.35,
      });

      const ranked = fuse.search(q).map((r) => r.item);

      setSuggestions(ranked.slice(0, 10));
    } finally {
      setIsSuggesting(false);
    }
  }, 300);

  return () => clearTimeout(delay);
}, [searchQuery]);


useEffect(() => {
  function handleClickOutside() {
    setSuggestions([]);
  }
  window.addEventListener("click", handleClickOutside);
  return () => window.removeEventListener("click", handleClickOutside);
}, []);


const handleManualAddBook = async () => {
  if (hasBook(manualTitle)) {
  toast.error("You already added this book 📚");
  setManualSubmitting(false);
  return;
}

  if (!manualTitle.trim() || !user) return;

  setManualSubmitting(true);

  const p = (async () => {
    let cover_url = null;

    if (manualFile) {
      cover_url = await uploadCoverImage(manualFile, user.id);
    }

    await addBookToStore({
      user_id: user.id,
      title: manualTitle.trim(),
      status: manualStatus,
      notes: manualNotes,
      cover_url,
    });

    setManualTitle("");
    setManualNotes("");
    setManualFile(null);
  })();

  toast.promise(p, {
    loading: "Saving...",
    success: `Added “${manualTitle}”`,
    error: "Failed to save book",
  });

  try {
    await p;
    setShowManualModal(false);
  } finally {
    setManualSubmitting(false);
  }
  setManualPreview(null);
  setManualFile(null);
};


useEffect(() => {
  (async () => {
    await loadUser();
    if (!useUserStore.getState().user) return router.push("/login");
    await fetchBooks(useUserStore.getState().user.id);
  })();
}, [loadUser, fetchBooks, router]);




  // Delete
  const handleDeleteBook = useCallback(async (bookId) => {
    const p = (async () => {
      await deleteBookFromStore(bookId, user.id);
    })();

    toast.promise(p, {
      loading: "Removing…",
      success: "Removed from your library",
      error: "Failed to remove",
    });

    await p;
  }, [user]);


  // Update (status / notes)
  const handleUpdateBook = useCallback(
    async (bookId, key, value) => {
      await updateBookInStore(bookId, { [key]: value }, user.id)
    },
    [user]
  );

  // Logout
  const handleLogout = useCallback(async () => {
    await logoutUser();
    router.push("/login");
  }, [logoutUser, router]);


  // Filter + (local) search over user's library
  const [librarySearch, setLibrarySearch] = useState("");
  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === "all" || book.status === filter;
    const q = librarySearch.toLowerCase().trim();
    const matchesLocalSearch =
      q.length === 0 ||
      book.title.toLowerCase().includes(q) ||
      (book.notes && book.notes.toLowerCase().includes(q));
    return matchesFilter && matchesLocalSearch;
  });

  // --- OpenLibrary Search (Title/Author/ISBN/Any) ---
  function buildSearchUrl(q, type) {
    const base = "https://openlibrary.org/search.json";
    const params = new URLSearchParams();
    params.set("limit", "20");

    // OpenLibrary supports q (any), title, author, isbn
    const query = q.trim();
    if (type === "title") params.set("title", query);
    else if (type === "author") params.set("author", query);
    else if (type === "isbn") params.set("isbn", query);
    else params.set("q", query); // 'any' fuzzy-ish

    // fields param improves perf, but OL ignores in some cases; we still set q/lists
    // We'll just map available fields robustly.
    return `${base}?${params.toString()}`;
  }

  const performSearch = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const q = searchQuery.trim();
      if (!q) return;

      setSuggestions([]);
      setIsSearching(true);
      setSearchError("");
      setSearchResults([]);

      try {
        // 1) Fetch OpenLibrary
        const olUrl = buildSearchUrl(q, searchType);
        const olRes = await fetch(olUrl).then((r) => r.json()).catch(() => null);
        const olDocs = Array.isArray(olRes?.docs) ? olRes.docs.map(mapDocToPreview) : [];

        // 2) Fetch Google
        const googleDocs = await searchGoogleBooks(q);

        // 3) Merge & remove duplicates by title
        const merged = [...olDocs, ...googleDocs].filter(
          (v, i, a) =>
            a.findIndex((t) => t.title.toLowerCase() === v.title.toLowerCase()) === i
        );

        setSearchResults(merged);
      } catch (err) {
        setSearchError("Could not fetch results. Please try again.");
        toast.error("Search failed");
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, searchType]
  );

  function hasBook(title) {
  return books.some((b) => b.title.toLowerCase() === title.toLowerCase());
}



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
   <div className="min-h-screen w-full bg-linear-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-8">
 
       {/* HEADER */}
      <header className="sticky top-0 z-20 w-full glass backdrop-blur-xl border-b rounded-2xl border-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.4)]">
  <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    
    <h1 className="text-lg md:text-2xl font-serif font-bold text-white">
      Welcome, {user?.profile?.display_name || user?.profile?.username || "Reader"}!
    </h1>

    {/* Right Buttons */}
    <div className="flex gap-2 md:gap-4">
      
      <Button
        variant="outline"
        onClick={() => router.push(`/u/${user.profile.username}`)}
        className="text-white border-white/30 hover:bg-white/10 hover:border-white/40 transition"
      >
        Share Profile
      </Button>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="text-white border-white/30 hover:bg-white/10 hover:border-white/40 transition"
      >
        Logout
      </Button>

    </div>
  </div>
      </header>




      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* ======= SEARCH & IMPORT (OpenLibrary) ======= */}
        <section className="mb-10 p-6 glass rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/10">

          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className={`text-xl font-semibold ${ACCENT_COLOR}`}>Search & Import</h2>
            <span className="text-sm text-stone-500">
              Powered by Open Library
            </span>
          </div>
          

          <form onSubmit={performSearch} className="grid grid-cols-1 sm:grid-cols-[1fr_170px] gap-3">
            {/* SEARCH BAR WITH AUTOSUGGEST */}
          <div className="relative mb-6">
            <Input
              ref={searchInputRef}
              placeholder="Search by title, author, or ISBN…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-4 pr-4 bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-white/40 focus:ring-white/40 backdrop-blur-lg rounded-xl"
            />


            {/* SUGGESTIONS LIST */}
            {suggestions.length > 0 && !isSuggesting && (
              <ul className="absolute left-0 right-0 z-30 mt-2 bg-[#0f1629]/90 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-white/5">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery(s.title);
                      setSuggestions([]);
                      performSearch();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearchQuery(s.title);
                        setSuggestions([]);
                        performSearch();
                      }
                    }}
                  >
                    {s.cover ? (
                      <img src={s.cover} className="w-8 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-10 rounded bg-white/10" />
                    )}

                    <div>
                      <p className="font-medium text-white">{s.title}</p>
                      <p className="text-xs text-white/60">{s.author}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

          </div>

            <Button 
                type="submit"
                className="h-12 px-5 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition rounded-xl backdrop-blur-md"
              >

              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Search
                </>
              )}
            </Button>
          </form>

          {/* Results */}
          <div className="mt-6">
            {searchError && (
              <div className="text-sm text-red-600 mb-3">{searchError}</div>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery && !searchError && (
              <div className="text-sm text-stone-500">No results found.</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((r) => (
                <Card key={`${r.ol_key}-${r.isbn || r.title}`} className="glass border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="w-16 h-20 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                      {r.cover_url ? (
                        <img
                          src={r.cover_url}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-sm text-stone-600">{r.author}</div>
                      {r.year && (
                        <div className="text-xs text-stone-500 mt-1">
                          {r.year}
                        </div>
                      )}

                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBook(r);
                            setModalStatus("reading");
                            setModalNotes("");
                            setShowAddModal(true);
                          }}
                          className="border-amber-400 text-amber-700 hover:bg-amber-100"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Library
                        </Button>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ======= ADD BOOK (MANUAL) ======= */}
        <section className="mb-10 p-6 glass rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${ACCENT_COLOR}`}>
            Add a Book Manually
          </h2>

          <Button
            onClick={() => setShowManualModal(true)}
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-xl backdrop-blur-md"
          >
            + Add Book
          </Button>
        </section>


        {/* ======= LIBRARY FILTERS + SEARCH ======= */}
        <div className="mb-6 max-w-xl mx-auto relative">
          <Input
            placeholder="Search your library…"
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
            className="h-12 pl-11 pr-4 w-full text-white placeholder-white/40 
                      bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg
                      focus:border-white/40 focus:ring-white/30 transition-all"
          />

          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z" />
          </svg>
        </div>


        <div className="flex justify-center gap-3 mb-8 flex-wrap select-none">

          {FILTERS.map(({ value, label, Icon }) => {
            const isActive = filter === value;

            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300 backdrop-blur-lg border 
                  ${
                    isActive
                      ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)] scale-[1.05]"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}

        </div>


        {/* ======= BOOK GRID ======= */}
        <AnimatePresence mode="popLayout">
          {filteredBooks.length === 0 ? (
            <div className="text-center text-white/50 py-16 text-sm">
              No books found.
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filteredBooks.map((book, index) => (
                <motion.div 
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 160 }}
                >
                  <BookCard
                    book={book}
                    onDelete={handleDeleteBook}
                    onUpdate={handleUpdateBook}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>


        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <AnimatePresence>
            {showAddModal && (
              <DialogContent
                forceMount
                className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.65)] text-white"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >

                  {/* HEADER */}
                  <div className="p-5 border-b border-white/10 bg-white/5">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Plus className="h-5 w-5 text-white/80" />
                        Add to Library
                      </DialogTitle>
                      <DialogDescription className="text-white/50 text-sm">
                        Confirm details & set your reading status.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  {/* CONTENT BODY */}
                  {selectedBook && (
                    <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-none">

                      {/* COVER PREVIEW */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={selectedBook.cover_url || "/placeholder-book.png"}
                            alt={selectedBook.title}
                            className="w-28 h-44 object-cover rounded-md shadow-xl"
                          />
                          <div className="absolute left-0 top-0 w-[6px] h-full bg-gradient-to-r from-white/25 to-transparent rounded-l-md" />
                        </div>
                      </div>

                      {/* Title & Author */}
                      <div className="text-center">
                        <h2 className="font-semibold text-lg">{selectedBook.title}</h2>
                        {selectedBook.author && (
                          <p className="text-white/60 text-sm mt-1">{selectedBook.author}</p>
                        )}
                      </div>

                      {/* STATUS SELECTOR */}
                      <div>
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-white/60" />
                          Reading Status
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "reading", label: "Reading", icon: "📖" },
                            { value: "want", label: "Want", icon: "📝" },
                            { value: "read", label: "Finished", icon: "✅" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setModalStatus(option.value)}
                              className={`p-3 rounded-md border backdrop-blur-md transition text-center
                                ${
                                  modalStatus === option.value
                                    ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                }`}
                            >
                              <div className="text-lg">{option.icon}</div>
                              <div className="text-[11px] mt-1">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* NOTES */}
                      <div>
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                          <Pencil className="h-4 w-4 text-white/60" />
                          Personal Notes
                        </label>
                        <textarea
                          className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-sm focus:border-white/40 focus:ring-white/20 transition resize-none"
                          placeholder="Optional thoughts, quotes, or summaries..."
                          value={modalNotes}
                          onChange={(e) => setModalNotes(e.target.value)}
                          rows={4}
                        />
                      </div>

                    </div>
                  )}

                  {/* FOOTER */}
                  <DialogFooter className="p-4 border-t border-white/10 flex gap-3 justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAddModal(false)}
                      className="text-white/70 hover:bg-white/10 hover:text-white rounded-md"
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={modalSubmitting}
                      onClick={handleManualAddBook}
                      className="bg-white/20 border border-white/40 hover:bg-white/30 text-white font-medium rounded-md px-6 transition"
                    >
                      {modalSubmitting ? "Adding..." : "Add Book"}
                    </Button>
                  </DialogFooter>

                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>



        <Dialog open={showManualModal} onOpenChange={(open) => {
          setShowManualModal(open);
          if (!open) {
            setManualTitle("");
            setManualNotes("");
            setManualFile(null);
            setManualPreview(null);
          }
        }}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.6)]">

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full text-white"
            >

              {/* Header */}
              <div className="p-5 border-b border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-white/70" />
                    Add Book Manually
                  </DialogTitle>
                  <DialogDescription className="text-white/50 text-sm">
                    Create a custom entry for your library.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">

                {/* Book Title */}
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-white/60" />
                    Book Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Enter book title…"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="h-11 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl backdrop-blur-lg focus:border-white/40 focus:ring-white/40 transition"
                    required
                  />
                </div>

                {/* Cover Upload */}
                <div>
                  <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-white/60" />
                    Cover Image <span className="text-xs text-white/40">(optional)</span>
                  </label>

                  {manualPreview ? (
                    <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                      <div className="relative">
                        <img
                          src={manualPreview}
                          alt="Cover preview"
                          className="w-28 h-40 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute left-0 top-0 w-[6px] h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-lg" />
                      </div>

                      <div className="flex flex-col justify-center gap-2 text-white/80">
                        <span className="text-sm">{manualFile?.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setManualFile(null); setManualPreview(null); }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById("cover-upload").click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file?.type.startsWith("image/")) {
                          setManualFile(file);
                          const r = new FileReader();
                          r.onloadend = () => setManualPreview(r.result);
                          r.readAsDataURL(file);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="border border-white/20 bg-white/5 rounded-xl p-10 text-center backdrop-blur-lg cursor-pointer hover:bg-white/10 transition"
                    >
                      <Upload className="mx-auto h-8 w-8 mb-3 text-white/60" />
                      <p className="text-white/70">Click to upload or drag here</p>

                      <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setManualFile(file);
                            const r = new FileReader();
                            r.onloadend = () => setManualPreview(r.result);
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Options */}
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white/60" />
                    Reading Status
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "reading", label: "Reading", icon: "📖" },
                      { value: "want", label: "Want", icon: "📝" },
                      { value: "read", label: "Finished", icon: "✅" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setManualStatus(option.value)}
                        className={`p-4 rounded-xl text-center border backdrop-blur-sm transition
                          ${
                            manualStatus === option.value
                              ? "bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.05]"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-xs block mt-1">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-white/60" />
                    Notes <span className="text-xs text-white/40">(optional)</span>
                  </label>

                  <textarea
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-sm focus:border-white/40 focus:ring-white/30 transition resize-none"
                    placeholder="Thoughts, quotes, reflections..."
                  />
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-4 border-t border-white/10 flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowManualModal(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </Button>

                <Button
                  disabled={manualSubmitting || !manualTitle.trim()}
                  onClick={handleManualAddBook}
                  className="bg-white/15 border border-white/30 text-white hover:bg-white/20 rounded-lg px-6 backdrop-blur-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {manualSubmitting ? "Adding…" : "Add Book"}
                </Button>
              </DialogFooter>

            </motion.div>

          </DialogContent>
        </Dialog>




      </main>
    </div>
  );
}
