import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Book Gallery",
  description: "A curated collection of books",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: { fontSize: "14px" },
            success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
            error: { iconTheme: { primary: "#dc2626", secondary: "white" } },
          }}
        />
      </body>
    </html>
  );
}
