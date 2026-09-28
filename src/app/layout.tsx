import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "OralEval | AI-powered oral examination",
  description: "A prototype for personalized oral examinations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
