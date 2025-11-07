import { supabase } from "./supabase";

export async function getProfileAndBooks(username) {
  // 1. Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("id, username, display_name")
    .eq("username", username)
    .single();

  if (!profile) return null;

  // 2. Get books of that user
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return { profile, books };
}
