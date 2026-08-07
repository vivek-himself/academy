"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import SocialAuthButtons from "./SocialAuthButtons";
import AuthModalShell from "./AuthModalShell";
import DateOfBirthSelect, { dobToIso, type DobValue } from "./DateOfBirthSelect";
import ChipMultiSelect from "./ChipMultiSelect";
import AvatarUploadField from "./AvatarUploadField";
import { setLastUser } from "@/lib/lastUserCookie";
import { isValidLinkedInUrl, LINKEDIN_URL_ERROR } from "@/lib/validators";
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

function deriveNameFromEmail(email: string) {
  const local = email.split("@")[0]?.trim() || "Student";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function AccountStep({ onCreated }: { onCreated: (name: string, email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = deriveNameFromEmail(email);
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
    <div className="grid grid-cols-1 gap-8 px-8 pb-8 pt-6 sm:grid-cols-2 sm:divide-x sm:divide-brand-border">
      <div className="sm:pr-8">
        <div className="flex flex-col gap-3">
          <SocialAuthButtons label="Sign up with Google" />
        </div>
        <p className="mt-4 text-center text-sm text-brand-muted">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-pink hover:underline">
            Log in
          </Link>
        </p>
        <p className="mt-4 text-xs text-brand-muted">
          By signing up, you agree to the{" "}
          <Link href="/terms" className="font-semibold text-brand-ink underline hover:text-brand-pink">
            Terms of Service
          </Link>{" "}
          and acknowledge you&apos;ve read our{" "}
          <Link href="/privacy-policy" className="font-semibold text-brand-ink underline hover:text-brand-pink">
            Privacy Policy.
          </Link>
        </p>
      </div>

      <div className="sm:pl-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Sign up</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-ink">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-brand-ink">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-brand-ink"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
            />
            <p className="mt-1 text-xs text-brand-muted">Use 8 or more characters with a mix of letters, numbers &amp; symbols.</p>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
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
  const [error, setError] = useState("");

  const linkedinError = linkedinUrl.trim() && !isValidLinkedInUrl(linkedinUrl) ? LINKEDIN_URL_ERROR : "";

  function goToDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSave() {
    setError("");
    if (linkedinError) {
      setError(linkedinError);
      return;
    }
    setSaving(true);
    const dateOfBirth = dobToIso(dob);
    const res = await fetch("/api/dashboard/account", {
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
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    goToDashboard();
  }

  return (
    <div className="mx-auto w-full max-w-sm px-8 pb-8 pt-2">
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
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-brand-pink ${
              linkedinError ? "border-red-400" : "border-brand-border"
            }`}
          />
          {linkedinError && <p className="mt-1 text-xs font-medium text-red-500">{linkedinError}</p>}
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

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

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
    <AuthModalShell subtitle="Sign up for free to see our courses">
      <ProgressDots step={step} />
      {step === 1 ? <AccountStep onCreated={handleCreated} /> : <ProfileStep name={createdName} />}
    </AuthModalShell>
  );
}
