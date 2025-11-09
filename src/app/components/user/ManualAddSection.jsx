"use client";

import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";

export default function ManualAddSection({ onOpenModal }) {
  return (
    <section className="mb-6 sm:mb-8 md:mb-10 p-4 sm:p-5 md:p-6 glass rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
        Add a Book Manually
      </h2>

      <Button
        onClick={onOpenModal}
        className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-xl backdrop-blur-md w-full sm:w-auto"
      >
        <BookPlus className="h-4 w-4" />
        <span className="ml-2">Add Book</span>
      </Button>
    </section>
  );
}
