import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Fast Delivery | Daily Essentials Delivered to Your Doorstep in Bilariyaganj",
  description:
    "Order groceries, food, milk, sugar, cooking oil, medicines and household daily needs in Bilariyaganj. Fast local delivery right to your home.",
  keywords: [
    "Fast Delivery",
    "Bilariyaganj",
    "Grocery Delivery Bilariyaganj",
    "Daily Essentials",
    "Sugar",
    "Milk",
    "Basmati Rice",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
