"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField } from "../../components/FormField";
import ImageUploadField from "../../components/ImageUploadField";
import StringListField from "../../components/StringListField";
import RepeaterField from "../../components/RepeaterField";

type HeroSlide = { title: string; subtitle: string; ctaLabel: string; ctaHref: string; imageDesktopUrl: string; imageMobileUrl: string };
type Stat = { icon: string; value: string; label: string };
type TrustLogo = { name: string; imageUrl: string };
type EyebrowBlock = { eyebrow: string; title: string; description: string; ctaLabel: string };
type GrowSkill = { title: string; description: string; checklist: string[]; ctaLabel: string; imageUrl: string };
type CtaBanner = { title: string; description: string; ctaLabel: string; href: string };

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6">
      <h3 className="text-base font-bold text-brand-ink">{title}</h3>
      {description && <p className="mt-1 text-xs text-brand-muted">{description}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default function HomepageEditor({
  heroSlide: initHero,
  stats: initStats,
  trustLogos: initTrustLogos,
  techStack: initTechStack,
  growSkill: initGrowSkill,
  randomPromo: initRandomPromo,
  ctaBanner: initCtaBanner,
}: {
  heroSlide: HeroSlide;
  stats: Stat[];
  trustLogos: TrustLogo[];
  techStack: EyebrowBlock;
  growSkill: GrowSkill;
  randomPromo: EyebrowBlock;
  ctaBanner: CtaBanner;
}) {
  const router = useRouter();
  const [heroSlide, setHeroSlide] = useState(initHero);
  const [stats, setStats] = useState(initStats);
  const [trustLogos, setTrustLogos] = useState(initTrustLogos);
  const [techStack, setTechStack] = useState(initTechStack);
  const [growSkill, setGrowSkill] = useState(initGrowSkill);
  const [randomPromo, setRandomPromo] = useState(initRandomPromo);
  const [ctaBanner, setCtaBanner] = useState(initCtaBanner);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSaveAll() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroSlide,
        stats,
        trustLogos,
        blocks: {
          home_tech_stack: JSON.stringify(techStack),
          home_grow_skill: JSON.stringify(growSkill),
          home_random_promo: JSON.stringify(randomPromo),
          cta_banner_default: JSON.stringify(ctaBanner),
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
      <SectionCard title="Hero Banner" description="The large purple banner at the top of the homepage.">
        <TextField label="Title" maxLength={80} value={heroSlide.title} onChange={(v) => setHeroSlide({ ...heroSlide, title: v })} />
        <TextAreaField
          label="Subtitle"
          rows={2}
          maxLength={160}
          value={heroSlide.subtitle}
          onChange={(v) => setHeroSlide({ ...heroSlide, subtitle: v })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Button Label" maxLength={30} value={heroSlide.ctaLabel} onChange={(v) => setHeroSlide({ ...heroSlide, ctaLabel: v })} />
          <TextField label="Button Link" value={heroSlide.ctaHref} onChange={(v) => setHeroSlide({ ...heroSlide, ctaHref: v })} />
        </div>
        <ImageUploadField
          label="Hero Image"
          desktopValue={heroSlide.imageDesktopUrl}
          onDesktopChange={(v) => setHeroSlide({ ...heroSlide, imageDesktopUrl: v })}
          mobileValue={heroSlide.imageMobileUrl}
          onMobileChange={(v) => setHeroSlide({ ...heroSlide, imageMobileUrl: v })}
          desktopSize="900 × 560px"
          mobileSize="700 × 700px"
        />
      </SectionCard>

      <SectionCard title="Stats Bar" description="The 4 stat tiles shown just below the hero (exactly 4 recommended).">
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

      <SectionCard title="Trust Logos" description='The "As seen on" press logo row.'>
        <RepeaterField
          label="Logos"
          items={trustLogos}
          onChange={(items) => setTrustLogos(items as unknown as TrustLogo[])}
          fields={[{ key: "name", label: "Publication name" }]}
          emptyItem={{ name: "", imageUrl: "" }}
          addLabel="Add logo"
        />
      </SectionCard>

      <SectionCard title="Tech Stack Banner" description="The dark gradient banner with the app icon grid.">
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
      </SectionCard>

      <SectionCard title="Grow Your Skill Section">
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

      <SectionCard title="Random Promo Banner" description="The pink/amber gradient banner near the bottom.">
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
      </SectionCard>

      <SectionCard title="Default CTA Banner" description='The "Join a course now to get 35% off" banner reused across many pages.'>
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
      </SectionCard>

      {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
      <div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
