import { safeJsonParse } from "./json";
import type { Course as DbCourse, Category, Mentor as DbMentor, BlogPost as DbBlogPost, GrowthPage as DbGrowthPage } from "@/generated/prisma/client";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80";

export function mapCourse(course: DbCourse & { category: Category | null; mentor: DbMentor | null }) {
  return {
    slug: course.slug,
    title: course.title,
    category: course.category?.name ?? "General",
    level: course.level as "Beginner" | "Intermediate" | "Master",
    mentor: course.mentor?.name ?? "Academy Team",
    mentorAvatar: course.mentor?.imageDesktopUrl ?? "https://i.pravatar.cc/40",
    rating: course.rating,
    reviews: course.reviewsCount,
    students: course.students,
    modules: course.modulesCount,
    duration: course.duration,
    price: course.price,
    originalPrice: course.originalPrice ?? undefined,
    image: course.imageDesktopUrl ?? FALLBACK_IMAGE,
    badgeColor: "bg-violet-100 text-violet-700",
  };
}

export function mapBlogPost(post: DbBlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    image: post.imageDesktopUrl ?? FALLBACK_IMAGE,
    tags: safeJsonParse<string[]>(post.tagsJson, []),
  };
}

export function mapMentor(mentor: DbMentor) {
  return {
    name: mentor.name,
    role: mentor.role,
    bio: mentor.bio,
    image: mentor.imageDesktopUrl ?? FALLBACK_IMAGE,
  };
}

export type GrowthPageView = ReturnType<typeof mapGrowthPage>;

export function mapGrowthPage(page: DbGrowthPage) {
  return {
    slug: page.slug,
    eyebrow: page.eyebrow ?? undefined,
    title: page.title,
    titleHighlight: page.titleHighlight,
    subtitle: page.subtitle,
    checklist: safeJsonParse<string[]>(page.checklistJson, []),
    ctaLabel: page.ctaLabel,
    heroImageDesktopUrl: page.heroImageDesktopUrl ?? undefined,
    expectParagraph: page.expectParagraph,
    dayTabs: safeJsonParse<string[]>(page.dayTabsJson, []),
    expectImageDesktopUrl: page.expectImageDesktopUrl ?? undefined,
    quickFacts: safeJsonParse<{ badge: string; title: string; description: string }[]>(page.quickFactsJson, []),
    benefitsTitle: page.benefitsTitle,
    benefits: safeJsonParse<{ icon: string; title: string; description: string }[]>(page.benefitsJson, []),
    benefitsCta: page.benefitsCta,
  };
}
