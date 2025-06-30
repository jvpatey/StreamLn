import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StreamLn - Development Organization Made Simple",
  description:
    "Smart technical notes, visual task boards, and lightweight AI assistance combined into one interface. Built for solo devs and small teams who need structure and clarity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
