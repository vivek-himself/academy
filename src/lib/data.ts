export type Course = {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Master";
  mentor: string;
  mentorAvatar: string;
  rating: number;
  reviews: number;
  students: number;
  modules: number;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  badgeColor: string;
};

export const courses: Course[] = [
  {
    slug: "frontend-developer-fundamentals",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    category: "Frontend",
    level: "Beginner",
    mentor: "Nigel Quadros",
    mentorAvatar: "https://i.pravatar.cc/40?img=12",
    rating: 4.8,
    reviews: 1812,
    students: 8,
    modules: 5,
    duration: "1h 30m",
    price: 24.92,
    originalPrice: 32.0,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    slug: "learn-software-development",
    title: "Learn Software Development With Us! Unlock 600+ Courses Right Now",
    category: "Frontend",
    level: "Beginner",
    mentor: "Nigel Quadros",
    mentorAvatar: "https://i.pravatar.cc/40?img=32",
    rating: 4.6,
    reviews: 942,
    students: 8,
    modules: 5,
    duration: "1h 30m",
    price: 24.92,
    originalPrice: 32.0,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    slug: "create-your-online-course",
    title: "How To Create Your Online Course Step By Step",
    category: "Frontend",
    level: "Intermediate",
    mentor: "Nigel Quadros",
    mentorAvatar: "https://i.pravatar.cc/40?img=47",
    rating: 4.7,
    reviews: 630,
    students: 8,
    modules: 5,
    duration: "1h 30m",
    price: 24.92,
    originalPrice: 32.0,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    slug: "graphic-design-fundamentals",
    title: "Fundamentals of Graphic Design",
    category: "Design",
    level: "Master",
    mentor: "Nigel Quadros",
    mentorAvatar: "https://i.pravatar.cc/40?img=13",
    rating: 4.8,
    reviews: 1812,
    students: 8,
    modules: 5,
    duration: "1h 30m",
    price: 24.92,
    originalPrice: 32.0,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    slug: "ux-ui-design-animation",
    title: "Animation Is The Key Of Successful UI/UX Design",
    category: "Design",
    level: "Master",
    mentor: "Emerson Siphron",
    mentorAvatar: "https://i.pravatar.cc/40?img=15",
    rating: 4.5,
    reviews: 500,
    students: 8,
    modules: 5,
    duration: "1h 30m",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&q=80",
    badgeColor: "bg-violet-100 text-violet-700",
  },
];

export type CourseModule = {
  title: string;
  duration: string;
};

export const courseModules: CourseModule[] = [
  { title: "Introduction", duration: "Day 1" },
  { title: "What is UX Design", duration: "Day 1" },
  { title: "Usability Testing", duration: "Day 2" },
  { title: "Create Usability Test", duration: "Day 3" },
  { title: "How to Implement", duration: "Day 4" },
];

export const courseReviews = [
  {
    name: "Jason Smith",
    rating: 4,
    date: "20 Feb 2022",
    text: "This course definitely brings me more values than I expect. Thank you so much both of you guys!",
  },
  {
    name: "Wilson Armela",
    rating: 4,
    date: "20 Feb 2022",
    text: "Super helpful class! I'm on my way to create a Digital Marketing Agency and I have found plenty of value inside this course. Highly recommend.",
  },
  {
    name: "Ajax Simpson",
    rating: 4,
    date: "20 Feb 2022",
    text: "This class exceeded my expectations!",
  },
  {
    name: "Ajax Simpson",
    rating: 4,
    date: "20 Feb 2022",
    text: "This class exceeded my expectations!",
  },
  {
    name: "Wilson Armela",
    rating: 4,
    date: "20 Feb 2022",
    text: "Super helpful class! I'm on my way to create a Digital Marketing Agency and I have found plenty of value inside this course. Highly recommend.",
  },
];

export const courseTools = [
  { name: "Figma", plan: "Freemium" },
  { name: "Principle", plan: "Freemium" },
];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = Array.from({ length: 6 }).map((_, i) => ({
  slug: `positioning-brands-through-purpose-${i + 1}`,
  title: "Positioning Brands Through Purpose For Long Term Competitive Advantage",
  date: "Nov 29, 2025",
  author: "Vivek R",
  excerpt: "Positioning brands through purpose for long term competitive advantage is...",
  image: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80",
  ][i],
  tags: ["Free couses", "Marketing", "Idea", "LMS", "Academy", "Instructor"],
}));

export const recentPosts = blogPosts.slice(0, 3).map((p) => ({
  ...p,
  title: "Achieving Marketing Excellence With Data Driven Decisions",
}));

export const blogCategories = [
  { name: "Commercial", count: 15 },
  { name: "Office", count: 15 },
  { name: "Shop", count: 15 },
  { name: "Educate", count: 15 },
  { name: "Academy", count: 15 },
  { name: "Single family home", count: 15 },
];

export const blogTags = ["Free couses", "Marketing", "Idea", "LMS", "Academy", "Instructor"];

export type Mentor = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const mentors: Mentor[] = Array.from({ length: 6 }).map(() => ({
  name: "Nigel Quadros",
  role: "Social Media Expert",
  bio: "With over 15 years of experience in digital marketing, Nigel has helped hundreds of businesses grow their online presence. He specializes in SEO, SEM, and content",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
}));

export const faqs = [
  {
    question: "Are The Courses Live Or Pre-Recorded?",
    answer:
      "All sessions are live and interactive, with real-time guidance and hands-on projects. No boring videos.",
  },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
  { question: "Who Are These Courses For?" },
];

export const testimonial = {
  quote:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
  name: "Jon Doe",
  role: "CEO, Four Fold",
};

export const successStories = Array.from({ length: 6 }).map(() => ({
  thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80",
}));

export const navLinks = {
  growth: [
    { label: "Complete CV Rebrand", href: "/growth/cv-rebrand" },
    { label: "LinkedIn Optimisation", href: "/growth/linkedin-optimisation" },
    { label: "Interview Preparation", href: "/growth/job-search-consultation" },
    { label: "Packages", href: "/growth/packages" },
  ],
  resources: [
    { label: "Knowledgebase", href: "/knowledgebase" },
    { label: "Mentors", href: "/mentors" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQ's", href: "/faq" },
    { label: "Careers", href: "/careers" },
    { label: "Get in Touch", href: "/contact" },
  ],
};

export const footerLinks = {
  discover: [
    { label: "About", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Mentors", href: "/mentors" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Resources", href: "/knowledgebase" },
    { label: "FAQ's", href: "/faq" },
    { label: "Careers", href: "/careers" },
    { label: "Get in Touch", href: "/contact" },
  ],
  growth: [
    { label: "Complete CV Rebrand", href: "/growth/cv-rebrand" },
    { label: "LinkedIn Optimization", href: "/growth/linkedin-optimisation" },
    { label: "Interview Preparation", href: "/growth/job-search-consultation" },
    { label: "Packages", href: "/growth/packages" },
  ],
  more: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund & Cancellation Policy", href: "/refund-policy" },
    { label: "Philanthropy", href: "/philanthropy" },
    { label: "Partners", href: "/partners" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Modern Slavery Act", href: "/modern-slavery-act" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};
