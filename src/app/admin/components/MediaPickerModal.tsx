"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, FolderClosed, FolderPlus } from "lucide-react";

type Folder = { id: string; name: string; _count: { assets: number } };
type Asset = { id: string; url: string; name: string | null; altText: string | null };

export default function MediaPickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const loading = assets === null;

  function refreshFolders() {
    fetch("/api/admin/media/folders")
      .then((r) => r.json())
      .then(setFolders);
  }

  useEffect(refreshFolders, []);

  async function handleCreateFolder() {
    const name = prompt("Folder name:");
    if (!name || !name.trim()) return;
    const res = await fetch("/api/admin/media/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshFolders();
  }

  useEffect(() => {
    const qs = activeFolder === "all" ? "" : `?folderId=${activeFolder}`;
    fetch(`/api/admin/media${qs}`)
      .then((r) => r.json())
      .then(setAssets);
  }, [activeFolder]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-brand-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h3 className="text-base font-bold text-brand-ink">Select from Media Library</h3>
          <button type="button" onClick={onClose} className="text-brand-muted hover:text-brand-ink">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 shrink-0 overflow-y-auto border-r border-brand-border p-3">
            <button
              type="button"
              onClick={() => setActiveFolder("all")}
              className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                activeFolder === "all" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
              }`}
            >
              All Images
            </button>
            <button
              type="button"
              onClick={() => setActiveFolder("uncategorized")}
              className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                activeFolder === "uncategorized" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
              }`}
            >
              Uncategorized
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                  activeFolder === f.id ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
                }`}
              >
                <FolderClosed size={12} className="shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="ml-auto shrink-0 text-[10px] text-brand-muted">{f._count.assets}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleCreateFolder}
              className="mt-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-brand-pink hover:bg-brand-surface"
            >
              <FolderPlus size={12} /> New folder
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="py-10 text-center text-sm text-brand-muted">Loading...</p>
            ) : assets.length === 0 ? (
              <p className="py-10 text-center text-sm text-brand-muted">No images in this folder yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelect(a.url)}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-brand-border hover:border-brand-pink"
                  >
                    <Image src={a.url} alt={a.altText ?? a.name ?? ""} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
