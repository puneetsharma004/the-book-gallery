"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";


// Assuming these are your components
import { Button } from "@/components/ui/button"; 
import { Share2, Zap, Heart, Pencil } from "lucide-react"; 
import { useEffect } from "react";


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

const FEATURED_BOOKS = [
  {
    title: "Bhagavad Gita as it is",
    author: "Srila Prabhupada",
    cover: "/books/gita.png",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "/books/alchemist.jpg",
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    cover: "/books/thinkandgrowrich.jpg",
  },
  {
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    cover: "/books/wings.jpg",
  },
];



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


  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create smooth motion transforms
  const y = useTransform(scrollYProgress, [0, 0.8], ["200px", "0px"]);  // moves up
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.8, 1]);      // scales up

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-[#0c0c0d] via-[#121214] to-[#0d0e10]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1f2b,#0b0f17)] opacity-95"></div>

      
      {/* --- 1. HERO SECTION --- */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background — very soft animated vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1f2b,#0b0f17)] opacity-95"></div>
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
                Create Your Library
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
          className="absolute inset-0 pointer-events-none hidden sm:block"
        >
          {HERO_BOOKS.map((book, i) => (
            <motion.img
              key={book.id}
              src={book.cover}
              alt={book.title}
              className="absolute w-40 object-cover rounded shadow-2xl opacity-70"
              style={{ top: `${30 + i * 15}%`, left: `${18 + i * 25}%` }}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for real Open Library covers */}
          {FEATURED_BOOKS.map((book, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative w-full aspect-2/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <img
                src={`${book.cover}`} // Generic placeholders
                alt="Featured Book Cover"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-stone-900/10 rounded-md"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- STORY SECTION (Why This Exists) --- */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center fade-in-section">
        {/* Optional subtle texture layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
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


      {/* --- PARALLAX HERO (Refined Cinematic Identity) --- */}
      <section className="relative w-full py-32 px-6 sm:px-12 overflow-hidden">

        {/* Background Parallax Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/library-bg-refined.png')",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Foreground Glass Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-8 sm:px-12">
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)] mb-8"
          >
            Show Who You Are <br className="hidden sm:block" /> By What You Read.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-lg sm:text-xl text-white/80 max-w-3xl drop-shadow-md font-light leading-relaxed"
          >
            Build a bookshelf that reflects your curiosity, growth, and <br /> story — beautifully displayed for the world to see.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-5"
          >
            <Link href="/signup">
              <Button className="bg-white/15 backdrop-blur-lg border border-white/30 text-white hover:bg-white/25 px-10 py-6 text-lg rounded-xl transition-all">
                Create Your Library
              </Button>
            </Link>

            <Link href="/demoGallery">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 px-10 py-6 text-lg rounded-xl transition-all">
                View Demo Gallery
              </Button>
            </Link>
          </motion.div>

        </div>
      </section>



      {/* --- 4. Showcase Preview Section --- */}
      <section ref={ref} className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">

        {/* Background — Dark Library Shelves */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]"
          style={{
            backgroundImage:
              "url(/libBg.png)"
          }}
        />

        {/* Soft vignette fade */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/70"></div>

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
            className="text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto"
          >
            Because books shape who we are — and that story deserves to be seen.
          </motion.p>

          {/* Glass Showcase Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            style={{ y, scale }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative mx-auto max-w-xl rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl border border-white/15"
          >
            {/* ✨ Replace the src below later with your real screenshot */}
            <img
              src="/showcaseMockup.png"
              alt="Library Showcase"
              className="w-full max-h-[600px] sm:max-h-[700px] lg:max-h-[800px] object-contain mx-auto"
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
            "url(/gridLg.png)"
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/60"></div>

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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-16"
        >
          <p className="text-white/60 italic text-lg text-right">
            — Puneet Sharma
          </p>
        </motion.div>


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

      {/* --- Bhagavad Gita Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl mx-auto mb-14"
        >
          <div className="w-20 h-[2px] bg-linear-to-r from-amber-400 to-yellow-600 mx-auto mb-6" />
          
          <p className="text-xl sm:text-2xl text-amber-100 font-serif leading-relaxed mb-3">
            “न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।”
          </p>

          <p className="text-white/60 italic text-lg mb-2">
            — Bhagavad Gītā 4.38
          </p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg sm:text-xl font-light max-w-xl mx-auto leading-relaxed"
          >
            <span className="text-amber-200">“There is no purifier like knowledge —</span>  
            it refines the soul, awakens the mind,  
            and reveals the light we already carry within.” 
          </motion.p>
        </motion.div>


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
            Create Your Library
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

    </main>
  );
}