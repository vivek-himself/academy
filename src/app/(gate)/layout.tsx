import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academy",
  robots: { index: false, follow: false },
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      {/* Inline styles here because globals.css has an unlayered `body { background, color }`
          rule that otherwise silently wins over Tailwind's bg-brand-purple/text-white utility
          classes, regardless of specificity — same root cause as the backdrop-filter issue
          this build's CSS pipeline hit earlier. Inline styles always take precedence. */}
      <body
        className="flex min-h-full flex-col items-center justify-center px-4"
        style={{ backgroundColor: "var(--color-brand-purple)", color: "#fff" }}
      >
        {children}
      </body>
    </html>
  );
}
