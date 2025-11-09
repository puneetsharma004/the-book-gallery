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
  const { data, error } = await supabase
    .from("books")
    .insert([book])
    .select()
    .single(); // Returns single object instead of array
  
  if (error) throw error;
  return data;
}

export async function updateBook(id, updates) {
  const { error } = await supabase
    .from("books")
    .update(updates)
    .eq("id", id);
  
  if (error) throw error;
}

export async function deleteBook(id) {
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}


export async function fetchBookCover(title) {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );
    const data = await response.json();

    if (data.docs?.[0]?.cover_i) {
      return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
    }
    return null;
  } catch (error) {
    console.error("Cover fetch error:", error);
    return null;
  }
}