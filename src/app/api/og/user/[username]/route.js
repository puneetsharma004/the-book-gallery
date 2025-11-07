import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge"; // Faster
export const contentType = "image/png";

export async function GET(req, { params }) {
  const { username } = params;

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return new Response("Not Found", { status: 404 });
  }

  // Get books count
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", profile.id);

  const count = books?.length || 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #f59e0b, #b45309)",
          color: "white",
          padding: "60px",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: "bold" }}>
          📚 {profile.display_name || profile.username}'s Books
        </div>
        <div style={{ fontSize: 32, marginTop: 20 }}>
          {count} book{count !== 1 ? "s" : ""} in their library
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.8 }}>
          BookGallery — Track and Share Your Reads
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
