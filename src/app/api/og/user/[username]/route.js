import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const contentType = "image/png";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

export async function GET(request, { params }) {
  try {
    const { username } = await params;

    if (!username) {
      return new Response("Username required", { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, username, display_name")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return new Response("User not found", { status: 404 });
    }

    const { data: books } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", profile.id);

    const count = books?.length || 0;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background Elements */}
          <div
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
              top: "-200px",
              right: "-150px",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
              bottom: "-100px",
              left: "-50px",
              borderRadius: "50%",
            }}
          />

          {/* Main Content */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "100px",
              paddingRight: "100px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Top Section - User Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "48px",
              }}
            >
              {/* Icon & Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    marginRight: "12px",
                    display: "flex",
                  }}
                >
                  📚
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    background: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "20px",
                    fontSize: 14,
                    color: "#3b82f6",
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  Book Collection
                </div>
              </div>

              {/* Username */}
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-1px",
                  marginBottom: "12px",
                  lineHeight: 1.1,
                  display: "flex",
                }}
              >
                {profile.display_name || profile.username}
              </div>

              {/* Accent Line */}
              <div
                style={{
                  height: "4px",
                  width: "100px",
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  borderRadius: "2px",
                  display: "flex",
                }}
              />
            </div>

            {/* Stats Section */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "48px",
                marginBottom: "48px",
              }}
            >
              {/* Book Count */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: "#94a3b8",
                    fontWeight: 500,
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "flex",
                  }}
                >
                  Total Books
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    backgroundClip: "text",
                    color: "transparent",
                    display: "flex",
                  }}
                >
                  {count}
                </div>
              </div>

              {/* Type */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    color: "#64748b",
                    marginBottom: "8px",
                    display: "flex",
                  }}
                >
                  {count === 1 ? "Book" : "Books"}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "#cbd5e1",
                    display: "flex",
                  }}
                >
                  Shared Publicly
                </div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "32px",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: "#64748b",
                  display: "flex",
                }}
              >
                ✨ BookGallery — Track & Share Your Reads
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#cbd5e1",
                  display: "flex",
                }}
              >
                bookgallery.app
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error("OG Image error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
