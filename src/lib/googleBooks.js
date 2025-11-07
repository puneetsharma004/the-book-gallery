export async function searchGoogleBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=15&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map((item) => {
      const info = item.volumeInfo;

      return {
        title: info.title || "Untitled",
        author: info.authors?.join(", ") || "Unknown Author",
        year: info.publishedDate?.split("-")[0] || "",
        cover_url: info.imageLinks?.thumbnail?.replace("http://", "https://") || null,
        isbn: info.industryIdentifiers?.[0]?.identifier || item.id,
      };
    });
  } catch (err) {
    console.error("Google Books Search Error:", err);
    return [];
  }
}
