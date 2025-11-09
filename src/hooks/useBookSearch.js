"use client";

import { useState, useEffect, useCallback } from "react";
import Fuse from "fuse.js";
import { searchGoogleBooks } from "@/lib/googleBooks";

export function useBookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("any");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Auto-suggest logic
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      setIsSuggesting(true);
      try {
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

        const merged = [...olSuggestions, ...gbSuggestions];
        const seen = new Set();
        const unique = merged.filter((book) => {
          const key = book.title.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

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
        // Your existing search logic here
        const olUrl = buildSearchUrl(q, searchType);
        const olRes = await fetch(olUrl).then((r) => r.json()).catch(() => null);
        const olDocs = Array.isArray(olRes?.docs) ? olRes.docs.map(mapDocToPreview) : [];

        const googleDocs = await searchGoogleBooks(q);

        const merged = [...olDocs, ...googleDocs].filter(
          (v, i, a) =>
            a.findIndex((t) => t.title.toLowerCase() === v.title.toLowerCase()) === i
        );

        setSearchResults(merged);
      } catch (err) {
        setSearchError("Could not fetch results. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, searchType]
  );

  return {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    isSearching,
    searchResults,
    searchError,
    suggestions,
    isSuggesting,
    setSuggestions,
    performSearch,
    setIsSuggesting
  };
}

function buildSearchUrl(q, type) {
  const base = "https://openlibrary.org/search.json";
  const params = new URLSearchParams();
  params.set("limit", "20");

  const query = q.trim();
  if (type === "title") params.set("title", query);
  else if (type === "author") params.set("author", query);
  else if (type === "isbn") params.set("isbn", query);
  else params.set("q", query);

  return `${base}?${params.toString()}`;
}

function buildCoverUrl(doc) {
  if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  const isbn = (doc.isbn && doc.isbn[0]) || null;
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  return null;
}

function mapDocToPreview(doc) {
  return {
    ol_key: doc.key,
    title: doc.title ?? "Untitled",
    author: (doc.author_name && doc.author_name.join(", ")) || "Unknown author",
    year: doc.first_publish_year || doc.publish_year?.[0] || "",
    cover_url: buildCoverUrl(doc),
    isbn: (doc.isbn && doc.isbn[0]) || "",
  };
}
