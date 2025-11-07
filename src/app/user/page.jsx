"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import toast from "react-hot-toast";
import { uploadCoverImage } from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
import { BookCard } from "../components/BookCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


import { useUserStore } from "@/lib/store/userStore";
import { useBooksStore } from "@/lib/store/useBookStore";



// THEME
const BG_COLOR = "bg-amber-50";
const TEXT_COLOR = "text-stone-900";
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
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
      );
      const data = await res.json();
      const raw = (data.docs || []).map((doc) => ({
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown",
        cover: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
          : null,
      }));

      // ✅ Fuzzy rank the suggestions
      const fuse = new Fuse(raw, {
        keys: ["title", "author"],
        threshold: 0.4, // lower → stricter match
      });

      const fuzzyResults = fuse.search(q).map((r) => r.item);

      // Keep only first 10 results
      setSuggestions(fuzzyResults.slice(0, 10));

    } finally {
      setIsSuggesting(false);
    }
  }, 300); // << Debounce 300ms

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

      // ✅ Hide suggestions when submitting search
      setSuggestions([]);

      try {
        setIsSearching(true);
        setSearchError("");
        setSearchResults([]);

        const url = buildSearchUrl(q, searchType);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        const docs = Array.isArray(data.docs) ? data.docs : [];
        const mapped = docs.map(mapDocToPreview);

        setSearchResults(mapped);

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
    <div className={`min-h-screen ${BG_COLOR}`}>
      {/* HEADER */}
      <header className="sticky top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className={`text-xl font-serif font-bold ${TEXT_COLOR}`}>
            Welcome,{" "}
            {user?.profile?.display_name || user?.profile?.username || "Reader"}!
          </h1>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/u/${user.profile.username}`)}
              className="border-amber-400 text-amber-700 hover:bg-amber-100"
            >
              Share Profile
            </Button>

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
        {/* ======= SEARCH & IMPORT (OpenLibrary) ======= */}
        <section className="mb-10 p-6 bg-white rounded-xl shadow-lg">
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
              className="h-10 border-stone-300 focus:border-amber-500"
            />

            {/* SUGGESTIONS LIST */}
            {isSuggesting && (
              <div className="absolute left-0 right-0 bg-white border border-stone-200 rounded-md shadow-md p-3 text-sm text-stone-500">
                Searching…
              </div>
            )}

            {!isSuggesting && suggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-stone-200 rounded-md shadow-md max-h-72 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery(s.title);
                      setSuggestions([]);
                      performSearch(); // Auto trigger search
                      // searchInputRef.current?.blur();  // ✅ Hide keyboard & remove focus
                      toast("Searching…", { icon: "🔎" });
                    }}
                    className="flex gap-3 items-center p-2 hover:bg-amber-50 cursor-pointer transition-colors"
                  >
                    {s.cover ? (
                      <img src={s.cover} className="w-8 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-10 bg-stone-200 rounded" />
                    )}

                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-stone-500">{s.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            <Button type="submit" className="h-10 bg-amber-700 hover:bg-amber-800 text-white">
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
                <Card key={`${r.ol_key}-${r.isbn || r.title}`}>
                  <CardContent className="p-4 flex gap-3">
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
        <section className="mb-10 p-6 bg-white rounded-xl shadow-lg flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${ACCENT_COLOR}`}>
            Add a Book Manually
          </h2>

          <Button
            onClick={() => setShowManualModal(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            + Add Book
          </Button>
        </section>


        {/* ======= LIBRARY FILTERS + SEARCH ======= */}
        <div className="mb-4 max-w-md mx-auto">
          <Input
            placeholder="Search within your library (title or notes)…"
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
            className="h-10 border-stone-300 focus:border-amber-500"
          />
        </div>

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

        {/* ======= BOOK GRID ======= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBooks.length === 0 ? (
              <div className="col-span-full text-center text-stone-500">
                No books found.
              </div>
            ) : (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onDelete={handleDeleteBook}
                  onUpdate={handleUpdateBook}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-linear-to-r from-amber-500 to-amber-600 px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add to Your Library
              </DialogTitle>
              <DialogDescription className="text-amber-50 text-sm mt-1">
                Choose how you want to track this book
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedBook && (
            <div className="p-6 space-y-6 bg-linear-to-br from-amber-100 to-orange-100">
              {/* Enhanced Book Preview Card */}
              <div className="flex gap-4 p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 shadow-sm">
                <div className="relative group flex-shrink-0">
                  <img
                    src={selectedBook.cover_url || "/placeholder-book.png"}
                    alt={selectedBook.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300 border border-stone-200"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-stone-900 mb-1 line-clamp-2">
                    {selectedBook.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-2 flex items-center gap-1">
                    <Pencil className="h-3 w-3" />
                    {selectedBook.author}
                  </p>
                  {selectedBook.year && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 text-amber-700 border border-amber-200">
                      📅 {selectedBook.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Selection with Visual Cards */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  Reading Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "reading", label: "Reading", icon: "📖", color: "blue" },
                    { value: "want", label: "Want to Read", icon: "📝", color: "amber" },
                    { value: "read", label: "Finished", icon: "✅", color: "green" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setModalStatus(option.value)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center gap-2 text-center
                        hover:scale-105 hover:shadow-md
                        ${
                          modalStatus === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                            : "border-stone-200 bg-white hover:border-amber-300"
                        }
                      `}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-xs font-medium ${
                        modalStatus === option.value ? "text-stone-900" : "text-stone-600"
                      }`}>
                        {option.label}
                      </span>
                      {modalStatus === option.value && (
                        <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Notes Section */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-amber-600" />
                  Personal Notes <span className="text-xs font-normal text-stone-500">(Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    className="w-full border-2 border-stone-200 rounded-xl p-3 text-sm resize-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-200 bg-white hover:border-stone-300"
                    placeholder="Add your thoughts, quotes, or reminders about this book..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-stone-400">
                    {modalNotes.length}/500
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer */}
          <DialogFooter className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex-row gap-3 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-stone-300 hover:bg-stone-100 text-stone-700"
            >
              Cancel
            </Button>
            
            <Button
              className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-6 flex items-center gap-2"
              onClick={async () => {
                if (!selectedBook) return;

                // ✅ Prevent duplicates
                if (hasBook(selectedBook.title)) {
                  toast.error("This book is already in your library 📚");
                  return;
                }

                setModalSubmitting(true);

                const p = (async () => {
                  await addBookToStore({
                    user_id: user.id,
                    title: selectedBook.title,
                    status: modalStatus,
                    notes: modalNotes,
                    cover_url: selectedBook.cover_url || null,
                  });
                })();

                toast.promise(p, {
                  loading: "Saving to your library…",
                  success: `Added “${selectedBook.title}”`,
                  error: "Could not save book",
                });

                try {
                  await p;
                  setShowAddModal(false);
                } finally {
                  setModalSubmitting(false);
                }
              }}
            >
              {modalSubmitting ? "Adding…" : "Add to Library"}
            </Button>

          </DialogFooter>
        </DialogContent>
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
          <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
            {/* Fixed Gradient Header - was "bg-linear-to-r" (wrong) */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 py-5">
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Book Manually
                </DialogTitle>
                <DialogDescription className="text-amber-100 text-sm mt-1">
                  Create a custom entry for your library
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-6 bg-white max-h-[600px] overflow-y-auto">
              {/* Book Title Input */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  Book Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter the book title..."
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="h-11 border-2 border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all"
                  required
                />
              </div>

              {/* Cover Image Upload with Preview */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-3 block flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-amber-600" />
                  Cover Image <span className="text-xs font-normal text-stone-500">(Optional)</span>
                </label>

                {/* Preview Area */}
                {manualPreview ? (
                  <div className="relative group">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                      <div className="relative">
                        <img
                          src={manualPreview}
                          alt="Book cover preview"
                          className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-white"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-700 mb-2">
                          📚 Cover Preview
                        </p>
                        <p className="text-xs text-stone-500 mb-3">
                          {manualFile?.name}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setManualFile(null);
                            setManualPreview(null);
                          }}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modern Drag & Drop Upload Area
                  <div
                    onClick={() => document.getElementById('cover-upload').click()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        setManualFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setManualPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-100/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                        <Upload className="h-8 w-8 text-amber-600" />
                      </div>
                      
                      <div>
                        <p className="font-semibold text-stone-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-stone-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-amber-400 text-amber-700 hover:bg-amber-100 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('cover-upload').click();
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>

                    <input
                      type="file"
                      id="cover-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setManualFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setManualPreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Reading Status - Visual Cards */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-3 block flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600" />
                  Reading Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "reading", label: "Reading", icon: "📖", color: "blue", bg: "bg-blue-50", border: "border-blue-500" },
                    { value: "want", label: "Want to Read", icon: "📝", color: "amber", bg: "bg-amber-50", border: "border-amber-500" },
                    { value: "read", label: "Finished", icon: "✅", color: "green", bg: "bg-green-50", border: "border-green-500" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setManualStatus(option.value)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center gap-2 text-center
                        hover:scale-105 hover:shadow-md
                        ${
                          manualStatus === option.value
                            ? `${option.border} ${option.bg} shadow-md`
                            : "border-stone-200 bg-white hover:border-amber-300"
                        }
                      `}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-xs font-medium ${
                        manualStatus === option.value ? "text-stone-900" : "text-stone-600"
                      }`}>
                        {option.label}
                      </span>
                      {manualStatus === option.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Textarea */}
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-amber-600" />
                  Personal Notes <span className="text-xs font-normal text-stone-500">(Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    className="w-full border-2 border-stone-200 rounded-xl p-4 text-sm resize-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-200 bg-white hover:border-stone-300"
                    placeholder="Add your thoughts, favorite quotes, or reminders about this book..."
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-stone-400 bg-white/90 px-2 py-1 rounded">
                    {manualNotes.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer with proper opacity */}
            <DialogFooter className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex-row gap-3 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowManualModal(false);
                  setManualPreview(null);
                  setManualFile(null);
                }}
                className="border-stone-300 hover:bg-stone-100 text-stone-700 font-medium"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              <Button
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={manualSubmitting || !manualTitle.trim()}
                onClick={handleManualAddBook}
              >
                {manualSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Library
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



      </main>
    </div>
  );
}
