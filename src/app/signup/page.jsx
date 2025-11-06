// app/signup/page.jsx
import React from "react";
import SignupForm from "../components/auth/SignupForm"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

const BG_COLOR = "bg-amber-50";
const ACCENT_COLOR = "text-amber-700";
const BORDER_COLOR = "border-amber-400";

export default function SignupPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${BG_COLOR} px-4`}>
      
      <Card 
        className={`w-full max-w-md shadow-2xl border-t-4 ${BORDER_COLOR} sm:max-w-sm`}
        role="form"
        aria-label="Sign Up Form"
      >
        <CardHeader className="pt-8 pb-3">
          <div className="flex flex-col items-center mb-4">
            <CardTitle className="text-center text-3xl font-serif font-bold text-stone-900 mt-2">
              The Book Gallery
            </CardTitle>
          </div>

          <CardTitle className={`text-center text-xl font-semibold ${ACCENT_COLOR}`}>
            Create Your Account
          </CardTitle>

          <CardDescription className="text-center text-stone-600">
            Start tracking your reading journey today!
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          <SignupForm />
        </CardContent>
        
        <div className={`p-4 text-center text-xs text-stone-600 border-t border-stone-200 ${BG_COLOR} rounded-b-lg`}>
          <Link 
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
            aria-label="Already have an account? Log In"
          >
            <MoveLeft className="w-3 h-3 mr-1" aria-hidden="true" />
            Already have an account? Log In
          </Link>
        </div>
      </Card>
      
    </div>
  );
}
