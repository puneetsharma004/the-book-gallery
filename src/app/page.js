"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Assuming these are your components
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import { BookOpen, Share2, Search, Zap, Heart, Pencil } from "lucide-react"; 
import { useEffect } from "react";

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
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in-section");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => obs.observe(el));
    return () => elements.forEach((el) => obs.unobserve(el));
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-white" aria-label="The Book Gallery Landing Page">
      
      {/* --- 1. HERO SECTION --- */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background — very soft animated vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1f2b,_#0b0f17)] opacity-95"></div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('/grain.png')] mix-blend-overlay"></div>

        <div className="relative max-w-4xl text-center px-6 z-10">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-serif font-bold text-white leading-tight"
          >
            Show Who You Are<br />
            By What You Read.
          </motion.h1>

          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-2xl text-white/70 mt-6 max-w-2xl mx-auto"
          >
            A bookshelf worth sharing.  
            A space where your reading journey becomes part of your identity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup">
              <Button className="px-8 py-6 text-lg bg-white text-black hover:bg-white/80 rounded-full">
                Start Your Library
              </Button>
            </Link>

            <Link href="/demoGallery">
              <Button variant="outline" className="px-8 py-6 text-lg border-white/40 text-white hover:bg-white/10 rounded-full">
                View Demo Gallery
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Parallax Book Covers */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {HERO_BOOKS.map((book, i) => (
            <motion.img
              key={book.id}
              src={book.cover}
              alt={book.title}
              className="absolute w-40 object-cover rounded shadow-2xl opacity-70"
              style={{ top: `${30 + i * 15}%`, left: `${20 + i * 25}%` }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, book.rotate.includes("-") ? -4 : 4, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </motion.section>

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

      {/* --- STORY SECTION (Why This Exists) --- */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center fade-in-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-serif font-bold text-white mb-8">
            Because books shape us.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-white/70 text-lg leading-relaxed"
        >
          I realized I was changing from the books I read — in quiet, subtle ways.
          But when I tried to look back, to remember who I had been, and who I was
          becoming, the details faded.
          <br /><br />
          I wanted a place to keep the stories that shaped me.
          Not a social feed. Not a list of ratings.
          Just a calm, personal room for the books that stayed with me.
        </motion.p>
        <div className="mx-auto mt-16 h-px w-32 bg-stone-300/40" />
      </section>


      {/* --- PARALLAX HERO (Cinematic Identity) --- */}
      <section className="relative h-[90vh] w-full overflow-hidden">

        {/* Background (Parallax Fixed Layer) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/library-bg.png')",
            backgroundAttachment: "fixed"
          }}
        />

        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

        {/* Foreground Glass Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-serif font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] mb-6"
          >
            Show Who You Are <br /> By What You Read.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-lg sm:text-2xl text-white/80 max-w-3xl drop-shadow"
          >
            A shareable, personal, beautifully displayed bookshelf — 
            created from the books that shaped you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-10 flex gap-4"
          >
            <Link href="/signup">
              <Button className="bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30 px-8 py-6 text-lg rounded-xl transition-all">
                Create Your Library
              </Button>
            </Link>

            <Link href="/demoGallery">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl transition-all">
                View Demo Gallery
              </Button>
            </Link>
          </motion.div>

        </div>
      </section>


      {/* --- 4. Showcase Preview Section --- */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">

        {/* Background — Dark Library Shelves */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2000&auto=format&fit=crop')"
          }}
        />

        {/* Soft vignette fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>

        <div className="relative max-w-6xl mx-auto text-center">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-4xl sm:text-5xl font-serif font-bold text-white mb-8"
          >
            A Bookshelf Worth Sharing.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto mb-16"
          >
            Because books shape who we are — and that story deserves to be seen.
          </motion.p>

          {/* Glass Showcase Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl border border-white/15"
          >
            {/* ✨ Replace the src below later with your real screenshot */}
            <img
              src="https://placehold.co/1600x1000/png?text=Your+Library+Preview"
              alt="Library Showcase"
              className="w-full object-cover"
            />
            
            {/* Top Glass Shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </section>

    {/* --- 5. Feature Grid Section (Cinematic Glass) --- */}
    <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">

      {/* Background shelves */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=1600&auto=format&fit=crop')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

      <div className="relative max-w-6xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl sm:text-5xl font-serif font-bold text-white mb-10"
        >
          Features Designed for Readers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1 }}
          className="text-stone-300 text-lg max-w-2xl mx-auto mb-20"
        >
          A quiet place to document your journey, honor your growth, and share your bookshelf with intention.
        </motion.p>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl border border-white/15 bg-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-white/10 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition group"
            >
              <feature.icon className="w-6 h-6 text-amber-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-xl text-white font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-stone-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>


    {/* --- 6. Why I Built This (Emotional Story Section) --- */}
    <section className="py-32 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto text-center">

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="text-4xl sm:text-5xl font-serif font-bold text-white mb-10"
      >
        Why I Built This
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-xl sm:text-2xl text-white/70 leading-relaxed font-light"
      >
        I’ve read many books over the years. They’ve shaped the way I think, the way I speak, 
        the way I see the world. But every time someone asked me, 
        <span className="italic">“What have you read?”</span> — I didn’t have a way to show the journey.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-xl sm:text-2xl text-white/70 leading-relaxed font-light mt-8"
      >
        This space is my answer.
        A place to remember who I was when I read each book.
        A place to honor the things that changed me.
      </motion.p>

    </section>


    {/* --- 7. Final CTA / Closing Section --- */}
    <section className="py-32 px-6 sm:px-12 lg:px-20 text-center">
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="text-4xl sm:text-5xl font-serif font-bold text-white mb-8"
      >
        Show who you are by what you read.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.2 }}
        className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12"
      >
        Build a bookshelf that reflects your growth, curiosity, and identity — and share it 
        with anyone, anywhere.
      </motion.p>


      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <Link href="/signup">
          <Button
            size="lg"
            className="bg-stone-900 hover:bg-stone-700 text-white text-lg px-10 py-7 rounded-xl shadow-xl transition"
          >
            Start Your Library
          </Button>
        </Link>
      </motion.div>

    </section>

    {/* --- 8. Footer --- */}
    <footer className="border-t py-12 px-6 text-center">

      <h3 className="text-lg font-serif text-white mb-3">
        The Book Gallery
      </h3>

      <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
        A quiet place to honor your reading life.
      </p>

      <nav className="flex justify-center gap-6 text-sm text-white mb-10">
        <Link href="/demoGallery" className="hover:text-white/80 transition">
          Demo Gallery
        </Link>
        <Link href="/signup" className="hover:text-white/80 transition">
          Get Started
        </Link>
        <Link href="/login" className="hover:text-white/80 transition">
          Log In
        </Link>
      </nav>

      <div className="text-xs text-white/70">
        © {new Date().getFullYear()} The Book Gallery — Made with love for Readers.
      </div>

    </footer>

    </div>
  );
}