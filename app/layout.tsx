import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CodexFlow - Your Second Brain for Code & Developer Flow",
  description:
    "Capture ideas, link concepts automatically, and navigate your knowledge with AI. Turn scattered developer thoughts into connected insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
