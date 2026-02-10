import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agora | Campus Marketplace",
  description: "A shared space for shared things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Notice: No <header> or <nav> here. 
            This ensures the "CampusMarket" bar disappears 
            and only your custom Agora bar shows up.
        */}
        {children}
      </body>
    </html>
  );
}