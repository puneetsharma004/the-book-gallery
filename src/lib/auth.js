// lib/auth.js
import { supabase } from "./supabase";

export async function getCurrentUser() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  // ✅ Fetch profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { ...user, profile };
}

export async function logout() {
  await supabase.auth.signOut();
}
