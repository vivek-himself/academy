"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { TextField, TextAreaField } from "../../components/FormField";
import ImageUploadField from "../../components/ImageUploadField";
import StringListField from "../../components/StringListField";
import RepeaterField from "../../components/RepeaterField";
import SaveBar from "../../components/SaveBar";
import MediaMultiPickerModal from "../../components/MediaMultiPickerModal";
import SectionJumpMenu from "../../components/SectionJumpMenu";

type HeroSlide = { title: string; subtitle: string; ctaLabel: string; ctaHref: string; imageDesktopUrl: string; imageMobileUrl: string };
const EMPTY_HERO_SLIDE: HeroSlide = { title: "", subtitle: "", ctaLabel: "", ctaHref: "/courses", imageDesktopUrl: "", imageMobileUrl: "" };
type Stat = { icon: string; value: string; label: string };
type TrustLogo = { name: string; imageUrl: string };
type EyebrowBlock = { eyebrow: string; title: string; description: string; ctaLabel: string; imageUrl: string };
type GrowSkill = { title: string; description: string; checklist: string[]; ctaLabel: string; imageUrl: string };
type CtaBanner = { title: string; description: string; ctaLabel: string; href: string; imageUrl: string };
type ReviewBadge = { label: string; rating: string; imageUrl: string };
const EMPTY_REVIEW_BADGE: ReviewBadge = { label: "", rating: "", imageUrl: "" };
type TrendingCourses = { title: string; bannerImageUrl: string; bannerText: string };

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 rounded-2xl border border-brand-border bg-brand-card p-6">
      <h3 className="text-base font-bold text-brand-ink">{title}</h3>
      {description && <p className="mt-1 text-xs text-brand-muted">{description}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

const JUMP_GROUPS = [
  {
    heading: "Top of Page",
    items: [
      { id: "hero-slideshow", label: "Hero Slideshow" },
      { id: "stats-bar", label: "Stats Bar" },
    ],
  },
  {
    heading: "Trust & Social Proof",
    items: [
      { id: "review-badges", label: "Review Platform Badges" },
      { id: "trust-logos", label: "Trust Logos" },
    ],
  },
  {
    heading: "Promo Banners",
    items: [
      { id: "tech-stack", label: "Tech Stack Banner" },
      { id: "grow-skill", label: "Grow Your Skill Section" },
      { id: "random-promo", label: "Random Promo Banner" },
      { id: "cta-banner", label: "Default CTA Banner" },
    ],
  },
  {
    heading: "Courses",
    items: [{ id: "trending-courses", label: "Trending Courses" }],
  },
];

export default function HomepageEditor({
  heroSlides: initHeroSlides,
  stats: initStats,
  trustLogos: initTrustLogos,
  techStack: initTechStack,
  growSkill: initGrowSkill,
  randomPromo: initRandomPromo,
  ctaBanner: initCtaBanner,
  reviewBadges: initReviewBadges,
  trendingCourses: initTrendingCourses,
}: {
  heroSlides: HeroSlide[];
  stats: Stat[];
  trustLogos: TrustLogo[];
  techStack: EyebrowBlock;
  growSkill: GrowSkill;
  randomPromo: EyebrowBlock;
  ctaBanner: CtaBanner;
  reviewBadges: ReviewBadge[];
  trendingCourses: TrendingCourses;
}) {
  const router = useRouter();
  const [heroSlides, setHeroSlides] = useState(initHeroSlides.length ? initHeroSlides : [EMPTY_HERO_SLIDE]);
  const [stats, setStats] = useState(initStats);
  const [trustLogos, setTrustLogos] = useState(initTrustLogos);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const [trimming, setTrimming] = useState(false);
  const [trimStatus, setTrimStatus] = useState("");

  async function handleTrimLogos() {
    setTrimming(true);
    setTrimStatus("");
    try {
      const res = await fetch("/api/admin/media/trim-logos", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setTrimStatus(
        data.trimmed.length > 0
          ? `Trimmed ${data.trimmed.length} logo${data.trimmed.length === 1 ? "" : "s"}. Reloading...`
          : "No logos needed trimming."
      );
      if (data.trimmed.length > 0) {
        setTimeout(() => window.location.reload(), 800);
      }
    } catch {
      setTrimStatus("Failed to trim logos. Please try again.");
    } finally {
      setTrimming(false);
    }
  }
  const [techStack, setTechStack] = useState(initTechStack);
  const [growSkill, setGrowSkill] = useState(initGrowSkill);
  const [randomPromo, setRandomPromo] = useState(initRandomPromo);
  const [ctaBanner, setCtaBanner] = useState(initCtaBanner);
  const [reviewBadges, setReviewBadges] = useState(initReviewBadges);
  const [trendingCourses, setTrendingCourses] = useState(initTrendingCourses);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSaveAll() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroSlides,
        stats,
        trustLogos,
        blocks: {
          home_tech_stack: JSON.stringify(techStack),
          home_grow_skill: JSON.stringify(growSkill),
          home_random_promo: JSON.stringify(randomPromo),
          cta_banner_default: JSON.stringify(ctaBanner),
          home_review_badges: JSON.stringify(reviewBadges),
          home_trending_courses: JSON.stringify(trendingCourses),
        },
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("Failed to save. Please try again.");
      return;
    }
    setStatus("Saved! Your homepage is now updated.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionJumpMenu groups={JUMP_GROUPS} />

      <SectionCard
        id="hero-slideshow"
        title="Hero Slideshow"
        description="The banner at the top of the homepage. Add multiple slides to have it auto-advance every few seconds."
      >
        {heroSlides.map((slide, i) => (
          <div key={i} className="rounded-xl border border-brand-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Slide {i + 1}</span>
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => setHeroSlides(heroSlides.filter((_, idx) => idx !== i))}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <TextField
                label="Title"
                maxLength={80}
                value={slide.title}
                onChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, title: v } : s)))}
              />
              <TextAreaField
                label="Subtitle"
                rows={2}
                maxLength={160}
                value={slide.subtitle}
                onChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, subtitle: v } : s)))}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="Button Label"
                  maxLength={30}
                  value={slide.ctaLabel}
                  onChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, ctaLabel: v } : s)))}
                />
                <TextField
                  label="Button Link"
                  value={slide.ctaHref}
                  onChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, ctaHref: v } : s)))}
                />
              </div>
              <ImageUploadField
                label="Slide Image"
                desktopValue={slide.imageDesktopUrl}
                onDesktopChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, imageDesktopUrl: v } : s)))}
                mobileValue={slide.imageMobileUrl}
                onMobileChange={(v) => setHeroSlides(heroSlides.map((s, idx) => (idx === i ? { ...s, imageMobileUrl: v } : s)))}
                desktopSize="1600 × 700px — leave room on the left for the text overlay"
                mobileSize="700 × 700px"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHeroSlides([...heroSlides, EMPTY_HERO_SLIDE])}
          className="flex items-center gap-1.5 self-start text-xs font-semibold text-brand-pink hover:underline"
        >
          <Plus size={13} /> Add slide
        </button>
      </SectionCard>

      <SectionCard id="stats-bar" title="Stats Bar" description="The 4 stat tiles shown just below the hero (exactly 4 recommended).">
        <RepeaterField
          label="Stats"
          items={stats}
          onChange={(items) => setStats(items as unknown as Stat[])}
          fields={[
            { key: "value", label: "Value (e.g. 3.2K+)" },
            { key: "label", label: "Label (e.g. Active Learners)" },
          ]}
          emptyItem={{ icon: "users", value: "", label: "" }}
          addLabel="Add stat"
        />
      </SectionCard>

      <SectionCard
        id="review-badges"
        title="Review Platform Badges"
        description="The Google / Capterra / G2 rating row below the stats. Upload each platform's official logo (from their press/brand page) — until you do, it falls back to plain text."
      >
        {reviewBadges.map((b, i) => (
          <div key={i} className="rounded-xl border border-brand-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <input
                value={b.label}
                onChange={(e) => setReviewBadges(reviewBadges.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r)))}
                placeholder="Platform (e.g. Google)"
                className="w-full rounded-lg border border-brand-border px-2.5 py-1.5 text-sm outline-none focus:border-brand-pink"
              />
              <input
                value={b.rating}
                onChange={(e) => setReviewBadges(reviewBadges.map((r, idx) => (idx === i ? { ...r, rating: e.target.value } : r)))}
                placeholder="Rating (e.g. ★★★★★ 4.6/5)"
                className="w-full rounded-lg border border-brand-border px-2.5 py-1.5 text-sm outline-none focus:border-brand-pink"
              />
              <button
                type="button"
                onClick={() => setReviewBadges(reviewBadges.filter((_, idx) => idx !== i))}
                aria-label="Remove"
                className="shrink-0 text-red-500 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <ImageUploadField
              label=""
              desktopValue={b.imageUrl}
              onDesktopChange={(v) => setReviewBadges(reviewBadges.map((r, idx) => (idx === i ? { ...r, imageUrl: v } : r)))}
              desktopSize="80 × 20px logo"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setReviewBadges([...reviewBadges, EMPTY_REVIEW_BADGE])}
          className="flex items-center gap-1.5 self-start text-xs font-semibold text-brand-pink hover:underline"
        >
          <Plus size={13} /> Add badge
        </button>
      </SectionCard>

      <SectionCard
        id="trust-logos"
        title="Trust Logos"
        description='The "As seen on" press logo row. Scrolls automatically in a loop on the homepage.'
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {trustLogos.map((logo, i) => (
            <div key={i} className="relative rounded-xl border border-brand-border p-3">
              <button
                type="button"
                onClick={() => setTrustLogos(trustLogos.filter((_, idx) => idx !== i))}
                aria-label="Remove"
                className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-card text-red-500 shadow hover:bg-red-50"
              >
                <Trash2 size={12} />
              </button>
              {logo.imageUrl ? (
                <div className="relative mb-2 h-12 w-full">
                  <Image src={logo.imageUrl} alt={logo.name} fill className="rounded-lg object-contain" unoptimized />
                </div>
              ) : (
                <div className="mb-2 flex h-12 items-center justify-center rounded-lg bg-brand-surface text-[10px] text-brand-muted">
                  No image
                </div>
              )}
              <input
                value={logo.name}
                onChange={(e) => setTrustLogos(trustLogos.map((l, idx) => (idx === i ? { ...l, name: e.target.value } : l)))}
                placeholder="Publication name"
                className="w-full rounded-lg border border-brand-border px-2 py-1 text-xs outline-none focus:border-brand-pink"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setLogoPickerOpen(true)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-xs font-semibold text-white hover:bg-brand-pink-dark"
          >
            <Plus size={13} /> Add Images From Media Library
          </button>
          <button
            type="button"
            onClick={handleTrimLogos}
            disabled={trimming}
            className="flex w-fit items-center gap-1.5 rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-surface disabled:opacity-60"
          >
            {trimming ? "Fixing sizes..." : "Fix Inconsistent Logo Sizes"}
          </button>
          {trimStatus && <p className="text-xs text-brand-muted">{trimStatus}</p>}
        </div>
        {logoPickerOpen && (
          <MediaMultiPickerModal
            onConfirm={(assets) => {
              setTrustLogos([
                ...trustLogos,
                ...assets.map((a) => ({ name: a.name ?? "", imageUrl: a.url })),
              ]);
              setLogoPickerOpen(false);
            }}
            onClose={() => setLogoPickerOpen(false)}
          />
        )}
      </SectionCard>

      <SectionCard id="tech-stack" title="Tech Stack Banner" description="The dark gradient banner with the app icon grid.">
        <TextField label="Eyebrow text" maxLength={40} value={techStack.eyebrow} onChange={(v) => setTechStack({ ...techStack, eyebrow: v })} />
        <TextField label="Title" maxLength={80} value={techStack.title} onChange={(v) => setTechStack({ ...techStack, title: v })} />
        <TextAreaField
          label="Description"
          rows={2}
          maxLength={200}
          value={techStack.description}
          onChange={(v) => setTechStack({ ...techStack, description: v })}
        />
        <TextField label="Button Label" maxLength={30} value={techStack.ctaLabel} onChange={(v) => setTechStack({ ...techStack, ctaLabel: v })} />
        <ImageUploadField
          label="Banner Image"
          desktopValue={techStack.imageUrl}
          onDesktopChange={(v) => setTechStack({ ...techStack, imageUrl: v })}
          desktopSize="1200 × 500px — leave room on the left for the text overlay"
        />
      </SectionCard>

      <SectionCard id="grow-skill" title="Grow Your Skill Section">
        <TextField label="Title" maxLength={80} value={growSkill.title} onChange={(v) => setGrowSkill({ ...growSkill, title: v })} />
        <TextAreaField
          label="Description"
          rows={3}
          maxLength={240}
          value={growSkill.description}
          onChange={(v) => setGrowSkill({ ...growSkill, description: v })}
        />
        <StringListField
          label="Checklist items"
          items={growSkill.checklist}
          onChange={(items) => setGrowSkill({ ...growSkill, checklist: items })}
        />
        <TextField label="Button Label" maxLength={30} value={growSkill.ctaLabel} onChange={(v) => setGrowSkill({ ...growSkill, ctaLabel: v })} />
        <ImageUploadField
          label="Image"
          desktopValue={growSkill.imageUrl}
          onDesktopChange={(v) => setGrowSkill({ ...growSkill, imageUrl: v })}
          desktopSize="700 × 700px (square)"
        />
      </SectionCard>

      <SectionCard id="random-promo" title="Random Promo Banner" description="The pink/amber gradient banner near the bottom.">
        <TextField label="Eyebrow text" maxLength={40} value={randomPromo.eyebrow} onChange={(v) => setRandomPromo({ ...randomPromo, eyebrow: v })} />
        <TextField label="Title" maxLength={80} value={randomPromo.title} onChange={(v) => setRandomPromo({ ...randomPromo, title: v })} />
        <TextAreaField
          label="Description"
          rows={2}
          maxLength={200}
          value={randomPromo.description}
          onChange={(v) => setRandomPromo({ ...randomPromo, description: v })}
        />
        <TextField label="Button Label" maxLength={30} value={randomPromo.ctaLabel} onChange={(v) => setRandomPromo({ ...randomPromo, ctaLabel: v })} />
        <ImageUploadField
          label="Banner Image"
          desktopValue={randomPromo.imageUrl}
          onDesktopChange={(v) => setRandomPromo({ ...randomPromo, imageUrl: v })}
          desktopSize="1200 × 500px — leave room on the left for the text overlay"
        />
      </SectionCard>

      <SectionCard id="cta-banner" title="Default CTA Banner" description='The "Join a course now to get 35% off" banner reused across many pages.'>
        <TextField label="Title" maxLength={80} value={ctaBanner.title} onChange={(v) => setCtaBanner({ ...ctaBanner, title: v })} />
        <TextAreaField
          label="Description"
          rows={2}
          maxLength={200}
          value={ctaBanner.description}
          onChange={(v) => setCtaBanner({ ...ctaBanner, description: v })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Button Label" maxLength={30} value={ctaBanner.ctaLabel} onChange={(v) => setCtaBanner({ ...ctaBanner, ctaLabel: v })} />
          <TextField label="Button Link" value={ctaBanner.href} onChange={(v) => setCtaBanner({ ...ctaBanner, href: v })} />
        </div>
        <ImageUploadField
          label="Banner Image"
          desktopValue={ctaBanner.imageUrl}
          onDesktopChange={(v) => setCtaBanner({ ...ctaBanner, imageUrl: v })}
          desktopSize="1200 × 400px — leave room on the left for the text overlay"
        />
      </SectionCard>

      <SectionCard
        id="trending-courses"
        title="Trending Courses"
        description="The section title and the large banner tile shown just below the tech stack banner. The banner is a plain image with its own text — it isn't tied to any course and never links anywhere. The 4 cards next to it are picked automatically from your top courses."
      >
        <TextField
          label="Section Title"
          maxLength={60}
          value={trendingCourses.title}
          onChange={(v) => setTrendingCourses({ ...trendingCourses, title: v })}
        />
        <TextField
          label="Banner Text"
          maxLength={80}
          value={trendingCourses.bannerText}
          onChange={(v) => setTrendingCourses({ ...trendingCourses, bannerText: v })}
        />
        <ImageUploadField
          label="Banner Image"
          desktopValue={trendingCourses.bannerImageUrl}
          onDesktopChange={(v) => setTrendingCourses({ ...trendingCourses, bannerImageUrl: v })}
          desktopSize="1280 × 720px (16:9)"
        />
      </SectionCard>

      <SaveBar onSave={handleSaveAll} saving={saving} status={status} label="Save All Changes" />
    </div>
  );
}
