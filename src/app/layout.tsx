import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathPDF Codex",
  description:
    "Curriculum-aligned maths worksheet generator with fine-grained difficulty controls.",
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
