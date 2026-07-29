import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import FaqsEditor from "./FaqsEditor";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="FAQ Management" subtitle="Manage the questions shown on the FAQ page and throughout the site" />
      <FaqsEditor initialFaqs={faqs.map((f) => ({ question: f.question, answer: f.answer ?? "" }))} />
    </div>
  );
}
