// app/login/page.jsx
import React from "react";
// Assuming LoginForm is correctly located at "@/components/auth/LoginForm"
import LoginForm from "../components/auth/LoginForm"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link"; // Use Link for internal navigation

// --- Theme Configuration ---
const BG_COLOR = "bg-amber-50"; // Soft cream/sand background (from Landing Page)
const ACCENT_COLOR = "text-amber-700"; // Muted brown/gold accent
const BORDER_COLOR = "border-amber-400"; // Soft border color

export default function LoginPage() {
  return (
    // Background now matches the Landing Page's cozy cream tone
    <div className={`min-h-screen flex items-center justify-center ${BG_COLOR} px-4`}>
      
      <Card 
        // Card is wider for better spacing
        className={`w-full max-w-md shadow-2xl border-t-4 ${BORDER_COLOR} sm:max-w-sm`}
        role="form" 
        aria-label="Login Form"
      >
        <CardHeader className="pt-8 pb-3"> {/* Increased top padding */}
          
          {/* Branding/Icon - Text color changed to deep stone */}
          <div className="flex flex-col items-center mb-4">
            <CardTitle className="text-center text-3xl font-serif font-bold text-stone-900 mt-2">
              The Book Gallery
            </CardTitle>
          </div>
          
          {/* Functional Heading - Uses warm accent color */}
          <CardTitle className={`text-center text-xl font-semibold ${ACCENT_COLOR}`}>
            Welcome Back
          </CardTitle>
          
          <CardDescription className="text-center text-stone-600">
            Log in to manage your private reading journal.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          {/* The actual form component */}
          <LoginForm />
        </CardContent>
        
        {/* Subtle Footer for Sign Up Link */}
        <div className={`p-4 text-center text-xs text-stone-600 border-t border-stone-200 ${BG_COLOR} rounded-b-lg`}>
            Don't have an account? 
            <Link href="/signup" passHref legacyBehavior>
                <a className="font-medium text-blue-600 hover:text-blue-800 hover:underline ml-1">
                  Sign Up
                </a>
            </Link>
        </div>
      </Card>
    </div>
  );
}