import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "30 Anni di Vanzoo — RSVP",
  description: "Conferma la tua presenza alla festa di 30 anni di Vanzoo",
  openGraph: {
    title: "30 Anni di Vanzoo 🥂",
    description: "Non puoi mancare! Conferma la tua presenza.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-dark text-[#F5F0E8] min-h-screen">
        {children}
      </body>
    </html>
  );
}
