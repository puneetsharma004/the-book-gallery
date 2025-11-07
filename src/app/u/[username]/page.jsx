import PublicProfilePageClient from "./page.client";

export async function generateMetadata({ params }) {
  const username = params.username;

  return {
    title: `${username}'s Library 📚`,
    description: `See what ${username} is reading on BookGallery.`,
    openGraph: {
      title: `${username}'s Book Gallery`,
      description: `View their reading journey 📚`,
      images: [
        `/api/og/user/${username}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username}'s Library`,
      images: [`/api/og/user/${username}`],
    },
  };
}

export default function Page() {
  return <PublicProfilePageClient />;
}
