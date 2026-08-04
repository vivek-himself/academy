"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FolderClosed, FolderPlus, Upload, Loader2, Pencil, Trash2 } from "lucide-react";

type Folder = { id: string; name: string; _count: { assets: number } };
type Asset = {
  id: string;
  url: string;
  name: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ initialFolders }: { initialFolders: Folder[] }) {
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = assets === null;

  function refreshFolders() {
    fetch("/api/admin/media/folders")
      .then((r) => r.json())
      .then(setFolders);
  }

  function refreshAssets() {
    const qs = activeFolder === "all" ? "" : `?folderId=${activeFolder}`;
    fetch(`/api/admin/media${qs}`)
      .then((r) => r.json())
      .then(setAssets);
  }

  useEffect(() => {
    refreshAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFolder]);

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

  async function handleRenameFolder(folder: Folder) {
    const name = prompt("Rename folder:", folder.name);
    if (!name || !name.trim() || name === folder.name) return;
    const res = await fetch(`/api/admin/media/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshFolders();
  }

  async function handleDeleteFolder(folder: Folder) {
    if (!confirm(`Delete folder "${folder.name}"? Images inside will move to Uncategorized, not be deleted.`)) return;
    const res = await fetch(`/api/admin/media/folders/${folder.id}`, { method: "DELETE" });
    if (res.ok) {
      refreshFolders();
      if (activeFolder === folder.id) setActiveFolder("all");
      else refreshAssets();
    }
  }

  async function handleUpload(files: FileList | File[]) {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        if (activeFolder !== "all" && activeFolder !== "uncategorized") {
          formData.append("folderId", activeFolder);
        }
        await fetch("/api/admin/upload", { method: "POST", body: formData });
      }
      refreshAssets();
      refreshFolders();
    } finally {
      setUploading(false);
    }
  }

  async function handleRenameAsset(asset: Asset) {
    const name = prompt("Rename image:", asset.name ?? asset.url.split("/").pop() ?? "");
    if (!name || !name.trim()) return;
    const res = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshAssets();
  }

  async function handleMoveAsset(asset: Asset, folderId: string) {
    const res = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: folderId === "uncategorized" ? null : folderId }),
    });
    if (res.ok) {
      refreshFolders();
      refreshAssets();
    }
  }

  async function handleDeleteAsset(asset: Asset) {
    if (!confirm("Delete this image permanently? This can't be undone, and it may still be referenced elsewhere on your site.")) return;
    const res = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
    if (res.ok) {
      refreshAssets();
      refreshFolders();
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="w-full shrink-0 sm:w-52">
        <div className="rounded-2xl border border-brand-border bg-white p-3">
          <button
            type="button"
            onClick={() => setActiveFolder("all")}
            className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
              activeFolder === "all" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-ink hover:bg-brand-surface"
            }`}
          >
            All Images
          </button>
          <button
            type="button"
            onClick={() => setActiveFolder("uncategorized")}
            className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
              activeFolder === "uncategorized" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-ink hover:bg-brand-surface"
            }`}
          >
            Uncategorized
          </button>
          {folders.map((f) => (
            <div
              key={f.id}
              className={`group mb-1 flex items-center gap-1 rounded-lg px-1 ${
                activeFolder === f.id ? "bg-brand-pink/10" : "hover:bg-brand-surface"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`flex flex-1 items-center gap-1.5 py-2 pl-2 text-left text-sm font-medium ${
                  activeFolder === f.id ? "text-brand-pink" : "text-brand-ink"
                }`}
              >
                <FolderClosed size={14} className="shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-brand-muted">({f._count.assets})</span>
              </button>
              <button
                type="button"
                onClick={() => handleRenameFolder(f)}
                aria-label="Rename folder"
                className="shrink-0 p-1 text-brand-muted opacity-0 hover:text-brand-ink group-hover:opacity-100"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteFolder(f)}
                aria-label="Delete folder"
                className="shrink-0 p-1 text-brand-muted opacity-0 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleCreateFolder}
            className="mt-1 flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-pink hover:bg-brand-surface"
          >
            <FolderPlus size={14} /> New folder
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4 flex justify-end">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) handleUpload(files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading..." : "Upload images"}
          </button>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">Loading...</p>
        ) : assets.length === 0 ? (
          <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
            No images in this folder yet. Upload one, or move existing images here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-xl border border-brand-border bg-white">
                <div className="relative aspect-square w-full bg-brand-surface">
                  <Image src={a.url} alt={a.name ?? ""} fill className="object-cover" unoptimized />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-brand-ink" title={a.name ?? a.url}>
                    {a.name ?? a.url.split("/").pop()}
                  </p>
                  <p className="text-[10px] text-brand-muted">
                    {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                    {formatSize(a.sizeBytes)}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <select
                      value={activeFolder === "uncategorized" ? "uncategorized" : activeFolder === "all" ? "" : activeFolder}
                      onChange={(e) => e.target.value && handleMoveAsset(a, e.target.value)}
                      className="w-full max-w-[90px] truncate rounded border border-brand-border px-1 py-0.5 text-[10px] text-brand-muted outline-none"
                    >
                      <option value="">Move to...</option>
                      <option value="uncategorized">Uncategorized</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRenameAsset(a)}
                      aria-label="Rename"
                      className="shrink-0 text-brand-muted hover:text-brand-ink"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(a)}
                      aria-label="Delete"
                      className="shrink-0 text-brand-muted hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
