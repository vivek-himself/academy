import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import PostsTable from "./PostsTable";

export const dynamic = "force-dynamic";

export default async function KnowledgeBaseAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        subtitle="Manage blog posts and articles"
        action={
          <Link
            href="/admin/knowledge-base/new"
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            <Plus size={15} /> New Post
          </Link>
        }
      />
      <PostsTable posts={posts.map((p) => ({ id: p.id, title: p.title, date: p.date, published: p.published }))} />
    </div>
  );
}
