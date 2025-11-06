"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// --- Theme Configuration (Consistent with the application's aesthetic) ---
const TEXT_COLOR = "text-stone-900"; // Deep ink for primary text
const BORDER_COLOR = "border-stone-200"; // Soft divider color

export default function Header() {
  const router = useRouter();

  /**
   * Clears local storage session data and redirects the user to the login page.
   */
  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bg_auth"); 
      localStorage.removeItem("bg_user"); 
      router.push("/login");
    }
  }

  return (
    <header 
      // Background remains white, border uses soft stone color for thematic consistency
      className={`w-full border-b ${BORDER_COLOR} bg-white px-6 py-3 flex justify-between items-center shadow-sm`}
    >
      <h1 
        // Applying font-serif and bold ink color for the literary/editorial theme
        className={`text-xl font-serif font-bold ${TEXT_COLOR}`}
      >
        📚 The Book Gallery
      </h1>

      <Button 
        variant="outline" 
        onClick={handleLogout}
        // Logout button styled with soft stone theme accents
        className="border-stone-400 text-stone-700 hover:bg-stone-100"
        aria-label="Log out of your account"
      >
        Logout
      </Button>
    </header>
  );
}