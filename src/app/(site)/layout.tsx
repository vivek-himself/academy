import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import PromoBar from "@/components/layout/PromoBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteTitle = "Academy — Marketing Mastery, One Class at a Time";
const siteDescription = "Learn from industry experts and fast-track your career with Academy.";

export const metadata: Metadata = {
  metadataBase: new URL("https://academy-mocha-two.vercel.app"),
  title: { default: siteTitle, template: "%s — Academy" },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Academy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-pink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <PromoBar />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
