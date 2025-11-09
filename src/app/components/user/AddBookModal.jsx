"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Pencil } from "lucide-react";

export default function AddBookModal({
  isOpen,
  onClose,
  book,
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onSubmit,
  isSubmitting,
}) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            forceMount
            className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.65)] text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="p-5 border-b border-white/10 bg-white/5">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-white/80" />
                    Add to Library
                  </DialogTitle>
                  <DialogDescription className="text-white/50 text-sm">
                    Confirm details & set your reading status.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-none">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={book.cover_url || "/placeholder-book.png"}
                      alt={book.title}
                      className="w-28 h-44 object-cover rounded-md shadow-xl"
                    />
                    <div className="absolute left-0 top-0 w-[6px] h-full bg-gradient-to-r from-white/25 to-transparent rounded-l-md" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="font-semibold text-lg">{book.title}</h2>
                  {book.author && (
                    <p className="text-white/60 text-sm mt-1">{book.author}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-white/60" />
                    Reading Status
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "reading", label: "Reading", icon: "📖" },
                      { value: "want", label: "Want", icon: "📝" },
                      { value: "read", label: "Finished", icon: "✅" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onStatusChange(option.value)}
                        className={`p-3 rounded-md border backdrop-blur-md transition text-center
                          ${
                            status === option.value
                              ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                      >
                        <div className="text-lg">{option.icon}</div>
                        <div className="text-[11px] mt-1">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                    <Pencil className="h-4 w-4 text-white/60" />
                    Personal Notes
                  </label>
                  <textarea
                    className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-sm focus:border-white/40 focus:ring-white/20 transition resize-none"
                    placeholder="Optional thoughts, quotes, or summaries..."
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter className="p-4 border-t border-white/10 flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-white/70 hover:bg-white/10 hover:text-white rounded-md"
                >
                  Cancel
                </Button>

                <Button
                  disabled={isSubmitting}
                  onClick={onSubmit}
                  className="bg-white/20 border border-white/40 hover:bg-white/30 text-white font-medium rounded-md px-6 transition"
                >
                  {isSubmitting ? "Adding..." : "Add Book"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
