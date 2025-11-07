"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { supabase } from "@/lib/supabase";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToaster } from "react-hot-toast";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToaster();

  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async ({ username, email, password }) => {
    setIsLoading(true);

    try {
      // Check username availability
      const { data: existing } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existing) {
        toast({
          title: "Username Taken",
          description: "Try a different username.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create account
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const user = data.user;

      // Sign in immediately after
      await supabase.auth.signInWithPassword({ email, password });

      // Insert profile
      await supabase.from("users").insert({
        id: user.id,
        email,
        username,
        display_name: username,
        bio: "",
      });

      toast({ title: "Account Created 🎉", description: "Welcome to The Book Gallery!" });

      router.push("/user");
    } catch (err) {
      toast({
        title: "Signup Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Username */}
      <div>
        <Label className="text-white/80">Username</Label>
        <Input
          placeholder="yourname"
          {...register("username")}
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-white placeholder-white/40
                     focus:border-white/40 focus:ring-white/30 transition-all"
        />
        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div>
        <Label className="text-white/80">Email</Label>
        <Input
          placeholder="you@example.com"
          type="email"
          {...register("email")}
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-white placeholder-white/40
                     focus:border-white/40 focus:ring-white/30 transition-all"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password with Toggle */}
      <div>
        <Label className="text-white/80">Password</Label>
        <div className="relative">
          <Input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white placeholder-white/40
                       focus:border-white/40 focus:ring-white/30 transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30 transition rounded-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Creating…
          </>
        ) : (
          "Create Account"
        )}
      </Button>

    </form>
  );
}
