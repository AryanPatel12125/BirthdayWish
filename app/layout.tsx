import type { Metadata, Viewport } from "next"; // 1. Import Viewport
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '600', '700']
});

// 2. The metadata object should ONLY contain metadata
export const metadata: Metadata = {
  title: "A Birthday Surprise!",
  description: "A special wish for a special person.",
};

// 3. Create a new, separate export for the viewport settings
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
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
