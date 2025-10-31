import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primary Math Worksheets",
  description: "Auto-generated printable practice sets for primary students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
