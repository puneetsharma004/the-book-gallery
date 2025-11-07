import { create } from "zustand";
import { getBooks, addBook, updateBook, deleteBook } from "@/lib/books";

export const useBooksStore = create((set, get) => ({
  books: [],
  loading: false,

  fetchBooks: async (userId) => {
    set({ loading: true });
    const data = await getBooks(userId);
    set({ books: data, loading: false });
  },

  addBookToStore: async (book) => {
    await addBook(book);
    await get().fetchBooks(book.user_id);
  },

  updateBookInStore: async (id, updates, userId) => {
    await updateBook(id, updates);
    await get().fetchBooks(userId);
  },

  deleteBookFromStore: async (id, userId) => {
    await deleteBook(id);
    await get().fetchBooks(userId);
  },
}));
