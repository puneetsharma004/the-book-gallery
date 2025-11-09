"use client";

import { BookOpen, List, CheckCircle, Pencil } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: "Reading", Icon: BookOpen },
  { value: "want", label: "Want to Read", Icon: Pencil },
  { value: "read", label: "Read", Icon: CheckCircle },
];

export default function LibraryFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex justify-center gap-3 mb-8 flex-wrap select-none">
      {FILTERS.map(({ value, label, Icon }) => {
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium
                transition-all duration-300 backdrop-blur-lg border whitespace-nowrap flex-shrink-0
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
  );
}
