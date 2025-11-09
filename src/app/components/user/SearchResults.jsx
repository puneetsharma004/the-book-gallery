"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SearchResults({ searchError, searchQuery, isSearching, results, onAddBook }) {
  return (
    <div className="mt-4 sm:mt-6">
      {searchError && (
        <div className="text-xs sm:text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-3">
          {searchError}
        </div>
      )}

      {!isSearching && results.length === 0 && searchQuery && !searchError && (
        <div className="text-xs sm:text-sm text-stone-400 text-center py-8">No results found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {results.map((r) => (
          <Card 
            key={`${r.ol_key}-${r.isbn || r.title}`} 
            className="glass border border-white/10 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col overflow-hidden"
          >
            {/* Main Content Section */}
            <CardContent className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-start flex-1">
              <div className="w-12 h-16 sm:w-16 sm:h-20 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                {r.cover_url && (
                  <img 
                    src={r.cover_url} 
                    alt={r.title} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base text-white line-clamp-2 mb-1">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 truncate">
                  {r.author}
                </p>
                {r.year && (
                  <p className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">
                    {r.year}
                  </p>
                )}
              </div>
            </CardContent>

            {/* Footer Section with Button */}
            <div className="border-t border-white/10 p-2 sm:p-3 bg-white/5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddBook(r)}
                className="w-full border-amber-400/50 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 text-xs sm:text-sm h-9 sm:h-10 transition-all"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Add to Library
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
