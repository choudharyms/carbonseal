import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switch to Inter
import "./globals.css";

// Use Inter instead of Geist
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carbon Seal",
  description: "Blue Carbon Registry & MRV System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply Inter class */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}