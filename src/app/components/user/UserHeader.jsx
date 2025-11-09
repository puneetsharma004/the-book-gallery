"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Share2, LogOut } from "lucide-react";

export default function UserHeader({ user, onLogout }) {
  const router = useRouter();

  return (
    <header className="sticky top-8 z-20 w-full glass backdrop-blur-xl border-b rounded-2xl border-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-sm sm:text-lg md:text-2xl font-serif font-bold text-white">
          Welcome, {user?.profile?.display_name || user?.profile?.username || "Reader"}!
        </h1>

        <div className="flex gap-2 md:gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/u/${user.profile.username}`)}
            className="text-white border-white/30 hover:bg-white/10 hover:border-white/40 transition"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Share Profile</span>
          </Button>

          <Button
            variant="outline"
            onClick={onLogout}
            className="text-white border-white/30 hover:bg-white/10 hover:border-white/40 transition"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
