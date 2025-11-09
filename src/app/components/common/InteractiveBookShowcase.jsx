"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil } from "lucide-react";
import BookShowcase from "./BookShowcase";

const STATUS_STYLES = {
  reading: "bg-blue-500 text-white hover:bg-blue-600",
  want: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  read: "bg-green-500 text-white hover:bg-green-600",
};

const trimTitle = (title) => {
  const words = title.split(" ");
  return words.length > 3 ? words.slice(0, 3).join(" ") + "…" : title;
};

const trimDescription = (text, maxLength = 120) => {
  if (!text) return "No notes added.";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;
};

export default function InteractiveBookShowcase({ 
  book, 
  isOpen, 
  onToggle, 
  onBookClick,
  isPublicView = false // New prop to control edit button visibility
}) {
  const statusStyle = STATUS_STYLES[book.status] || STATUS_STYLES.reading;

  return (
    <motion.div
      layout="position"
      layoutId={`book-${book.id}`}
      initial={false}
      animate={{
        width: isOpen ? 640 : 300,
      }}
      transition={{
        layout: {
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
        width: {
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      }}
      
      className="relative flex items-center rounded-2xl border border-white/10 
                 bg-white/5 backdrop-blur-lg shadow-lg overflow-hidden"
      style={{
        height: "380px",
        padding: "1rem",
        flexShrink: 0,
      }}
    >
      {/* Book Cover - Static positioning */}
      <div className="shrink-0 z-10">
        <BookShowcase
          image={book.cover_url || "/placeholder-book.png"}
          size="md"
          onClick={isPublicView ? undefined : onBookClick} // Disable click in public view
          responsiveSize={{
            mobile: "sm",
            tablet: "md",
            laptop: "lg",
          }}
        />

         {/* Edit Button - Hidden in public view */}
        {!isPublicView && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onBookClick();
              }}
              className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm outline-none cursor-pointer"
              aria-label="Edit book details"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}

      </div>

      {/* Animated Details Section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="flex flex-col justify-center border-l border-white/10 text-left text-white/80 flex-1 pl-6 overflow-hidden"
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="text-white font-semibold text-lg mb-2 cursor-default"
            >
              {trimTitle(book.title)}
            </motion.h3>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.05,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              <Badge className={`${statusStyle} w-fit mb-3 cursor-pointer`}>
                {book.status === "reading"
                  ? "Currently Reading"
                  : book.status === "read"
                  ? "Finished Reading"
                  : "Want to Read"}
              </Badge>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="text-sm leading-relaxed cursor-default"
            >
              {trimDescription(book.notes)}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20"
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggle}
          className="rounded-md w-6 h-10 bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
