"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { TextField, TextAreaField } from "../../components/FormField";
import { SOCIAL_PLATFORMS, type SocialLinksMap } from "@/lib/socialLinks";
import ThemeToggle from "../../components/ThemeToggle";

type Settings = {
  siteName: string;
  tagline: string;
  promoBarText: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  socialLinks: SocialLinksMap;
};

export default function SettingsEditor({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState("");

  function set<K extends keyof Settings>(key: K, v: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: v }));
  }

  function setSocialUrl(key: keyof SocialLinksMap, url: string) {
    setSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: { ...prev.socialLinks[key], url } } }));
  }

  function toggleSocialHidden(key: keyof SocialLinksMap) {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: { ...prev.socialLinks[key], hidden: !prev.socialLinks[key].hidden } },
    }));
  }

  async function handleSaveSettings() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteName: settings.siteName,
        tagline: settings.tagline,
        promoBarText: settings.promoBarText,
        defaultSeoTitle: settings.defaultSeoTitle,
        defaultSeoDescription: settings.defaultSeoDescription,
        socialLinksJson: JSON.stringify(settings.socialLinks),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("Failed to save.");
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
    const res = await fetch("/api/admin/account", {
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Appearance</h3>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Site Identity</h3>
        <TextField label="Site Name" maxLength={40} value={settings.siteName} onChange={(v) => set("siteName", v)} />
        <TextField label="Tagline" maxLength={80} value={settings.tagline} onChange={(v) => set("tagline", v)} />
        <TextField
          label="Promo Bar Text"
          maxLength={100}
          description="The scrolling announcement bar at the very top of every page."
          value={settings.promoBarText}
          onChange={(v) => set("promoBarText", v)}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-card p-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Social Media Links</h3>
          <p className="mt-1 text-xs text-brand-muted">
            Add the URL for each platform you use. Hide any platform you don&apos;t want shown in the site footer — it stays saved, just not displayed.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-brand-border">
          {SOCIAL_PLATFORMS.map(({ key, label, placeholder, icon: Icon }) => {
            const link = settings.socialLinks[key];
            return (
              <div key={key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-ink">
                  <Icon size={16} />
                </span>
                <div className="w-28 shrink-0 text-sm font-semibold text-brand-ink">{label}</div>
                <input
                  value={link.url}
                  onChange={(e) => setSocialUrl(key, e.target.value)}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 rounded-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-pink"
                />
                <button
                  type="button"
                  onClick={() => toggleSocialHidden(key)}
                  aria-pressed={!link.hidden}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    link.hidden
                      ? "border-brand-border text-brand-muted hover:bg-brand-surface"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {link.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                  {link.hidden ? "Hidden" : "Visible"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Default SEO</h3>
        <TextField
          label="Default SEO Title"
          maxLength={60}
          description="Used on pages that don't define their own SEO title."
          value={settings.defaultSeoTitle}
          onChange={(v) => set("defaultSeoTitle", v)}
        />
        <TextAreaField
          label="Default SEO Description"
          rows={2}
          maxLength={160}
          value={settings.defaultSeoDescription}
          onChange={(v) => set("defaultSeoDescription", v)}
        />
      </div>

      {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
      <div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <form onSubmit={handleChangePassword} className="flex max-w-sm flex-col gap-4 rounded-2xl border border-brand-border bg-brand-card p-6">
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
          className="rounded-full border border-brand-ink/20 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface disabled:opacity-60"
        >
          {pwSaving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
