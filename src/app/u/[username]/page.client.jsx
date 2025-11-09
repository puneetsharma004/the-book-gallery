"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { BookOpen, List, CheckCircle, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InteractiveBookShowcase from "@/app/components/common/InteractiveBookShowcase";

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: "Currently Reading", Icon: BookOpen },
  { value: "want", label: "Want to Read", Icon: Pencil },
  { value: "read", label: "Finished Reading", Icon: CheckCircle },
];

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openBookId, setOpenBookId] = useState(null);

  useEffect(() => {
    async function fetchPublicData() {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (!profileData) {
        setIsLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch user's books
      const { data: userBooks } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false });

      setBooks(userBooks || []);
      setIsLoading(false);
    }

    fetchPublicData();
  }, [username]);

  const filteredBooks = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const filterCounts = useMemo(() => {
    const counts = { all: books.length, reading: 0, want: 0, read: 0 };
    books.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      }
    });
    return counts;
  }, [books]);

  const handleToggle = (id) => {
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  // Calculate stats
  const totalBooks = books.length;
  const firstBook = books.length > 0 ? books[books.length - 1] : null;
  const accountStartYear = firstBook ? new Date(firstBook.created_at).getFullYear() : null;
  const currentYear = new Date().getFullYear();
  const yearsActive = accountStartYear ? currentYear - accountStartYear + 1 : null;

  // Responsive book rows - 1 column on mobile, 2 on tablet, 3 on desktop
  const getResponsiveChunkSize = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const [chunkSize, setChunkSize] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setChunkSize(getResponsiveChunkSize());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bookRows = chunkArray(filteredBooks, chunkSize);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-white/70 text-sm sm:text-base md:text-lg">Loading profile...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-white/70 text-sm sm:text-base md:text-lg">User not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
        {/* Header Banner */}
        <header className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border border-white/10 mb-6 sm:mb-8 md:mb-12">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/banners/library-dark.png')" }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 text-center px-4 sm:px-6 py-8 sm:py-10 md:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-serif mb-2 sm:mb-3 drop-shadow-lg">
              {username}'s Book Gallery
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/70 mb-4 sm:mb-6">
              A look at their reading journey.
            </p>

            {/* Stats Badges */}
            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap mb-3 sm:mb-4">
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white/90 text-xs sm:text-sm font-medium shadow-md">
                📚 {totalBooks} {totalBooks === 1 ? "Book" : "Books"}
              </div>

              {yearsActive && yearsActive > 0 && (
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white/90 text-xs sm:text-sm font-medium shadow-md">
                  ⏳ {yearsActive} {yearsActive === 1 ? "Year" : "Years"} Active
                </div>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed italic px-4">
                "{profile.bio}"
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-4">
              <Button
                onClick={() => {
                  const url = typeof window !== "undefined" ? window.location.href : "";
                  navigator.clipboard.writeText(url);
                  import("react-hot-toast").then(({ default: toast }) =>
                    toast.success("Profile link copied! 🔗")
                  );
                }}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 transition-all text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto"
              >
                Copy Profile Link
              </Button>

              <Button
                onClick={() => setShowQR(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 transition-all text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto"
              >
                Show QR Code
              </Button>
            </div>
          </div>
        </header>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 px-2">
          {FILTERS.map(({ value, label, Icon }) => (
            <motion.button
              key={value}
              onClick={() => setFilter(value)}
              whileTap={{ scale: 0.94 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-lg transition text-xs sm:text-sm ${
                filter === value
                  ? "bg-white/20 border-white/40 text-white shadow"
                  : "bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">{label}</span>
              <span className="xs:hidden">{value === 'all' ? 'All' : value === 'reading' ? 'Reading' : value === 'want' ? 'Want' : 'Read'}</span>
              {' '}({filterCounts[value]})
            </motion.button>
          ))}
        </div>

        {/* Books Display */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 border border-white/20 border-dashed rounded-xl bg-white/5 text-white/60 mt-6 sm:mt-8 md:mt-10 backdrop-blur-lg text-sm sm:text-base">
            No books here yet…
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 mx-auto max-w-fit px-2">
            <AnimatePresence mode="popLayout">
              {bookRows.map((row, rowIndex) => (
                <motion.div
                  key={`row-${rowIndex}`}
                  layout
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center sm:items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
                >
                  {row.map((book) => (
                    <InteractiveBookShowcase
                      key={book.id}
                      book={book}
                      isOpen={openBookId === book.id}
                      onToggle={() => handleToggle(book.id)}
                      onBookClick={() => {}} // No-op for public view
                      isPublicView={true} // Pass this prop to hide edit button
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="w-[90vw] max-w-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl glass text-white text-center border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-center text-base sm:text-lg font-semibold text-white">
              Scan to View Library
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-4 sm:py-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
              <QRCode 
                value={typeof window !== "undefined" ? window.location.href : ""} 
                size={window.innerWidth < 640 ? 150 : 180}
              />
            </div>
          </div>

          <p className="text-center text-white/70 text-xs sm:text-sm px-2">
            Share this QR to allow others to instantly open your book gallery.
          </p>

          <div className="flex justify-center pt-3 sm:pt-4">
            <Button 
              onClick={() => setShowQR(false)} 
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm h-9 sm:h-10 w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
