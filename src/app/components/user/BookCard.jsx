import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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

const STATUS_MAP = {
  reading: { label: "Reading", className: "bg-blue-500 text-white hover:bg-blue-600" },
  want: { label: "Want to Read", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  read: { label: "Finished", className: "bg-green-500 text-white hover:bg-green-600" },
};

export function BookCard({ book, onCardClick }) {
  const { label: statusLabel, className: statusClass } = STATUS_MAP[book.status] || STATUS_MAP.reading;
  const isFetching = book.isFetching;
  const cover = book.cover_url || book.cover || null;

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, rotateY: 4 }}
      transition={{ type: "spring", stiffness: 180, damping: 12 }}
      exit="exit"
      className="h-full"
    >
      <Card 
        className="relative glass rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        hover:shadow-[0_12px_45px_rgba(0,0,0,0.55)] transition-all duration-500 overflow-hidden"
        role="group"
      >
        <button
          onClick={onCardClick}
          className="text-left w-full flex-1 flex flex-col focus:outline-none rounded-lg"
          aria-label={`View details and edit status for ${book.title}`}
        >
          <CardContent className="space-y-3 flex-1 flex flex-col">
            
            {/* Book Cover */}
            {!isFetching && cover ? (
              <div className="relative group">
                <img
                  src={cover}
                  alt={book.title}
                  className="w-full h-[260px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.05]"
                />

                {/* Book Spine */}
                <div className="absolute left-0 top-0 w-[7px] h-full book-spine rounded-l-lg"></div>

                {/* Subtle hover highlight */}
                <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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

            <h3 className="font-semibold text-white line-clamp-2">{book.title}</h3>

            <Badge className={`px-2 py-0.5 text-xs rounded-full shadow-lg ${statusClass}`}>
              {statusLabel}
            </Badge>
              
            <p className="text-xs text-white/60">
              Notes: {book.notes ? book.notes.split('\n')[0] : 'No notes yet.'}
            </p>

          </CardContent>
        </button>
      </Card>
    </motion.div>
  );
}
