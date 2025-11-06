"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Assuming these are your components
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import { BookOpen, Share2, Search, Zap, Heart, Pencil } from "lucide-react"; 

// --- Configuration & Placeholders ---

// Soft, warm color palette classes
const BG_COLOR = "bg-amber-50"; // Soft cream/sand background
const TEXT_INK = "text-stone-900"; // Deep ink black/brown for text
const ACCENT_COLOR = "text-amber-700"; // Muted brown/gold accent

// Placeholder data for hero section visual (Open Library covers)
const HERO_BOOKS = [
  { id: 1, cover: 'https://covers.openlibrary.org/b/id/13257321-M.jpg', title: 'Dune', rotate: '-rotate-3', x: 50 },
  { id: 2, cover: 'https://covers.openlibrary.org/b/id/8254427-M.jpg', title: 'The Name of the Wind', rotate: 'rotate-2', x: -30 },
  { id: 3, cover: 'https://covers.openlibrary.org/b/id/14354276-M.jpg', title: 'Pride and Prejudice', rotate: 'rotate-1', x: 20 },
];

// Data for Feature Grid Section
const FEATURES = [
  { icon: Share2, title: "Public Gallery", description: "Curate and share your reading profile with a beautiful, custom link." },
  { icon: Pencil, title: "Private Notes", description: "Write down reflections, quotes, and thoughts that are meaningful only to you." },
  { icon: Zap, title: "Status Tracking", description: "Effortlessly track progress: Reading, Want to Read, or Finished." },
  { icon: Heart, title: "Quote Highlights", description: "Capture and categorize your favorite passages for easy lookup later." },
];

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const cardStagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};


export default function LandingPage() {
  return (
    <div className={`min-h-screen flex flex-col ${BG_COLOR} ${TEXT_INK}`} aria-label="The Book Gallery Landing Page">
      
      {/* --- 1. HERO SECTION --- */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={cardStagger}
        className="relative pt-32 pb-40 px-4 sm:px-8 lg:px-16 overflow-hidden max-w-7xl mx-auto"
      >
        <div className="text-center max-w-4xl mx-auto z-10 relative">
          <motion.h1 
            variants={fadeIn}
            className="text-6xl sm:text-7xl font-serif font-extrabold tracking-tight mb-6 leading-tight"
          >
            Your Story Starts Here
          </motion.h1>
          
          <motion.p 
            variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.6, delay: 0.2 } } }}
            className="text-xl sm:text-2xl text-stone-600 max-w-3xl mx-auto mb-10"
          >
            A calm space to honor your reading journey, document insights, and connect your favorite books to your identity.
          </motion.p>

          <motion.div 
            variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.6, delay: 0.4 } } }}
            className="flex justify-center gap-4"
          >
            {/* Primary CTA */}
            <Link href="/signup" passHref>
              <Button 
                size="lg" 
                className="bg-stone-900 hover:bg-stone-700 text-white text-lg py-7 px-8 transition-colors shadow-xl"
              >
                Create Your Library
              </Button>
            </Link>
            {/* Secondary CTA */}
            <Link href="/demoGallery" passHref>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-stone-400 text-stone-700 hover:bg-stone-100 text-lg py-7 px-8"
              >
                View Demo Gallery
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Book Covers Visual */}
        {HERO_BOOKS.map((book, index) => (
          <motion.img
            key={book.id}
            initial={{ opacity: 0, scale: 0.5, rotate: book.rotate.includes('-') ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
            src={book.cover}
            alt={book.title}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 object-cover shadow-2xl rounded-sm transition-transform duration-500 ease-out 
              ${index === 0 ? 'sm:left-[15%] lg:left-[25%] -translate-y-[20%] w-32' : ''}
              ${index === 1 ? 'sm:right-[15%] lg:right-[25%] translate-y-[10%] w-40' : ''}
              ${index === 2 ? 'sm:top-[70%] sm:left-[30%] lg:top-[60%] lg:left-[40%] w-28 opacity-70 hidden sm:block' : ''}
              ${book.rotate}`}
            style={{ zIndex: 0 }}
          />
        ))}
      </motion.section>

      <hr className="w-full border-t border-stone-200" />

      {/* --- 2. 3-Step “How It Works” Section --- */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <h2 className={`text-4xl font-serif font-bold text-center mb-16 ${ACCENT_COLOR}`}>
          Your Reading Journey in Three Simple Steps
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1: Add */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} className="text-center space-y-4">
            <div className="text-5xl mb-4 font-extrabold text-stone-900">1.</div>
            <Search className="w-10 h-10 mx-auto text-blue-500" />
            <h3 className="text-2xl font-semibold">Discover & Collect</h3>
            <p className="text-stone-600">Quickly add any book using our Open Library search or by entering details manually.</p>
          </motion.div>

          {/* Step 2: Track */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.1 }} className="text-center space-y-4">
            <div className="text-5xl mb-4 font-extrabold text-stone-900">2.</div>
            <BookOpen className="w-10 h-10 mx-auto text-green-500" />
            <h3 className="text-2xl font-semibold">Reflect & Document</h3>
            <p className="text-stone-600">Track your status (Reading, Finished, Want), and capture private notes and deep reflections.</p>
          </motion.div>

          {/* Step 3: Share */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.2 }} className="text-center space-y-4">
            <div className="text-5xl mb-4 font-extrabold text-stone-900">3.</div>
            <Share2 className="w-10 h-10 mx-auto text-pink-500" />
            <h3 className="text-2xl font-semibold">Share Your Gallery</h3>
            <p className="text-stone-600">Generate a beautiful public link to showcase your thoughtfully curated bookshelf to the world.</p>
          </motion.div>
        </div>
      </section>

      <hr className="w-full border-t border-stone-200" />

      {/* --- 3. Featured Books Preview (Simplified to avoid complex carousel logic) --- */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          Your Reading, Beautifully Presented
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Placeholder for real Open Library covers */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative w-full aspect-[2/3] shadow-lg hover:shadow-xl transition-shadow rounded-md"
            >
              <img
                src={`https://covers.openlibrary.org/b/id/${10000000 + i * 100000}-L.jpg`} // Generic placeholders
                alt="Featured Book Cover"
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-stone-900/10 rounded-md"></div>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="w-full border-t border-stone-200" />

      {/* --- 4. “Why This Matters” Emotional Section --- */}
      <section className="py-32 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto text-center">
        <h2 className="text-5xl font-serif font-bold tracking-wide mb-10">
          Reading is not just consumption; it is creation.
        </h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true, amount: 0.5 }} 
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl text-stone-700 leading-relaxed max-w-3xl mx-auto"
        >
          Your collection is a mirror of your curiosity. Your notes are the conversation you have with genius. **The Book Gallery** is simply the quiet space where these meaningful moments are preserved and remembered.
        </motion.p>
      </section>

      <hr className="w-full border-t border-stone-200" />

      {/* --- 5. Feature Grid Section --- */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          Features Designed for Readers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full shadow-lg border-stone-300 hover:border-blue-500 transition-colors">
                <feature.icon className="w-6 h-6 mb-3 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-stone-600 text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="w-full border-t border-stone-200" />

      {/* --- 6. Final CTA Section --- */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">
          Ready to create your personal reading legacy?
        </h2>
        <Link href="/signup" passHref>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-7 px-10 transition-colors shadow-2xl"
          >
            Start Your Reading Journey
          </Button>
        </Link>
      </section>

      {/* --- 7. Footer --- */}
      <footer className="py-8 border-t border-stone-200 text-center text-sm text-stone-500 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} The Book Gallery. Made for thoughtful readers.
        </div>
      </footer>
    </div>
  );
}