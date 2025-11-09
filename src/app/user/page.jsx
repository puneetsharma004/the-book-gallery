"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadCoverImage } from "@/lib/upload";
import { Loader2 } from "lucide-react";

import { useUserStore } from "@/lib/store/useUserStore";
import { useBooksStore } from "@/lib/store/useBookStore";
import { useBookSearch } from "@/hooks/useBookSearch";

// Components
import UserHeader from "../components/user/UserHeader";
import SearchAndImport from "../components/user/SearchAndImport";
import ManualAddSection from "../components/user/ManualAddSection";
import LibrarySearch from "../components/user/LibrarySearch";
import LibraryFilters from "../components/user/LibraryFilters";
import BookGrid from "../components/user/BookGrid";
import AddBookModal from "../components/user/AddBookModal";
import ManualBookModal from "../components/user/ManualBookModal";
import BookGalleryLoader from "../components/common/BookGalleryLoader";

export default function UserPage() {
  const router = useRouter();

  const { user, loadUser, logoutUser } = useUserStore();
  const { books, fetchBooks, addBookToStore, updateBookInStore, deleteBookFromStore } = useBooksStore();

  const [filter, setFilter] = useState("all");
  const [librarySearch, setLibrarySearch] = useState("");

  // Search hook
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    searchError,
    suggestions,
    isSuggesting,
    setSuggestions,
    performSearch,
  } = useBookSearch();

  // Add Book Modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("reading");
  const [modalNotes, setModalNotes] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Manual Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualStatus, setManualStatus] = useState("reading");
  const [manualFile, setManualFile] = useState(null);
  const [manualPreview, setManualPreview] = useState(null);
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Load user & books
  useEffect(() => {
    (async () => {
      await loadUser();
      if (!useUserStore.getState().user) return router.push("/login");
      await fetchBooks(useUserStore.getState().user.id);
    })();
  }, [loadUser, fetchBooks, router]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside() {
      setSuggestions([]);
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Handlers
  const handleLogout = useCallback(async () => {
    await logoutUser();
    router.push("/login");
  }, [logoutUser, router]);

  const handleDeleteBook = useCallback(
    async (bookId) => {
      const p = (async () => {
        await deleteBookFromStore(bookId, user.id);
      })();

      toast.promise(p, {
        loading: "Removing…",
        success: "Removed from your library",
        error: "Failed to remove",
      });

      await p;
    },
    [user, deleteBookFromStore]
  );

  const handleUpdateBook = useCallback(
    async (bookId, key, value) => {
      await updateBookInStore(bookId, { [key]: value }, user.id);
    },
    [user, updateBookInStore]
  );

  const handleAddBookClick = (book) => {
    setSelectedBook(book);
    setModalStatus("reading");
    setModalNotes("");
    setShowAddModal(true);
  };

  // Add this new handler for search result books
  const handleAddSearchBook = async () => {
    if (!selectedBook || !user) return;
    
    // Check if book already exists
    if (hasBook(selectedBook.title)) {
      toast.error("You already added this book 📚");
      return;
    }

    setModalSubmitting(true);

    const p = (async () => {
      await addBookToStore({
        user_id: user.id,
        title: selectedBook.title,
        author: selectedBook.author, // if your book object has this
        cover_url: selectedBook.cover_url, // or thumbnail, depending on your search result structure
        status: modalStatus,
        notes: modalNotes,
      });
    })();

    toast.promise(p, {
      loading: "Adding book...",
      success: `Added "${selectedBook.title}"`,
      error: "Failed to add book",
    });

    try {
      await p;
      setShowAddModal(false);
      setSelectedBook(null);
    } finally {
      setModalSubmitting(false);
    }
  };


  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setSuggestions([]);
    performSearch();
    setIsSuggesting(false);
    setSuggestions([]);
  };

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
      success: `Added "${manualTitle}"`,
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

  const handleManualFileChange = (file) => {
    setManualFile(file);
    const r = new FileReader();
    r.onloadend = () => setManualPreview(r.result);
    r.readAsDataURL(file);
  };

  const handleManualFileRemove = () => {
    setManualFile(null);
    setManualPreview(null);
  };

  const handleManualModalClose = () => {
    setShowManualModal(false);
    setManualTitle("");
    setManualNotes("");
    setManualFile(null);
    setManualPreview(null);
  };

  function hasBook(title) {
    return books.some((b) => b.title.toLowerCase() === title.toLowerCase());
  }

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === "all" || book.status === filter;
    const q = librarySearch.toLowerCase().trim();
    const matchesLocalSearch =
      q.length === 0 ||
      book.title.toLowerCase().includes(q) ||
      (book.notes && book.notes.toLowerCase().includes(q));
    return matchesFilter && matchesLocalSearch;
  });

  if (!user) {
    return (
      <BookGalleryLoader />
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-8">
      <UserHeader user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <SearchAndImport
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={performSearch}
          isSearching={isSearching}
          searchResults={searchResults}
          searchError={searchError}
          suggestions={suggestions}
          isSuggesting={isSuggesting}
          onSuggestionClick={handleSuggestionClick}
          onAddBook={handleAddBookClick}
        />

        <ManualAddSection onOpenModal={() => setShowManualModal(true)} />

        <LibrarySearch value={librarySearch} onChange={setLibrarySearch} />

        <LibraryFilters activeFilter={filter} onFilterChange={setFilter} />

        <BookGrid
          books={filteredBooks}
          onDelete={handleDeleteBook}
          onUpdate={handleUpdateBook}
        />

        <AddBookModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          book={selectedBook}
          status={modalStatus}
          notes={modalNotes}
          onStatusChange={setModalStatus}
          onNotesChange={setModalNotes}
          onSubmit={handleAddSearchBook} 
          isSubmitting={modalSubmitting}
        />

        <ManualBookModal
          isOpen={showManualModal}
          onClose={handleManualModalClose}
          title={manualTitle}
          notes={manualNotes}
          status={manualStatus}
          file={manualFile}
          preview={manualPreview}
          onTitleChange={setManualTitle}
          onNotesChange={setManualNotes}
          onStatusChange={setManualStatus}
          onFileChange={handleManualFileChange}
          onFileRemove={handleManualFileRemove}
          onSubmit={handleManualAddBook}
          isSubmitting={manualSubmitting}
        />
      </main>
    </div>
  );
}
