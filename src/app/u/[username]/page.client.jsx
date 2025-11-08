"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; // ✅ we use supabase directly
import { Button } from "@/components/ui/button"; 
import { BookOpen, List, CheckCircle, Pencil } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const STATUS_DETAILS = {
  reading: { label: "Currently Reading", icon: BookOpen, className: "bg-blue-600 text-white" }, 
  want: { label: "Want to Read", icon: Pencil, className: "bg-amber-100 text-amber-800" }, 
  read: { label: "Finished Reading", icon: CheckCircle, className: "bg-green-600 text-white" }, 
};

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: STATUS_DETAILS.reading.label, Icon: BookOpen },
  { value: "want", label: STATUS_DETAILS.want.label, Icon: Pencil },
  { value: "read", label: STATUS_DETAILS.read.label, Icon: CheckCircle },
];

const cardAnimation = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};




function PublicBookCard({ book }) {
  const status = STATUS_DETAILS[book.status] || STATUS_DETAILS.reading;

    
  return (
    <motion.div
      className="group rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_0_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_45px_rgba(0,0,0,0.6)] transition-all duration-300"
      whileHover={{ scale: 1.015 }}
    >
      {/* Cover Image */}
      {book.cover_url ? (
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-full h-52 object-cover opacity-95 group-hover:opacity-100 transition duration-300"
        />
      ) : (
        <div className="w-full h-52 flex items-center justify-center text-white/40 text-sm">
          No cover available
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3 text-white/90">
        <h2 className="font-semibold text-lg line-clamp-2 group-hover:text-white transition">
          {book.title}
        </h2>

        <div className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${status.className} shadow-sm`}>
          <status.icon className="h-3 w-3" />
          {status.label}
        </div>

        {book.notes ? (
          <p className="text-sm text-white/70 line-clamp-3">
            {book.notes}
          </p>
        ) : (
          <p className="text-sm italic text-white/40">
            No notes added.
          </p>
        )}
      </div>

      {/* Hover Accent Border */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-amber-300/50 transition duration-300 pointer-events-none" />
    </motion.div>
  );
}

export default function PublicProfilePage() {
  const [showQR, setShowQR] = useState(false);
  const { username } = useParams();
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");

  // ✅ NEW — Fetch actual public user's books
  useEffect(() => {
    async function fetchPublicData() {
      // 1) get user by username
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (!profile) return;

      // 2) fetch books for that user
      const { data: userBooks } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      setBooks(userBooks || []);
    }

    fetchPublicData();
  }, [username]);

  const filteredBooks = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const filterCounts = useMemo(() => {
    const counts = { all: books.length, reading: 0, want: 0, read: 0 };
    books.forEach((b) => counts[b.status]++);
    return counts;
  }, [books]);


  const totalBooks = books.length;

  // Compute "years active"
  const firstBook = books.length > 0 ? books[books.length - 1] : null;
  const accountStartYear = firstBook ? new Date(firstBook.created_at).getFullYear() : null;
  const currentYear = new Date().getFullYear();
  const yearsActive = accountStartYear ? currentYear - accountStartYear + 1 : null;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchPublicData() {
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      setProfile(profileData);
      
      const { data: userBooks } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false });

      setBooks(userBooks || []);
    }

    fetchPublicData();
  }, [username]);


  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#0a0f1f] via-[#121826] to-[#1e293b] p-8">
      <div className="max-w-5xl mx-auto py-8">
      <header className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-white/10 mb-12">

        {/* Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banners/library-dark.png')" }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-12">
          <h1 className="text-4xl font-extrabold text-white font-serif mb-3 drop-shadow-lg">
            {username}'s Book Gallery 
          </h1>

          <p className="text-lg text-white/70 mb-6">
        A look at their reading journey.
      </p>

      {/* STATS BADGE ROW */}
      <div className="flex justify-center gap-4 flex-wrap mb-4">

        {/* Total Books */}
        <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white/90 text-sm font-medium shadow-md">
          📚 {totalBooks} {totalBooks === 1 ? "Book" : "Books"}
        </div>

        {/* Years Active (only if >= 1) */}
        {yearsActive && yearsActive > 0 && (
          <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white/90 text-sm font-medium shadow-md">
            ⏳ {yearsActive} {yearsActive === 1 ? "Year" : "Years"} Active
          </div>
        )}

        {/* PUBLIC BIO */}
        {profile?.bio && (
          <p className="text-white/70 text-base max-w-2xl mx-auto mt-2 leading-relaxed italic">
            “{profile.bio}”
          </p>
        )}

      </div>

    {/* Action Buttons */}
    <div className="flex justify-center gap-3">
      <Button
        onClick={() => {
          const url = typeof window !== "undefined" ? window.location.href : "";
          navigator.clipboard.writeText(url);
          import("react-hot-toast").then(({ default: toast }) =>
            toast.success("Profile link copied! 🔗")
          );
        }}
        className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 transition-all"
      >
        Copy Profile Link
      </Button>

      <Button
        onClick={() => setShowQR(true)}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 transition-all"
      >
        Show QR Code
      </Button>
    </div>
  </div>
</header>




        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {FILTERS.map(({ value, label, Icon }) => (
            <motion.button
              key={value}
              onClick={() => setFilter(value)}
              whileTap={{ scale: 0.94 }}
              className={`px-4 py-2 rounded-full border backdrop-blur-lg transition ${
                filter === value
                  ? "bg-white/20 border-white/40 text-white shadow"
                  : "bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="inline h-4 w-4 mr-1" />
              {label} ({filterCounts[value]})
            </motion.button>
          ))}
        </div>


        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 border border-white/20 border-dashed rounded-xl bg-white/5 text-white/60 mt-10 backdrop-blur-lg">
            No books here yet…
          </div>
          ) : (
          <div className="relative">
            {/* Ambient Lighting Layer */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="shelf-lighting" />
            </div>

            {/* Books Grid */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={cardAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <PublicBookCard book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          )}
      </div>
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm p-6 rounded-2xl glass text-white text-center border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-white">
              Scan to View Library
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCode value={typeof window !== "undefined" ? window.location.href : ""} size={180} />
            </div>
          </div>

          <p className="text-center text-white/70 text-sm">
            Share this QR to allow others to instantly open your book gallery.
          </p>

          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowQR(false)} className="bg-amber-600 hover:bg-amber-700 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  );
}
