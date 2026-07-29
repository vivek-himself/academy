import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import TestimonialsEditor from "./TestimonialsEditor";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Student Success Stories" subtitle="Manage the testimonial quotes shown across the site" />
      <TestimonialsEditor
        initialTestimonials={testimonials.map((t) => ({
          quote: t.quote,
          name: t.name,
          role: t.role,
          avatarUrl: t.avatarUrl ?? "",
        }))}
      />
    </div>
  );
}
