import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import "../globals.css";
import PromoBar from "@/components/layout/PromoBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import { currencyForCountry } from "@/lib/currency";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, headersList] = await Promise.all([getStudentSession(), headers()]);
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true } }) : null;
  const geoCurrency = currencyForCountry(headersList.get("x-vercel-ip-country"));

  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="site-cursor flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-pink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <CurrencyProvider initialCurrency={geoCurrency}>
          <PromoBar />
          <Header user={user} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
