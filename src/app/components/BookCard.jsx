import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";

// Shadcn UI Components (Assuming you import these from your components directory)
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Icons
import { Trash2, Loader2 } from "lucide-react";

// --- Configuration (Kept as provided) ---

const STATUS_OPTIONS = [
  { value: "reading", label: "📖 Currently Reading" },
  { value: "want", label: "📝 Want to Read" },
  { value: "read", label: "✅ Finished Reading" },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};




// --- Component Definition ---

export function BookCard({ book, onDelete, onUpdate, isOpen, onOpenChange }) {
  const dialogTriggerRef = useRef(null);

  const statusMap = useMemo(() => ({
    reading: { label: "Reading", className: "bg-blue-500 text-white hover:bg-blue-600" },
    want: { label: "Want to Read", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
    read: { label: "Finished", className: "bg-green-500 text-white hover:bg-green-600" },
  }), []);

  const { label: statusLabel, className: statusClass } = statusMap[book.status] || statusMap.reading;
  const isFetching = book.isFetching;
const cover = book.cover_url || book.cover || null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full"
      >
        <Card 
          className="relative h-full shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 rounded-lg"
          role="group"
          aria-labelledby={`book-title-${book.id}`}
        >
          
          {/* Dialog Trigger wraps the entire visible card content for a large click target */}
          <DialogTrigger asChild>
            <button
              ref={dialogTriggerRef}
              className="text-left w-full flex-1 flex flex-col focus:outline-none rounded-lg"
              aria-label={`View details and edit status for ${book.title}`}
            >
              <CardHeader className="pb-3 pr-10">
                <h3 id={`book-title-${book.id}`} className="font-semibold text-lg line-clamp-2 text-neutral-800">
                  {book.title}
                </h3>
                {isFetching ? (
                  <div className="absolute top-3 right-3 flex items-center text-blue-500">
                    <Loader2 className="h-5 w-5 animate-spin" aria-label="Fetching cover..." />
                  </div>
                ) : (
                  <Badge 
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium ${statusClass}`}
                  >
                    {statusLabel}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col">
        
                {/* Book Cover */}
                {!isFetching && cover ? (
                <div className="relative group">
                  <img
                    src={cover}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-48 object-cover rounded-md shadow-md transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                </div>
              ) : (
                <div className="w-full h-48 rounded-md border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-400 text-sm">
                  {isFetching ? (
                    <Loader2 className="absolute top-3 right-3 h-5 w-5 animate-spin text-amber-600" />
                  ) : (
                    <Badge
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm ${statusClass}`}
                    >
                      {statusLabel}
                    </Badge>
                  )}
                </div>
              )}


                
                <p className="text-sm text-neutral-600 mt-2 line-clamp-1">
                    Notes: {book.notes ? book.notes.split('\n')[0] : 'No notes added.'}
                </p>
              </CardContent>
            </button>
          </DialogTrigger>

          {/* Book Detail Modal */}
          <DialogContent
            className="sm:max-w-[425px] bg-white shadow-2xl" 
            aria-describedby="dialog-description"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              const textarea = e.currentTarget.querySelector('#notes-modal-input');
              textarea?.focus();
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neutral-900">{book.title}</DialogTitle>
              <DialogDescription id="dialog-description">
                Update the status and add personal notes for this book.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Status Select in Modal */}
              <div>
                <Label htmlFor={`modal-status-${book.id}`} className="font-semibold text-neutral-700">
                  Reading Status
                </Label>
                <Select
                  value={book.status}
                  onValueChange={(value) => onUpdate(book.id, "status", value)}
                >
                  <SelectTrigger 
                    id={`modal-status-${book.id}`}
                    className="w-full mt-1 bg-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  
                  {/* 🚨 FIX APPLIED HERE: Added bg-white and shadow-lg to SelectContent */}
                  <SelectContent className="bg-white shadow-lg border">
                    {STATUS_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  
                </Select>
              </div>

              {/* Notes Textarea */}
              <div>
                <Label htmlFor={`notes-modal-input`} className="font-semibold text-neutral-700">
                  Your Notes
                </Label>
                <textarea
                  id={`notes-modal-input`}
                  className="w-full border border-neutral-300 rounded-md p-3 h-32 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  placeholder="Add your thoughts about the book, chapter summaries, or quotes..."
                  value={book.notes}
                  onChange={(e) => onUpdate(book.id, "notes", e.target.value)}
                  aria-label={`Notes for ${book.title}`}
                />
              </div>

              {/* Delete Button in Modal (The primary delete trigger) */}
              <Button
                variant="destructive"
                onClick={() => onDelete(book.id, book.title)}
                className="w-full bg-red-600 hover:bg-red-700"
                aria-label={`Permanently delete ${book.title} from your collection`}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Delete Book
              </Button>
            </div>
          </DialogContent>
        </Card>
      </motion.div>
    </Dialog>
  );
}