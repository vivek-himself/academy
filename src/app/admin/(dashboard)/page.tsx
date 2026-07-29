import { DollarSign, Users, BookOpen, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../components/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [courseCount, mentorCount, postCount, faqCount] = await Promise.all([
    prisma.course.count(),
    prisma.mentor.count(),
    prisma.blogPost.count(),
    prisma.faq.count(),
  ]);

  const cards = [
    { icon: BookOpen, label: "Courses & Programs", value: courseCount, color: "bg-blue-500" },
    { icon: Users, label: "Mentors & Instructors", value: mentorCount, color: "bg-emerald-500" },
    { icon: DollarSign, label: "Knowledge Base Posts", value: postCount, color: "bg-brand-pink" },
    { icon: Star, label: "FAQ Entries", value: faqCount, color: "bg-purple-500" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back — here's what's on your website right now." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-brand-border bg-white p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.color}`}>
              <c.icon size={20} />
            </span>
            <p className="mt-4 text-2xl font-bold text-brand-ink">{c.value}</p>
            <p className="text-sm text-brand-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-brand-border bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <BookOpen size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-brand-ink">Website Status</h3>
            <p className="text-sm text-brand-muted">Your website is live and reading content from this CMS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
