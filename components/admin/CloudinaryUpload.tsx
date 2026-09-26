"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  /** rasio bingkai preview: "wide" (banner) atau "square" (QRIS) */
  frame?: "wide" | "square";
};

type Status = { kind: "idle" | "busy" | "error" | "saved"; text?: string };

export default function CloudinaryUpload({
  label,
  hint,
  value,
  onChange,
  frame = "wide",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function pickFile() {
    inputRef.current?.click();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setStatus({ kind: "error", text: "Format harus JPG, PNG, atau WebP." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus({
        kind: "error",
        text: `Ukuran maksimal 2 MB (file ini ${Math.round(file.size / 1024)} KB).`,
      });
      return;
    }

    setStatus({ kind: "busy", text: "Mengunggah ke Cloudinary…" });
    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error || "Gagal membuat signature.");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      if (sign.uploadPreset) form.append("upload_preset", sign.uploadPreset);

      const upRes = await fetch(sign.endpoint, { method: "POST", body: form });
      const payload = await upRes.json();
      if (!upRes.ok) {
        throw new Error(payload?.error?.message || "Upload ditolak Cloudinary.");
      }

      const url = payload.secure_url as string;
      if (value && value !== url && value.includes("res.cloudinary.com")) {
        void fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      }
      onChange(url);
      setStatus({ kind: "saved", text: "Terkirim. Jangan lupa tekan Simpan Pengaturan." });
    } catch (e) {
      setStatus({
        kind: "error",
        text: e instanceof Error ? e.message : "Upload gagal.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box =
    frame === "square"
      ? "aspect-square w-full max-w-[260px]"
      : "aspect-[16/9] w-full";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-medium text-navy">{label}</span>
        {hint && <span className="text-xs text-ink">{hint}</span>}
      </div>

      <div
        className={`relative grid place-items-center overflow-hidden rounded-xl border border-dashed border-[#c9d2e0] bg-tint ${box}`}
      >
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            sizes={frame === "square" ? "260px" : "(min-width: 640px) 400px, 100vw"}
            className="object-contain"
          />
        ) : (
          <div className="px-4 text-center">
            <p className="text-[13px] font-medium text-ink">Belum ada gambar</p>
            <p className="mt-0.5 text-xs text-ink/80">Akan memakai bawaan situs.</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="sr-only"
        aria-label={`Pilih file untuk ${label}`}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={pickFile}
          disabled={status.kind === "busy"}
          className="rounded-[10px] border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition hover:bg-tint disabled:opacity-60"
        >
          {value ? "Ganti gambar" : "Unggah gambar"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setStatus({ kind: "idle" });
            }}
            className="rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[#b3261e] transition hover:bg-red-50"
          >
            Hapus
          </button>
        )}
        <span className="text-xs text-ink">JPG/PNG/WebP, maks 2 MB</span>
      </div>

      {status.kind !== "idle" && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`mt-2 text-xs font-medium ${
            status.kind === "error"
              ? "text-[#8c1d18]"
              : status.kind === "saved"
                ? "text-emerald-700"
                : "text-ink"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
