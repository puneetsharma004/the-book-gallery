"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil, ChevronLeft } from "lucide-react";
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

const trimDescription = (text, maxLength = 100) => {
  if (!text) return "No notes added.";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;
};

export default function MobileBookShowcase({
  book,
  isOpen,
  onToggle,
  onBookClick,
  isPublicView = false,
}) {
  const statusStyle = STATUS_STYLES[book.status] || STATUS_STYLES.reading;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        height: 360,
        width: 260,
      }}
      
      transition={{
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        
      }}
      className="relative flex flex-col items-center justify-center 
                 rounded-2xl border border-white/10 bg-white/5 
                 backdrop-blur-lg shadow-lg overflow-hidden mx-auto"
    >
      {/* Toggle Button (floating) */}
      <motion.div
        className="absolute top-2 right-2 z-20"
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggle}
          className="rounded-full w-8 h-8 bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Animated Content Switch */}
      <AnimatePresence mode="wait" initial={false}>
        {!isOpen ? (
          // --- Book Cover ---
          <motion.div
            key="cover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="flex flex-col items-center justify-center h-full"
          >
            <BookShowcase
              image={book.cover_url || "/placeholder-book.png"}
              size="md"
              onClick={isPublicView ? undefined : onBookClick}
              responsiveSize={{
                mobile: "md",
              }}
            />

            {/* Edit Button (if not public) */}
            {!isPublicView && (
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  //  console.log("Edit button clicked!"); // Debug log
                  onBookClick();
                }}
                className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                aria-label="Edit book details"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ) : (
          // --- Book Details ---
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="flex flex-col justify-center text-left text-white/80 px-5 py-4 h-full w-full"
          >
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-white font-semibold text-lg mb-2"
            >
              {trimTitle(book.title)}
            </motion.h3>

            <Badge className={`${statusStyle} w-fit mb-3`}>
              {book.status === "reading"
                ? "Currently Reading"
                : book.status === "read"
                ? "Finished Reading"
                : "Want to Read"}
            </Badge>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm leading-relaxed"
            >
              {trimDescription(book.notes)}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
