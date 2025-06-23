import type { Metadata, Viewport } from "next"; // 1. Import Viewport
import { Poppins } from "next/font/google";
import "./globals.css";

// 2. Configure the new Poppins font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] // Include common weights for style variation
});

// 3. The metadata object should ONLY contain metadata
export const metadata: Metadata = {
  title: "A Birthday Surprise!",
  description: "A special wish for a special person.",
};

// 4. Create a new, separate export for the viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents zooming, which can break the layout
  userScalable: false, // Prevents zooming
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 5. Apply the new font's class name to the body */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
