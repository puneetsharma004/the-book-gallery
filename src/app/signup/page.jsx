import SignupForm from "../components/auth/SignupForm";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-[#0a1123] bg-gradient-to-br from-[#0a1123] via-[#0f1b33] to-[#1a2747] text-white">

      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 backdrop-blur-xl 
      bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.6)] animate-in fade-in duration-300">

        <h1 className="text-center text-3xl font-serif font-bold mb-6">
          The Book Gallery
        </h1>

        <h2 className="text-center text-lg font-medium text-white/80 mb-1">
          Create Your Account
        </h2>

        <p className="text-center text-white/50 text-sm mb-6">
          Start your reading journey today.
        </p>

        <SignupForm />

        <p className="text-center text-white/60 text-sm mt-6 flex items-center justify-center">
          <MoveLeft className="w-3 h-3 mr-2" />
          <Link href="/login" className="hover:text-white/80 underline">
            Already have an account? Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
