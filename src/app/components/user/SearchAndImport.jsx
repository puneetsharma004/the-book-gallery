"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Plus } from "lucide-react";
import SearchSuggestions from "./SearchSuggestions";
import SearchResults from "./SearchResults";

export default function SearchAndImport({
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
  searchResults,
  searchError,
  suggestions,
  isSuggesting,
  onSuggestionClick,
  onAddBook,
}) {
  return (
    <section className="mb-6 sm:mb-8 md:mb-10 p-4 sm:p-5 md:p-6 glass rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Search & Import</h2>
        <span className="text-xs sm:text-sm text-stone-400 sm:text-stone-500">Powered by Open Library</span>
      </div>

      <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search by title, author, or ISBN…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 sm:h-12 pl-4 pr-4 bg-white/10 text-sm sm:text-base text-white placeholder-white/40 border border-white/20 focus:border-white/40 focus:ring-white/40 backdrop-blur-lg rounded-xl"
          />

          <SearchSuggestions
            suggestions={suggestions}
            isSuggesting={isSuggesting}
            onSelect={onSuggestionClick}
          />
        </div>

        <Button
          type="submit"
          className="h-11 sm:h-12 px-4 sm:px-5 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition rounded-xl backdrop-blur-md w-full sm:w-auto"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm sm:text-base">Searching</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span className="ml-2 text-sm sm:text-base">Search</span>
            </>
          )}
        </Button>
      </form>

      <SearchResults
        searchError={searchError}
        searchQuery={searchQuery}
        isSearching={isSearching}
        results={searchResults}
        onAddBook={onAddBook}
      />
    </section>
  );
}
