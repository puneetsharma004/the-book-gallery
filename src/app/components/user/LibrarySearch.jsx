"use client";

import { Input } from "@/components/ui/input";

export default function LibrarySearch({ value, onChange }) {
  return (
    <div className="mb-6 max-w-xl mx-auto relative">
      <Input
        placeholder="Search your library…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-11 pr-4 w-full text-white placeholder-white/40 
                  bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg
                  focus:border-white/40 focus:ring-white/30 transition-all"
      />

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
  );
}
