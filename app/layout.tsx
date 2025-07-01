// Import global styles and fonts
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Configure Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Site metadata for SEO and browser display
export const metadata = {
  title: "StreamLn - Development Organization Made Simple",
  description:
    "Smart technical notes, visual task boards, and lightweight AI assistance combined into one interface. Built for solo devs and small teams who need structure and clarity.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

// Root layout component that wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        {/* Theme provider for dark/light mode switching */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
