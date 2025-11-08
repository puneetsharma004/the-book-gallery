// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { useToaster } from "react-hot-toast";

// export default function LoginForm() {
//   const router = useRouter();
//   const { toast } = useToaster();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleLogin(e) {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       toast({
//         title: "Login Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       setLoading(false);
//       return;
//     }

//     toast({
//       title: "Success 🎉",
//       description: "Welcome back!",
//     });

//     router.push("/user");
//   }

//   return (
//     <form onSubmit={handleLogin} className="space-y-5">

//       {/* EMAIL */}
//       <div>
//         <Label className="text-white/80">Email</Label>
//         <Input
//           type="email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="you@example.com"
//           className="bg-white/10 border-white/20 text-white placeholder-white/40 
//                      focus:border-white/40 focus:ring-white/30 transition-all"
//         />
//       </div>

//       {/* PASSWORD WITH TOGGLE */}
//       <div>
//         <Label className="text-white/80">Password</Label>
//         <div className="relative">
//           <Input
//             type={showPass ? "text" : "password"}
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             className="bg-white/10 border-white/20 text-white placeholder-white/40 
//                        focus:border-white/40 focus:ring-white/30 pr-10 transition-all"
//           />

//           <button
//             type="button"
//             onClick={() => setShowPass(!showPass)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
//             aria-label="Toggle Password Visibility"
//           >
//             {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//       </div>

//       {/* SUBMIT */}
//       <Button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-white/20 border border-white/30 text-white 
//                    hover:bg-white/30 rounded-md transition flex items-center justify-center"
//       >
//         {loading ? (
//           <>
//             <Loader2 className="animate-spin h-4 w-4 mr-2" />
//             Logging in...
//           </>
//         ) : (
//           "Log In"
//         )}
//       </Button>
//     </form>
//   );
// }
