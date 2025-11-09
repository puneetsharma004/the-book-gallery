import { create } from "zustand";
import { getBooks, addBook, updateBook, deleteBook } from "@/lib/books";

export const useBooksStore = create((set, get) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await getBooks(userId);
      set({ books: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Optimistic update - UI updates immediately
  addBookToStore: async (book) => {
    try {
      const newBook = await addBook(book);
      set((state) => ({
        books: [newBook, ...state.books] // Add to beginning
      }));
      return newBook;
    } catch (error) {
      // console.error('Error adding book:', error);
      throw error;
    }
  },

  updateBookInStore: async (id, updates, userId) => {
    // Optimistic update
    set((state) => ({
      books: state.books.map(book => 
        book.id === id ? { ...book, ...updates } : book
      )
    }));

    try {
      await updateBook(id, updates);
    } catch (error) {
      // Rollback on error
      await get().fetchBooks(userId);
      throw error;
    }
  },

  deleteBookFromStore: async (id, userId) => {
    // Optimistic update
    const previousBooks = get().books;
    set((state) => ({
      books: state.books.filter(book => book.id !== id)
    }));

    try {
      await deleteBook(id);
    } catch (error) {
      // Rollback on error
      set({ books: previousBooks });
      throw error;
    }
  },
}));
