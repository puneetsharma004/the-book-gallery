import React from "react";
import LoginForm from "../components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 
                    bg-[#0a1123] bg-gradient-to-br from-[#0a1123] via-[#0f1b33] to-[#1a2747]">

      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 backdrop-blur-xl 
                      bg-white/10 shadow-[0_8px_50px_rgba(0,0,0,0.6)] text-white animate-in fade-in duration-300">

        <h1 className="text-center text-3xl font-serif font-bold mb-6">
          The Book Gallery
        </h1>

        <h2 className="text-center text-lg font-medium text-white/80">
          Welcome Back
        </h2>

        <p className="text-center text-white/50 text-sm mb-6">
          Log in to continue your reading journey.
        </p>

        <LoginForm />

        <p className="text-center text-white/60 text-sm mt-6">
          Don’t have an account?
          <Link
            href="/signup"
            className="text-white hover:text-white/80 underline ml-1"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
