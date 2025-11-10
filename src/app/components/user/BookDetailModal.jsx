"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import BookShowcase from "../common/BookShowcase";
import toast from "react-hot-toast";


export function BookDetailModal({
  book,
  isOpen,
  onOpenChange,
  onUpdate,
  onDelete,
}) {
  if (!book) return null;

  // ✅ Local editing state
  const [localStatus, setLocalStatus] = useState(book.status || "");
  const [localNotes, setLocalNotes] = useState(book.notes || "");

  // ✅ Restore state when book changes or modal reopens
  useEffect(() => {
    if (book) {
      setLocalStatus(book.status || "");
      setLocalNotes(book.notes || "");
    }
  }, [book, isOpen]);

  // ✅ Optional: Auto-save notes draft to localStorage (safety net)
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(`book-${book.id}-notes-draft`, localNotes);
    }
  }, [localNotes, isOpen, book.id]);

  // ✅ Restore saved draft if exists
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem(`book-${book.id}-notes-draft`);
      if (draft) setLocalNotes(draft);
    }
  }, [isOpen, book.id]);

  const handleStatusUpdate = (newStatus) => {
    setLocalStatus(newStatus);
  };

  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
  };

  const handleDelete = () => {
    onDelete(book.id, book.title);
    localStorage.removeItem(`book-${book.id}-notes-draft`);
    onOpenChange(false);
  };

  const handleDone = () => {
    onUpdate(book.id, "status", localStatus);
    onUpdate(book.id, "notes", localNotes);
    localStorage.removeItem(`book-${book.id}-notes-draft`);
    onOpenChange(false);

    toast.success(`Changes saved for "${book.title}"`, {
      style: {
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
      },
      icon: "✅",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent 
    className="
      w-[95vw] max-w-md 
      max-h-[90vh]
      sm:max-h-[85vh]
      p-0 
      overflow-hidden 
      rounded-2xl 
      border border-white/10 
      backdrop-blur-xl 
      bg-white/10 
      shadow-[0_8px_50px_rgba(0,0,0,0.65)] 
      text-white 
      flex flex-col
    "
    style={{ zIndex: 9999 }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full max-h-[90vh] sm:max-h-[85vh]"
    >
      {/* HEADER - Fixed at top */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/5 flex-shrink-0">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-semibold line-clamp-2">
            {book.title}
          </DialogTitle>
          {book.author && (
            <DialogDescription className="text-white/50 text-xs sm:text-sm">
              {book.author}
            </DialogDescription>
          )}
        </DialogHeader>
      </div>

      {/* BODY - Scrollable content */}
      <div 
        className="
          p-4 sm:p-6 
          space-y-4 sm:space-y-6 
          overflow-y-auto 
          overflow-x-hidden
          flex-1
          min-h-0
        "
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}
      >
        {/* COVER */}
        <div className="flex justify-center">
          <BookShowcase
            image={book.cover_url || book.cover || "/placeholder-book.png"}
            size="md"
            responsiveSize={{
              mobile: "sm",
              tablet: "md",
              laptop: "md",
            }}
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
            Reading Status
          </label>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { value: "reading", label: "Reading", icon: "📖" },
              { value: "want", label: "Want", icon: "📝" },
              { value: "read", label: "Finished", icon: "✅" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusUpdate(option.value)}
                className={`
                  p-2 sm:p-3 
                  rounded-md 
                  border 
                  backdrop-blur-md 
                  transition 
                  text-center 
                  cursor-pointer
                  ${
                    localStatus === option.value
                      ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }
                `}
              >
                <div className="text-base sm:text-lg">{option.icon}</div>
                <div className="text-[10px] sm:text-[11px] mt-0.5 sm:mt-1">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
            Personal Notes
          </label>

          <textarea
            id="notes-modal-input"
            value={localNotes}
            onChange={handleNotesChange}
            rows={4}
            className="
              w-full 
              p-2.5 sm:p-3 
              rounded-md 
              bg-white/5 
              border border-white/10 
              text-white 
              text-sm
              placeholder-white/40 
              backdrop-blur-sm 
              focus:border-white/40 
              focus:ring-white/20 
              focus:outline-none
              transition 
              resize-none
            "
            placeholder="Write your thoughts, summaries, or favorite highlights..."
          />
        </div>
      </div>

      {/* FOOTER - Fixed at bottom */}
      <DialogFooter className="
        p-3 sm:p-4 
        border-t border-white/10 
        flex flex-row 
        gap-2 sm:gap-3 
        justify-between sm:justify-end
        flex-shrink-0
      ">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          className="
            text-red-300 
            hover:text-red-200 
            hover:bg-red-400/10 
            rounded-md
            text-xs sm:text-sm
            px-3 sm:px-4
            h-9 sm:h-10
          "
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
          Delete
        </Button>

        <Button
          type="button"
          onClick={handleDone}
          className="
            bg-white/15 
            border border-white/30 
            text-white 
            hover:bg-white/20 
            rounded-md 
            px-4 sm:px-5
            text-xs sm:text-sm
            h-9 sm:h-10
          "
        >
          Done
        </Button>
      </DialogFooter>
    </motion.div>
  </DialogContent>
</Dialog>

  );
}
