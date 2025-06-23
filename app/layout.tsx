import type { Metadata } from "next";
// 1. Import the font from next/font/google
import { Montserrat } from "next/font/google";
import "./globals.css";

// 2. Configure the font with desired weights and subsets
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] // Add weights you use in your CSS
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
    // 3. Apply the font's className to the body tag
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
