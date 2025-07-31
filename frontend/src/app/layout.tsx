import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import PageTransition from "../components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mindflip - Nền tảng học từ vựng thông minh",
  description: "Mindflip - Nền tảng học từ vựng thông minh",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 min-h-screen transition-colors duration-500`}>
        <PageTransition>
          <Navigation />
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
