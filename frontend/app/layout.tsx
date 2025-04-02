import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Globetrotter - Geography Quiz Game",
  description:
    "Test your geography knowledge with cryptic clues about famous destinations around the world!",
  keywords: [
    "geography",
    "quiz",
    "game",
    "travel",
    "destinations",
    "challenge",
  ],
  authors: [{ name: "Globetrotter Team" }],
  openGraph: {
    title: "Globetrotter - Geography Quiz Game",
    description:
      "Test your geography knowledge with cryptic clues about famous destinations!",
    url: "http:localhost:3000",
    //url: "https://globetrotter-quiz.vercel.app",
    siteName: "Globetrotter",
    images: [
      {
        url: "/assets/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Globetrotter - Geography Quiz Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Globetrotter - Geography Quiz Game",
    description:
      "Test your geography knowledge with cryptic clues about famous destinations!",
    images: ["/assets/logo.png"],
  },
  icons: {
    icon: "/assets/favicon.ico",
    //apple: "/assets/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
