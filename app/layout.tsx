import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "is-07-codereview-project — Code Review with AI 2026",
  description:
    "Day 7 reference: a clean Next.js app with the full AI code-review stack wired — linters, REVIEW.md, hooks, security subagent, CodeRabbit, CI severity-gating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
