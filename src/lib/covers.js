export async function fetchBookCover(title) {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );
    const data = await response.json();

    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      const coverId = data.docs[0].cover_i;
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }

    return null; // fallback: no cover found
  } catch (error) {
    console.error("Cover fetch error:", error);
    return null;
  }
}
