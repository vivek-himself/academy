import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import "../globals.css";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import PromoBar from "@/components/layout/PromoBar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardPromoBanner from "@/components/dashboard/DashboardPromoBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard — Academy",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-surface text-foreground">
        <PromoBar />
        <div className="flex flex-col lg:flex-row">
          <DashboardSidebar />
          <main className="min-w-0 flex-1 p-4 sm:p-8">
            <DashboardPromoBanner />
            <div className="mt-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
