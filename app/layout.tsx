import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // 1. Import from next/font
import "./globals.css";

// 2. Configure the font
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] // Include all weights you use
});

export const metadata: Metadata = {
  title: "A Birthday Surprise!",
  description: "A special wish for a special person.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the font's class name to the body */}
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
