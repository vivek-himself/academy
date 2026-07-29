import PageHeader from "../../../components/PageHeader";
import BlogPostForm, { type BlogPostFormValue } from "../BlogPostForm";

const initial: BlogPostFormValue = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  author: "Admin",
  date: "",
  imageDesktopUrl: "",
  imageMobileUrl: "",
  tagsJson: "[]",
  category: "Academy",
  seoTitle: "",
  seoDescription: "",
  published: true,
};

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="New Post" subtitle="Write a new knowledge base article" />
      <BlogPostForm initial={initial} />
    </div>
  );
}
