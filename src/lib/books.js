import { supabase } from "./supabase";

export async function getBooks(user_id) {
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function addBook(book) {
  await supabase.from("books").insert(book);
}

export async function updateBook(id, updates) {
  await supabase.from("books").update(updates).eq("id", id);
}

export async function deleteBook(id) {
  await supabase.from("books").delete().eq("id", id);
}
