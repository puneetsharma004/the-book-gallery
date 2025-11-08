// "use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 text-center">
      <h3 className="text-lg font-serif text-white mb-3">The Book Gallery</h3>

      <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
        A quiet place to honor your reading life.
      </p>

      <nav className="flex justify-center gap-6 text-sm text-white mb-10 flex-wrap">
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

      <div className="text-xs text-white/60">
        © {new Date().getFullYear()} The Book Gallery — Made with love for readers.
      </div>
    </footer>
  );
}
