"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialAuthButtons from "./SocialAuthButtons";
import DateOfBirthSelect, { dobToIso, type DobValue } from "./DateOfBirthSelect";
import ChipMultiSelect from "./ChipMultiSelect";
import AvatarUploadField from "./AvatarUploadField";
import { setLastUser } from "@/lib/lastUserCookie";
import {
  CURRENT_ROLE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  INTEREST_OPTIONS,
  LEARNING_GOAL_OPTIONS,
  WEEKLY_COMMITMENT_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/profileOptions";

function ProgressDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {[1, 2].map((n) => (
        <span key={n} className={`h-1.5 rounded-full transition-all ${step === n ? "w-6 bg-brand-pink" : "w-1.5 bg-brand-border"}`} />
      ))}
    </div>
  );
}

function AccountStep({ onCreated }: { onCreated: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [notRobot, setNotRobot] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy to continue.");
      return;
    }
    if (!notRobot) {
      setError("Please confirm you're not a robot.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    setLastUser(name, email);
    onCreated(name, email);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <SocialAuthButtons />
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-brand-border" />
        <span className="text-xs font-medium text-brand-muted">OR</span>
        <span className="h-px flex-1 bg-brand-border" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
          <p className="mt-1 text-xs text-brand-muted">At least 8 characters.</p>
        </div>

        <label className="flex items-start gap-2 text-xs text-brand-muted">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
          I agree to the{" "}
          <Link href="/terms" className="font-semibold text-brand-pink hover:underline">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy-policy" className="font-semibold text-brand-pink hover:underline">
            Privacy Policy
          </Link>
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-ink">
          <input type="checkbox" checked={notRobot} onChange={(e) => setNotRobot(e.target.checked)} />
          I&apos;m not a robot
        </label>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-pink hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfileStep({ name }: { name: string }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState(name);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<DobValue>({ day: "", month: "", year: "" });
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [timezone, setTimezone] = useState("");
  const [country, setCountry] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [learningGoal, setLearningGoal] = useState("");
  const [weeklyCommitment, setWeeklyCommitment] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [saving, setSaving] = useState(false);

  function goToDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSave() {
    setSaving(true);
    const dateOfBirth = dobToIso(dob);
    await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: displayName || undefined,
        location: location || undefined,
        phone: phone || undefined,
        gender: gender || undefined,
        dateOfBirth,
        linkedinUrl: linkedinUrl || undefined,
        timezone: timezone || undefined,
        country: country || undefined,
        currentRole: currentRole || undefined,
        skillLevel: skillLevel || undefined,
        interests: interests.length ? interests : undefined,
        learningGoals: learningGoal ? [learningGoal] : undefined,
        weeklyCommitment: weeklyCommitment || undefined,
        preferredLanguage: preferredLanguage || undefined,
      }),
    });
    setSaving(false);
    goToDashboard();
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="mb-5 text-center text-sm text-brand-muted">
        Add these now, or skip and finish your profile later in Settings — the fields below are needed before you
        can attend a course.
      </p>
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-1.5 text-sm font-semibold text-brand-ink">Profile Photo</p>
          <AvatarUploadField value={avatarUrl} onChange={setAvatarUrl} fallbackLabel={name} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Mumbai, India"
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-brand-ink">Gender</p>
          <div className="flex flex-wrap gap-4">
            {["Female", "Male", "Non-binary"].map((g) => (
              <label key={g} className="flex items-center gap-1.5 text-sm text-brand-ink">
                <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-brand-ink">Date of Birth</p>
          <DateOfBirthSelect value={dob} onChange={setDob} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">LinkedIn</label>
          <input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Time Zone</label>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. Asia/Kolkata"
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. India"
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div className="border-t border-brand-border pt-5">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-brand-muted">Personalize your learning (optional)</p>
        </div>

        <SelectRow label="Current Role" value={currentRole} onChange={setCurrentRole} options={CURRENT_ROLE_OPTIONS} />
        <SelectRow label="Skill Level" value={skillLevel} onChange={setSkillLevel} options={SKILL_LEVEL_OPTIONS} />

        <div>
          <p className="mb-1.5 text-sm font-semibold text-brand-ink">Learning Interests</p>
          <ChipMultiSelect options={INTEREST_OPTIONS} value={interests} onChange={setInterests} />
        </div>

        <SelectRow label="Learning Goal" value={learningGoal} onChange={setLearningGoal} options={LEARNING_GOAL_OPTIONS} />
        <SelectRow label="Weekly Commitment" value={weeklyCommitment} onChange={setWeeklyCommitment} options={WEEKLY_COMMITMENT_OPTIONS} />
        <SelectRow label="Preferred Language" value={preferredLanguage} onChange={setPreferredLanguage} options={LANGUAGE_OPTIONS} />

        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
          <button
            type="button"
            onClick={goToDashboard}
            className="rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [createdName, setCreatedName] = useState("");

  function handleCreated(name: string) {
    setCreatedName(name);
    setStep(2);
  }

  return (
    <div>
      <ProgressDots step={step} />
      {step === 1 ? <AccountStep onCreated={handleCreated} /> : <ProfileStep name={createdName} />}
    </div>
  );
}
