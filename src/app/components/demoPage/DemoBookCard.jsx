"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  reading: "bg-blue-500 text-white hover:bg-blue-600",
  want: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  read: "bg-green-500 text-white hover:bg-green-600",
};

// Helper function to trim title to 3 words
function trimTitle(title) {
  const words = title.split(" ");
  return words.length > 3 ? words.slice(0, 3).join(" ") + "…" : title;
}

// Helper to limit description by character count
function trimDescription(text, maxLength = 80) {
  if (!text) return null;
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;
}

export default function DemoBookCard({ book }) {
  const style = STATUS_STYLES[book.status] || STATUS_STYLES.reading;
  const title = trimTitle(book.title);
  const description = trimDescription(book.notes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg 
                   hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] hover:scale-[1.02] 
                   transition-transform duration-300 overflow-hidden flex flex-col 
                   items-center " // consistent height
      >
        {/* Book Cover */}
        <div className="relative h-full aspect-3-4 overflow-hidden rounded-2xl">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover object-center opacity-90 
                       hover:opacity-100 transition duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 w-full space-y-3 text-center flex-1 justify-between">
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-1 leading-snug">
              {title}
            </h3>

            <Badge className={`mx-auto mt-2 ${style}`}>
              {book.status === "reading"
                ? "Currently Reading"
                : book.status === "read"
                ? "Finished Reading"
                : "Want to Read"}
            </Badge>
          </div>

          {description ? (
            <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          ) : (
            <p className="text-white/40 italic text-sm">No notes added.</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
