import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@academy.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Academy",
      tagline: "Marketing Mastery, One Class at a Time.",
      promoBarText: 'Use promo code "nqacademy" to avail 50%off',
      defaultSeoTitle: "Academy — Marketing Mastery, One Class at a Time",
      defaultSeoDescription: "Learn from industry experts and fast-track your career with Academy.",
      socialLinksJson: JSON.stringify({ linkedin: "#", instagram: "#" }),
    },
  });

  const categoryNames = ["Frontend", "Design", "Marketing", "Business", "Photography"];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase() },
    });
    categories[name] = cat.id;
  }

  const nigel = await prisma.mentor.upsert({
    where: { id: "mentor-nigel" },
    update: {},
    create: {
      id: "mentor-nigel",
      name: "Nigel Quadros",
      role: "Social Media Expert",
      bio: "With over 15 years of experience in digital marketing, Nigel has helped hundreds of businesses grow their online presence. He specializes in SEO, SEM, and content",
      imageDesktopUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      linkedinUrl: "#",
      websiteUrl: "#",
      order: 0,
    },
  });

  const emerson = await prisma.mentor.upsert({
    where: { id: "mentor-emerson" },
    update: {},
    create: {
      id: "mentor-emerson",
      name: "Emerson Siphron",
      role: "UI UX Design . Apps Design",
      bio: "Product designer and educator focused on UI/UX design, prototyping, and micro-interactions.",
      imageDesktopUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      linkedinUrl: "#",
      websiteUrl: "#",
      order: 1,
    },
  });

  const courseSeed = [
    {
      slug: "frontend-developer-fundamentals",
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      category: "Frontend",
      level: "Beginner",
      mentorId: nigel.id,
      rating: 4.8,
      reviewsCount: 1812,
      price: 24.92,
      originalPrice: 32.0,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    },
    {
      slug: "learn-software-development",
      title: "Learn Software Development With Us! Unlock 600+ Courses Right Now",
      category: "Frontend",
      level: "Beginner",
      mentorId: nigel.id,
      rating: 4.6,
      reviewsCount: 942,
      price: 24.92,
      originalPrice: 32.0,
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
    },
    {
      slug: "create-your-online-course",
      title: "How To Create Your Online Course Step By Step",
      category: "Frontend",
      level: "Intermediate",
      mentorId: nigel.id,
      rating: 4.7,
      reviewsCount: 630,
      price: 24.92,
      originalPrice: 32.0,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    },
    {
      slug: "graphic-design-fundamentals",
      title: "Fundamentals of Graphic Design",
      category: "Design",
      level: "Master",
      mentorId: nigel.id,
      rating: 4.8,
      reviewsCount: 1812,
      price: 24.92,
      originalPrice: 32.0,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    },
    {
      slug: "ux-ui-design-animation",
      title: "Animation Is The Key Of Successful UI/UX Design",
      category: "Design",
      level: "Master",
      mentorId: emerson.id,
      rating: 4.5,
      reviewsCount: 500,
      price: 64.99,
      image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&q=80",
    },
  ];

  const keyPoints = [
    "Understand the basics of Prototype & Animation",
    "Understand the basics of MicroInteraction",
    "Creating Animation (20 case studies) for mobile apps",
    "Presenting designs using Animation",
  ];
  const modules = [
    { title: "Introduction", duration: "Day 1" },
    { title: "What is UX Design", duration: "Day 1" },
    { title: "Usability Testing", duration: "Day 2" },
    { title: "Create Usability Test", duration: "Day 3" },
    { title: "How to Implement", duration: "Day 4" },
  ];
  const tools = [
    { name: "Figma", plan: "Freemium" },
    { name: "Principle", plan: "Freemium" },
  ];
  const reviews = [
    { name: "Jason Smith", rating: 4, date: "20 Feb 2022", text: "This course definitely brings me more values than I expect. Thank you so much both of you guys!" },
    { name: "Wilson Armela", rating: 4, date: "20 Feb 2022", text: "Super helpful class! I'm on my way to create a Digital Marketing Agency and I have found plenty of value inside this course. Highly recommend." },
    { name: "Ajax Simpson", rating: 4, date: "20 Feb 2022", text: "This class exceeded my expectations!" },
  ];

  for (const c of courseSeed) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        level: c.level,
        categoryId: categories[c.category],
        mentorId: c.mentorId,
        rating: c.rating,
        reviewsCount: c.reviewsCount,
        students: 8,
        modulesCount: 5,
        duration: "1h 30m",
        price: c.price,
        originalPrice: c.originalPrice,
        imageDesktopUrl: c.image,
        description:
          "The community's need for applications that can facilitate daily activities is increasing as technology advances. This class is the right medium to learn design and coding at the same time.",
        keyPointsJson: JSON.stringify(keyPoints),
        modulesJson: JSON.stringify(modules),
        toolsJson: JSON.stringify(tools),
      },
    });

    const existingReviews = await prisma.courseReview.count({ where: { courseId: course.id } });
    if (existingReviews === 0) {
      for (const r of reviews) {
        await prisma.courseReview.create({ data: { ...r, courseId: course.id } });
      }
    }
  }

  const blogImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80",
  ];
  for (let i = 0; i < 6; i++) {
    await prisma.blogPost.upsert({
      where: { slug: `positioning-brands-through-purpose-${i + 1}` },
      update: {},
      create: {
        slug: `positioning-brands-through-purpose-${i + 1}`,
        title: "Positioning Brands Through Purpose For Long Term Competitive Advantage",
        excerpt: "Positioning brands through purpose for long term competitive advantage is...",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat.",
        author: "Vivek R",
        date: "Nov 29, 2025",
        imageDesktopUrl: blogImages[i],
        tagsJson: JSON.stringify(["Free couses", "Marketing", "Idea", "LMS", "Academy", "Instructor"]),
        category: "Academy",
      },
    });
  }

  const faqSeed = [
    { question: "Are The Courses Live Or Pre-Recorded?", answer: "All sessions are live and interactive, with real-time guidance and hands-on projects. No boring videos." },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
    { question: "Who Are These Courses For?", answer: null },
  ];
  const existingFaqCount = await prisma.faq.count();
  if (existingFaqCount === 0) {
    for (let i = 0; i < faqSeed.length; i++) {
      await prisma.faq.create({ data: { ...faqSeed[i], page: "global", order: i } });
    }
  }

  const testimonialText =
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.";
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (let i = 0; i < 7; i++) {
      await prisma.testimonial.create({
        data: { quote: testimonialText, name: "Jon Doe", role: "CEO, Four Fold", order: i },
      });
    }
  }

  const growthPagesSeed = [
    {
      slug: "cv-rebrand",
      title: "Complete",
      titleHighlight: "CV Rebrand",
      subtitle: "Sending Out CVs But Not Receiving Interview Requests? This Is A Direct Fix To Overcoming This Hurdle.",
      checklist: ["95% Success Rate", "120+ Point Check", "Master CV", "120+ Point Check"],
      ctaLabel: "Fix My CV",
      expectParagraph: "If you're sending out your CV to roles you're perfect for but getting no replies, or you're facing automated rejection after you click apply... We'll reverse engineer a new CV that will be competitive, compliant, and hyper-effective at securing job interviews with top-tier companies in the GCC.",
      dayTabs: ["Day 1 - 2", "Day 3", "Day 4 - 6", "Day 7", "Added Benefits"],
      quickFacts: [
        { badge: "TikTok", title: "Recommended", description: "Our CV's have been praised by hiring teams at Amazon, DNEG & Careem." },
        { badge: "45", title: "45 minutes", description: "Is our fastest CV Rebrand to secure your next role post consultation." },
        { badge: "9", title: "9 days", description: "Is the fastest interview time our clients follow their CV Rebrand." },
        { badge: "GCC", title: "Region Wide", description: "Our CVs are optimised for hiring norms across the UAE, KSA and wider GCC." },
      ],
      benefitsTitle: "Benefits Of A Job Search Consultation",
      benefits: [
        { icon: "users", title: "Get interviews", description: "Land interviews with market leading companies." },
        { icon: "award", title: "Get offers", description: "94% attend their 1st interview within 4 weeks." },
        { icon: "flag", title: "Final steps", description: "Negotiate, accept and start your new role in the GCC." },
      ],
      benefitsCta: "Fix My CV",
    },
    {
      slug: "linkedin-optimisation",
      title: "LinkedIn",
      titleHighlight: "Optimisation",
      subtitle: "Want Hiring Teams To Start Headhunting For Interviews? We'll Drive Recruiters To Your Inbox.",
      checklist: ["Headhunted 2x P/W", "Headhunted In 48 Hours", "Hidden Job Market", "12+ Months To 4 Weeks"],
      ctaLabel: "Fix My LinkedIn",
      expectParagraph: "If you've not been getting headhunted by recruitment teams, it's likely because you're invisible on LinkedIn Recruiter. The best companies don't roll the dice on whether the right talent applies to their job, they use LinkedIn to find them before anyone else does.",
      dayTabs: ["Day 1 - 2", "Day 3", "Day 4 - 6", "Day 7", "Added Benefits"],
      quickFacts: [
        { badge: "NBD", title: "Immediate access", description: "LinkedIn Optimization will provide you with immediate access to higher paying opportunities that aren't listed on public job boards." },
        { badge: "2x", title: "x2", description: "On average, our clients get contacted twice per week by recruiters from renowned recruitment firms following LinkedIn Optimisation." },
        { badge: "4wk", title: "4 weeks", description: "Executives who have used LinkedIn Optimisation have found success within four weeks of major recruiters reaching out." },
        { badge: "GCC", title: "Region Wide", description: "Our profile rewrites are tailored to how recruiters search inside the GCC market." },
      ],
      benefitsTitle: "Benefits Of A Job Search Consultation",
      benefits: [
        { icon: "lock", title: "Access roles", description: "Get headhunted for roles that won't be listed on public job boards." },
        { icon: "users", title: "Less competition", description: "The average vacancy has 1k+ applicants, you'll only have to compete against a handful." },
        { icon: "clock", title: "Attract recruiters", description: "Get contacted by relevant recruiters in as little as 48 hours." },
      ],
      benefitsCta: "Fix My LinkedIn",
    },
    {
      slug: "job-search-consultation",
      title: "Job Search",
      titleHighlight: "Consultation",
      subtitle: "Need To Secure Your Next Role Urgently? We'll Consult You On How To Land Even The Most Senior Of Positions In 2-4 Weeks.",
      checklist: ["Interviews In 29 Minutes", "Written Offer In 33 Days", "Verbal Offer In 26 Days", "Final Stage In 18 Days"],
      ctaLabel: "Book Consultation",
      expectParagraph: "You've seen some pretty impressive stats above, but does this guarantee you're going to get these exact same results in these exact same time-spans? Of course not. But you'll be able to leave the guessing game behind, and start running a hyper-effective search that WILL enable you to land interviews and secure your next role in the GCC.",
      dayTabs: ["Day 1 - 2", "Day 3", "Day 4 - 6", "Day 7", "Added Benefits"],
      quickFacts: [
        { badge: "500", title: "Fortune 500", description: "Our sprint search strategy has led to job offers being released and accepted in over 100+ of the Fortune 500 Arabia." },
        { badge: "CXO", title: "Join the Execs", description: "Our strategy has helped CXOs turn a 8-12 month job search process into a 2-4 week sprint." },
        { badge: "2-4", title: "2-4 weeks", description: "Is the expected time scale to secure your next role post consultation." },
        { badge: "36", title: "36 minutes", description: "Is the fastest interview time our clients follow their consultation." },
      ],
      benefitsTitle: "Benefits Of A Job Search Consultation",
      benefits: [
        { icon: "send", title: "Effective outreach", description: "Learn how to get recruiters, hiring teams, and employers to want to work with you." },
        { icon: "search", title: "Structured search", description: "Understand what works and what doesn't; no more guessing games." },
        { icon: "star", title: "Instant advantage", description: "Immediately gain an advantage over other job seekers applying for the same jobs as you." },
      ],
      benefitsCta: "Book Consultation",
    },
  ];

  for (const g of growthPagesSeed) {
    await prisma.growthPage.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug,
        title: g.title,
        titleHighlight: g.titleHighlight,
        subtitle: g.subtitle,
        checklistJson: JSON.stringify(g.checklist),
        ctaLabel: g.ctaLabel,
        expectParagraph: g.expectParagraph,
        dayTabsJson: JSON.stringify(g.dayTabs),
        quickFactsJson: JSON.stringify(g.quickFacts),
        benefitsTitle: g.benefitsTitle,
        benefitsJson: JSON.stringify(g.benefits),
        benefitsCta: g.benefitsCta,
      },
    });
  }

  const rows = ["Complete CV Rebrand", "LinkedIn Optimisation", "Job Search Consultation", "Interview Preparation", "Private Network", "Job Offer Review", "Customer Success"];
  const plans = [
    { name: "Fundamentals", price: "₹2,499", recommended: false, included: [true, true, false, false, true, false, true] },
    { name: "Fundamentals+", tagline: "Get me interviews (Urgent)", price: "₹3,399", recommended: true, included: [true, true, true, false, false, false, true] },
    { name: "Advanced", tagline: "No stone unturned", price: "₹4,299", recommended: false, included: [true, true, true, true, true, true, true] },
  ];
  const existingPlans = await prisma.pricingPlan.count();
  if (existingPlans === 0) {
    for (let i = 0; i < plans.length; i++) {
      const p = plans[i];
      const features = rows.map((label, idx) => ({ label, included: p.included[idx] }));
      await prisma.pricingPlan.create({
        data: {
          name: p.name,
          tagline: p.tagline,
          price: p.price,
          recommended: p.recommended,
          featuresJson: JSON.stringify(features),
          order: i,
        },
      });
    }
  }

  const footerLinksSeed: { column: string; label: string; href: string }[] = [
    { column: "discover", label: "About", href: "/about" },
    { column: "discover", label: "Courses", href: "/courses" },
    { column: "discover", label: "Mentors", href: "/mentors" },
    { column: "discover", label: "Success Stories", href: "/success-stories" },
    { column: "discover", label: "Resources", href: "/knowledgebase" },
    { column: "discover", label: "FAQ's", href: "/faq" },
    { column: "discover", label: "Careers", href: "/careers" },
    { column: "discover", label: "Get in Touch", href: "/contact" },
    { column: "growth", label: "Complete CV Rebrand", href: "/growth/cv-rebrand" },
    { column: "growth", label: "LinkedIn Optimization", href: "/growth/linkedin-optimisation" },
    { column: "growth", label: "Interview Preparation", href: "/growth/job-search-consultation" },
    { column: "growth", label: "Packages", href: "/growth/packages" },
    { column: "more", label: "Privacy Policy", href: "/privacy-policy" },
    { column: "more", label: "Terms & Conditions", href: "/terms" },
    { column: "more", label: "Refund & Cancellation Policy", href: "/refund-policy" },
    { column: "more", label: "Philanthropy", href: "/philanthropy" },
    { column: "more", label: "Partners", href: "/partners" },
    { column: "more", label: "Cookie Policy", href: "/cookie-policy" },
    { column: "more", label: "Modern Slavery Act", href: "/modern-slavery-act" },
    { column: "more", label: "Sitemap", href: "/sitemap" },
  ];
  const existingFooterLinks = await prisma.footerLink.count();
  if (existingFooterLinks === 0) {
    for (let i = 0; i < footerLinksSeed.length; i++) {
      await prisma.footerLink.create({ data: { ...footerLinksSeed[i], order: i } });
    }
  }

  const existingHero = await prisma.heroSlide.count();
  if (existingHero === 0) {
    await prisma.heroSlide.create({
      data: {
        title: "Learn something new everyday.",
        subtitle: "Become professionals and ready to join the world.",
        ctaLabel: "Explore After Effects",
        ctaHref: "/courses",
        imageDesktopUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80",
        order: 0,
      },
    });
  }

  const statsSeed = [
    { icon: "users", value: "3.2K+", label: "Active Learners" },
    { icon: "book", value: "20+", label: "Expert Courses" },
    { icon: "award", value: "1.2K+", label: "Certificates Issued" },
    { icon: "trending", value: "100%", label: "Success Rate" },
  ];
  const existingStats = await prisma.homepageStat.count();
  if (existingStats === 0) {
    for (let i = 0; i < statsSeed.length; i++) {
      await prisma.homepageStat.create({ data: { ...statsSeed[i], order: i } });
    }
  }

  const trustLogosSeed = ["YourStory", "The Economic Times", "The Statesman", "Goa Times", "The Goan", "MarkNews"];
  const existingTrustLogos = await prisma.trustLogo.count();
  if (existingTrustLogos === 0) {
    for (let i = 0; i < trustLogosSeed.length; i++) {
      await prisma.trustLogo.create({ data: { name: trustLogosSeed[i], order: i } });
    }
  }

  await prisma.contentBlock.upsert({
    where: { key: "home_tech_stack" },
    update: {},
    create: {
      key: "home_tech_stack",
      dataJson: JSON.stringify({
        eyebrow: "Something Goes Here",
        title: "Tech Stack We Will Use For Our Students",
        description: "There are many variations of passages of Lorem Ipsum available.",
        ctaLabel: "Explore Course",
      }),
    },
  });

  await prisma.contentBlock.upsert({
    where: { key: "home_grow_skill" },
    update: {},
    create: {
      key: "home_grow_skill",
      dataJson: JSON.stringify({
        title: "Grow Your Skill With Title Here",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        checklist: ["Certification", "Certification", "Certification", "Certification"],
        ctaLabel: "Explore Course",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80",
      }),
    },
  });

  await prisma.contentBlock.upsert({
    where: { key: "home_random_promo" },
    update: {},
    create: {
      key: "home_random_promo",
      dataJson: JSON.stringify({
        eyebrow: "Something Goes Here",
        title: "Random Title Here",
        description: "There are many variations of passages of Lorem Ipsum available.",
        ctaLabel: "Explore Course",
      }),
    },
  });

  await prisma.contentBlock.upsert({
    where: { key: "cta_banner_default" },
    update: {},
    create: {
      key: "cta_banner_default",
      dataJson: JSON.stringify({
        title: "Join a course now to get 35% off",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
        ctaLabel: "Join Academy",
        href: "/courses",
      }),
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
