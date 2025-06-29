import "./globals.css";

export const metadata = {
  title: "CodexFlow",
  description: "Your second brain for code, decisions, and developer flow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
