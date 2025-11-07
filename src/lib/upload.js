// lib/upload.js
import { supabase } from "./supabase";

export async function uploadCoverImage(file, userId) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `cover-${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // ✅ Upload file
  const { error: uploadError } = await supabase.storage
    .from("book-covers")
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  // ✅ Retrieve public URL properly
  const { data } = supabase.storage
    .from("book-covers")
    .getPublicUrl(filePath);

  return data.publicUrl; // <-- This is correct
}
