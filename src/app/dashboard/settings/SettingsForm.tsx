"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import DateOfBirthSelect, { dobToIso, isoToDob, type DobValue } from "@/components/ui/DateOfBirthSelect";
import ChipMultiSelect from "@/components/ui/ChipMultiSelect";
import AvatarUploadField from "@/components/ui/AvatarUploadField";
import { isProfileComplete, getFullProfileCompletionPercent, MANDATORY_PROFILE_FIELDS } from "@/lib/profile";
import { isValidLinkedInUrl, LINKEDIN_URL_ERROR } from "@/lib/validators";
import {
  CURRENT_ROLE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  INTEREST_OPTIONS,
  LEARNING_GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  WEEKLY_COMMITMENT_OPTIONS,
  LANGUAGE_OPTIONS,
  PLAYBACK_SPEED_OPTIONS,
  THEME_OPTIONS,
  SOFTWARE_OPTIONS,
} from "@/lib/profileOptions";

export type SettingsInitial = {
  name: string;
  displayName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  currentRole: string;
  skillLevel: string;
  interests: string[];
  additionalInterests: string[];
  learningGoals: string[];
  yearsExperience: string;
  currentIndustry: string;
  currentCompany: string;
  learningStyle: string[];
  weeklyCommitment: string;
  preferredLanguage: string;
  subtitleLanguage: string;
  playbackSpeed: string;
  themePreference: string;
  softwareFamiliarity: string[];
  portfolioUrl: string;
  behanceUrl: string;
  dribbbleUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  timezone: string;
  country: string;
  isProfilePublic: boolean;
  showLearningActivity: boolean;
  showCompletedCourses: boolean;
  allowMessages: boolean;
  shareProjectsPublicly: boolean;
  followingEnabled: boolean;
  notifyWeeklyReminder: boolean;
  notifyNewCourses: boolean;
  notifyInstructorUpdates: boolean;
  notifyAssignmentDeadlines: boolean;
  notifyProductAnnouncements: boolean;
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex break-inside-avoid flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-brand-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function RequiredTag() {
  return <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">Required</span>;
}

function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div id={id}>
      <label className="mb-1.5 flex items-center text-sm font-semibold text-brand-ink">
        {label}
        {required && <RequiredTag />}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-brand-pink ${
          error ? "border-red-400" : "border-brand-border"
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  required,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div id={id}>
      <label className="mb-1.5 flex items-center text-sm font-semibold text-brand-ink">
        {label}
        {required && <RequiredTag />}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
      >
        <option value="">Not set</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-sm text-brand-ink">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brand-pink"
      />
    </label>
  );
}

function AdditionalInterestsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [raw, setRaw] = useState(value.join(", "));
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Additional Interests</label>
      <input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => onChange(raw.split(",").map((s) => s.trim()).filter(Boolean))}
        placeholder="e.g. Watercolor, Calligraphy, 3D Printing"
        className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      <p className="mt-1 text-xs text-brand-muted">Comma-separated. Anything beyond the list above.</p>
    </div>
  );
}

function RequirementsChecklist({
  items,
  onSelect,
}: {
  items: { key: string; label: string; done: boolean }[];
  onSelect: (key: string) => void;
}) {
  return (
    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.key}>
          <button
            type="button"
            onClick={() => onSelect(item.key)}
            className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left text-sm transition-colors hover:bg-brand-surface ${
              item.done ? "text-emerald-700" : "text-brand-muted"
            }`}
          >
            {item.done ? (
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
            ) : (
              <Circle size={15} className="shrink-0 text-brand-border" />
            )}
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

const SETTINGS_TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "learning", label: "Learning Profile" },
  { id: "portfolio", label: "Portfolio" },
  { id: "privacy", label: "Privacy & Notifications" },
] as const;

type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

const FIELD_TAB_MAP: Record<string, SettingsTabId> = {
  avatarUrl: "basic",
  name: "basic",
  displayName: "basic",
  location: "basic",
  phone: "basic",
  dateOfBirth: "basic",
  gender: "basic",
  linkedinUrl: "portfolio",
  timezone: "basic",
  country: "basic",
};

export default function SettingsForm({ initial }: { initial: SettingsInitial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [dob, setDob] = useState<DobValue>(isoToDob(initial.dateOfBirth));
  const [activeTab, setActiveTab] = useState<SettingsTabId>("basic");
  const [scrollTarget, setScrollTarget] = useState<{ key: string; nonce: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwStatus, setPwStatus] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  function set<K extends keyof SettingsInitial>(key: K, value: SettingsInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goToField(key: string) {
    setActiveTab(FIELD_TAB_MAP[key] ?? "basic");
    setScrollTarget({ key, nonce: Date.now() });
  }

  useEffect(() => {
    if (!scrollTarget) return;
    const el = document.getElementById(`field-${scrollTarget.key}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = el.matches("input, textarea, select") ? el : el.querySelector("input, textarea, select");
    (focusable as HTMLElement | null)?.focus({ preventScroll: true });
  }, [scrollTarget]);

  const profileForCheck = {
    name: form.name,
    displayName: form.displayName || null,
    avatarUrl: form.avatarUrl || null,
    location: form.location || null,
    phone: form.phone,
    gender: form.gender,
    dateOfBirth: dobToIso(dob) ? new Date(dobToIso(dob)!) : null,
    linkedinUrl: form.linkedinUrl || null,
    timezone: form.timezone || null,
    country: form.country || null,
  };

  const courseAccessComplete = isProfileComplete(profileForCheck);
  const requirementItems = MANDATORY_PROFILE_FIELDS.map((f) => ({ key: f.key, label: f.label, done: Boolean(profileForCheck[f.key]) }));

  const strength = getFullProfileCompletionPercent({
    ...profileForCheck,
    bio: form.bio || null,
    currentRole: form.currentRole || null,
    skillLevel: form.skillLevel || null,
    interestsJson: JSON.stringify(form.interests),
    learningGoalsJson: JSON.stringify(form.learningGoals),
    weeklyCommitment: form.weeklyCommitment || null,
    preferredLanguage: form.preferredLanguage || null,
    yearsExperience: form.yearsExperience || null,
    learningStyleJson: JSON.stringify(form.learningStyle),
  });

  const linkedinError = form.linkedinUrl.trim() && !isValidLinkedInUrl(form.linkedinUrl) ? LINKEDIN_URL_ERROR : "";

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setError("");
    if (linkedinError) {
      setError(linkedinError);
      return;
    }
    setSaving(true);
    const res = await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        displayName: form.displayName,
        bio: form.bio,
        location: form.location,
        phone: form.phone ?? "",
        gender: form.gender ?? "",
        dateOfBirth: dobToIso(dob),
        currentRole: form.currentRole,
        skillLevel: form.skillLevel,
        interests: form.interests,
        additionalInterests: form.additionalInterests,
        learningGoals: form.learningGoals,
        yearsExperience: form.yearsExperience,
        currentIndustry: form.currentIndustry,
        currentCompany: form.currentCompany,
        learningStyle: form.learningStyle,
        weeklyCommitment: form.weeklyCommitment,
        preferredLanguage: form.preferredLanguage,
        subtitleLanguage: form.subtitleLanguage,
        playbackSpeed: form.playbackSpeed,
        themePreference: form.themePreference,
        softwareFamiliarity: form.softwareFamiliarity,
        portfolioUrl: form.portfolioUrl,
        behanceUrl: form.behanceUrl,
        dribbbleUrl: form.dribbbleUrl,
        githubUrl: form.githubUrl,
        linkedinUrl: form.linkedinUrl,
        timezone: form.timezone,
        country: form.country,
        isProfilePublic: form.isProfilePublic,
        showLearningActivity: form.showLearningActivity,
        showCompletedCourses: form.showCompletedCourses,
        allowMessages: form.allowMessages,
        shareProjectsPublicly: form.shareProjectsPublicly,
        followingEnabled: form.followingEnabled,
        notifyWeeklyReminder: form.notifyWeeklyReminder,
        notifyNewCourses: form.notifyNewCourses,
        notifyInstructorUpdates: form.notifyInstructorUpdates,
        notifyAssignmentDeadlines: form.notifyAssignmentDeadlines,
        notifyProductAnnouncements: form.notifyProductAnnouncements,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      return;
    }
    setStatus("Saved!");
    router.refresh();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwStatus("");
    setPwSaving(true);
    const res = await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (!res.ok) {
      setPwError(data.error ?? "Failed to update password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setPwStatus("Password updated.");
  }

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Profile Strength</h3>
          <span className="text-sm font-bold text-brand-pink">{strength}%</span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-brand-surface">
          <div className="h-full rounded-full bg-brand-pink transition-all" style={{ width: `${strength}%` }} />
        </div>
        <p className="mt-2 text-xs text-brand-muted">
          A fuller profile means better course recommendations. Fill in the sections below whenever you have time.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Course Access Requirements</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              courseAccessComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {courseAccessComplete ? "Complete" : "Incomplete"}
          </span>
        </div>
        <p className="mt-1 mb-3 text-xs text-brand-muted">
          All fields below are required before you can attend a course you&apos;re enrolled in.
        </p>
        <RequirementsChecklist items={requirementItems} onSelect={goToField} />
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-brand-border bg-white p-1.5">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? "bg-brand-pink text-white" : "text-brand-ink/70 hover:bg-brand-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveProfile}>
        {activeTab === "basic" && (
          <div className="lg:columns-2 lg:gap-6">
            <Card title="Basic Information">
              <div id="field-avatarUrl">
                <p className="mb-1.5 flex items-center text-sm font-semibold text-brand-ink">
                  Profile Photo
                  <RequiredTag />
                </p>
                <AvatarUploadField value={form.avatarUrl} onChange={(url) => set("avatarUrl", url)} fallbackLabel={form.displayName || form.name} />
              </div>
              <TextInput id="field-name" label="Full Name" value={form.name} onChange={(v) => set("name", v)} required />
              <TextInput id="field-displayName" label="Display Name" value={form.displayName} onChange={(v) => set("displayName", v)} required />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Short Bio (optional)</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
                />
              </div>
              <TextInput id="field-location" label="Location" value={form.location} onChange={(v) => set("location", v)} placeholder="e.g. Mumbai, India" required />
            </Card>

            <Card title="Contact Details">
              <TextInput id="field-phone" label="Phone Number" value={form.phone ?? ""} onChange={(v) => set("phone", v)} required />
              <div id="field-gender">
                <p className="mb-1.5 flex items-center text-sm font-semibold text-brand-ink">
                  Gender
                  <RequiredTag />
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Female", "Male", "Non-binary"].map((g) => (
                    <label key={g} className="flex items-center gap-1.5 text-sm text-brand-ink">
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => set("gender", g)} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              <div id="field-dateOfBirth">
                <p className="mb-1.5 flex items-center text-sm font-semibold text-brand-ink">
                  Date of Birth
                  <RequiredTag />
                </p>
                <DateOfBirthSelect value={dob} onChange={setDob} />
              </div>
            </Card>

            <Card title="Account">
              <TextInput id="field-timezone" label="Time Zone" value={form.timezone} onChange={(v) => set("timezone", v)} placeholder="e.g. Asia/Kolkata" required />
              <TextInput id="field-country" label="Country" value={form.country} onChange={(v) => set("country", v)} placeholder="e.g. India" required />
            </Card>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="lg:columns-2 lg:gap-6">
            <Card title="Learning Interests">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-brand-ink">Primary Interests</p>
                <ChipMultiSelect options={INTEREST_OPTIONS} value={form.interests} onChange={(v) => set("interests", v)} />
              </div>
              <AdditionalInterestsInput value={form.additionalInterests} onChange={(v) => set("additionalInterests", v)} />
            </Card>

            <Card title="Skill Level & Role">
              <SelectInput label="Skill Level" value={form.skillLevel} onChange={(v) => set("skillLevel", v)} options={SKILL_LEVEL_OPTIONS} />
              <SelectInput label="Current Role" value={form.currentRole} onChange={(v) => set("currentRole", v)} options={CURRENT_ROLE_OPTIONS} />
            </Card>

            <Card title="Learning Goals">
              <p className="mb-1.5 text-sm font-semibold text-brand-ink">What are you here to do?</p>
              <ChipMultiSelect options={LEARNING_GOAL_OPTIONS} value={form.learningGoals} onChange={(v) => set("learningGoals", v)} />
            </Card>

            <Card title="Experience">
              <SelectInput label="Years of Experience" value={form.yearsExperience} onChange={(v) => set("yearsExperience", v)} options={EXPERIENCE_OPTIONS} />
              <TextInput label="Current Industry" value={form.currentIndustry} onChange={(v) => set("currentIndustry", v)} />
              <TextInput label="Current Company (optional)" value={form.currentCompany} onChange={(v) => set("currentCompany", v)} />
            </Card>

            <Card title="Preferred Learning Style">
              <ChipMultiSelect options={LEARNING_STYLE_OPTIONS} value={form.learningStyle} onChange={(v) => set("learningStyle", v)} />
            </Card>

            <Card title="Weekly Commitment">
              <SelectInput label="How much time can you give each week?" value={form.weeklyCommitment} onChange={(v) => set("weeklyCommitment", v)} options={WEEKLY_COMMITMENT_OPTIONS} />
            </Card>

            <Card title="Learning Preferences">
              <SelectInput label="Preferred Language" value={form.preferredLanguage} onChange={(v) => set("preferredLanguage", v)} options={LANGUAGE_OPTIONS} />
              <SelectInput label="Subtitle Language" value={form.subtitleLanguage} onChange={(v) => set("subtitleLanguage", v)} options={LANGUAGE_OPTIONS} />
              <SelectInput label="Playback Speed (default)" value={form.playbackSpeed} onChange={(v) => set("playbackSpeed", v)} options={PLAYBACK_SPEED_OPTIONS} />
              <SelectInput label="Theme" value={form.themePreference} onChange={(v) => set("themePreference", v)} options={THEME_OPTIONS} />
            </Card>

            <Card title="Software Familiarity">
              <ChipMultiSelect options={SOFTWARE_OPTIONS} value={form.softwareFamiliarity} onChange={(v) => set("softwareFamiliarity", v)} />
            </Card>
          </div>
        )}

        {activeTab === "portfolio" && (
          <Card title="Portfolio & Showcase" subtitle="LinkedIn is required before you can attend a course; the rest are optional.">
            <TextInput
              id="field-linkedinUrl"
              label="LinkedIn"
              value={form.linkedinUrl}
              onChange={(v) => set("linkedinUrl", v)}
              placeholder="https://linkedin.com/in/..."
              required
              error={linkedinError}
            />
            <TextInput label="Portfolio Website" value={form.portfolioUrl} onChange={(v) => set("portfolioUrl", v)} placeholder="https://" />
            <TextInput label="Behance" value={form.behanceUrl} onChange={(v) => set("behanceUrl", v)} placeholder="https://behance.net/..." />
            <TextInput label="Dribbble" value={form.dribbbleUrl} onChange={(v) => set("dribbbleUrl", v)} placeholder="https://dribbble.com/..." />
            <TextInput label="GitHub" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} placeholder="https://github.com/..." />
          </Card>
        )}

        {activeTab === "privacy" && (
          <div className="lg:columns-2 lg:gap-6">
            <Card title="Privacy & Social">
              <Toggle label="Make profile public" checked={form.isProfilePublic} onChange={(v) => set("isProfilePublic", v)} />
              <Toggle label="Show learning activity" checked={form.showLearningActivity} onChange={(v) => set("showLearningActivity", v)} />
              <Toggle label="Show completed courses" checked={form.showCompletedCourses} onChange={(v) => set("showCompletedCourses", v)} />
              <Toggle label="Allow messages" checked={form.allowMessages} onChange={(v) => set("allowMessages", v)} />
              <Toggle label="Share projects publicly" checked={form.shareProjectsPublicly} onChange={(v) => set("shareProjectsPublicly", v)} />
              <Toggle label="Allow following (students & instructors)" checked={form.followingEnabled} onChange={(v) => set("followingEnabled", v)} />
              <p className="text-xs text-brand-muted">Public profiles and following are coming soon — these preferences will take effect once that launches.</p>
            </Card>

            <Card title="Notifications">
              <Toggle label="Weekly learning reminder" checked={form.notifyWeeklyReminder} onChange={(v) => set("notifyWeeklyReminder", v)} />
              <Toggle label="New course alerts" checked={form.notifyNewCourses} onChange={(v) => set("notifyNewCourses", v)} />
              <Toggle label="Instructor updates" checked={form.notifyInstructorUpdates} onChange={(v) => set("notifyInstructorUpdates", v)} />
              <Toggle label="Assignment deadlines" checked={form.notifyAssignmentDeadlines} onChange={(v) => set("notifyAssignmentDeadlines", v)} />
              <Toggle label="Product announcements" checked={form.notifyProductAnnouncements} onChange={(v) => set("notifyProductAnnouncements", v)} />
              <p className="text-xs text-brand-muted">Email delivery is coming soon — these preferences are saved for when it launches.</p>
            </Card>
          </div>
        )}

        {status && <p className="mt-6 text-sm font-medium text-emerald-600">{status}</p>}
        {error && <p className="mt-6 text-sm font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-pink/30 hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="flex max-w-xl flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Change Password</h3>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
          <p className="mt-1 text-xs text-brand-muted">At least 8 characters.</p>
        </div>
        {pwError && <p className="text-xs font-medium text-red-500">{pwError}</p>}
        {pwStatus && <p className="text-xs font-medium text-emerald-600">{pwStatus}</p>}
        <button
          type="submit"
          disabled={pwSaving}
          className="self-start rounded-full border border-brand-ink/20 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface disabled:opacity-60"
        >
          {pwSaving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
