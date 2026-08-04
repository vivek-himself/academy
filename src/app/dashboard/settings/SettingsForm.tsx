"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [nameStatus, setNameStatus] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwStatus, setPwStatus] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameStatus("");
    const res = await fetch("/api/dashboard/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setNameSaving(false);
    if (res.ok) {
      setNameStatus("Saved!");
      router.refresh();
    } else {
      setNameStatus("Failed to save.");
    }
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
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSaveName} className="flex max-w-sm flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">Profile</h3>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        {nameStatus && <p className="text-xs font-medium text-emerald-600">{nameStatus}</p>}
        <button
          type="submit"
          disabled={nameSaving}
          className="self-start rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {nameSaving ? "Saving..." : "Save Name"}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="flex max-w-sm flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6">
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
