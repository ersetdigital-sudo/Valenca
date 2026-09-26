"use client";

import { useState } from "react";
import { saveSettingsAction } from "@/app/admin/actions";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import type { AllSettings } from "@/lib/data";
import { waLinkFrom } from "@/lib/wa";
import type { AdminResult, SiteImages, SiteSettings } from "@/types";

const inputCls =
  "w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-[#667290] focus:border-orange focus:ring-2 focus:ring-orange/25 disabled:bg-tint disabled:text-muted";
const labelCls = "mb-1.5 block text-[13px] font-medium text-ink";

const SITE_FIELDS: {
  key: keyof SiteSettings;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
}[] = [
  { key: "name", label: "Nama situs", placeholder: "Valenca" },
  { key: "tagline", label: "Tagline", placeholder: "Bayar Cepat, Hidup Lebih Ringan" },
  { key: "url", label: "URL utama", placeholder: "https://valenca.id" },
  { key: "whatsapp", label: "Nomor WhatsApp (tampilan)", placeholder: "0812-0000-0000" },
  { key: "email", label: "Email", placeholder: "halo@valenca.id" },
  { key: "jamLayanan", label: "Jam layanan", placeholder: "24 jam setiap hari" },
  { key: "legalUpdated", label: "Terakhir diperbarui (halaman legal)", placeholder: "24 September 2026" },
  {
    key: "description",
    label: "Deskripsi (SEO)",
    type: "textarea",
    placeholder: "Deskripsi singkat untuk mesin pencari…",
  },
  {
    key: "ogDescription",
    label: "Deskripsi share (OG)",
    type: "textarea",
    placeholder: "Teks saat link dibagikan ke WhatsApp…",
  },
];

const IMAGE_FIELDS: {
  key: keyof SiteImages;
  label: string;
  hint: string;
  frame: "wide" | "square";
}[] = [
  { key: "qris_url", label: "QRIS pembayaran", hint: "Tampil di langkah bayar", frame: "square" },
  { key: "banner_utama", label: "Banner utama (hero)", hint: "Slide pertama", frame: "wide" },
  { key: "banner_pln", label: "Banner PLN", hint: "Slide ketiga", frame: "wide" },
  { key: "banner_data", label: "Banner paket data", hint: "Slide kedua", frame: "wide" },
];

type Notice = { kind: "ok" | "err"; text: string } | null;

export default function SettingsForm({ initial }: { initial: AllSettings }) {
  const [site, setSite] = useState<SiteSettings>(initial.site);
  const [images, setImages] = useState<SiteImages>(initial.images);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const dirty =
    JSON.stringify({ site, images }) !==
    JSON.stringify({ site: initial.site, images: initial.images });

  async function save() {
    setPending(true);
    setNotice(null);
    try {
      const result: AdminResult = await saveSettingsAction({ site, images });
      if (!result.ok) {
        setNotice({ kind: "err", text: result.error });
        return;
      }
      setNotice({ kind: "ok", text: "Pengaturan tersimpan. Situs sudah diperbarui." });
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "Gagal menyimpan pengaturan.",
      });
    } finally {
      setPending(false);
    }
  }

  function setField(key: keyof SiteSettings, value: string) {
    setSite((s) => ({ ...s, [key]: value }));
    setNotice(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-navy">
            Pengaturan Situs
          </h1>
          <p className="mt-1 text-sm text-ink">
            Teks kontak/SEO dan gambar (QRIS + banner) dari satu tempat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              Belum disimpan
            </span>
          )}
          <button
            type="button"
            onClick={() => void save()}
            disabled={pending || !dirty}
            className="rounded-[10px] bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {pending ? "Menyimpan…" : "Simpan Pengaturan"}
          </button>
        </div>
      </div>

      {notice && (
        <p
          role={notice.kind === "err" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            notice.kind === "err"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {notice.text}
        </p>
      )}

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-1">
          <h2 className="text-[15px] font-semibold text-navy">Gambar</h2>
        </div>
        <p className="mb-5 text-sm text-ink">
          Gambar QRIS dipakai di halaman pembayaran — menggantinya di sini langsung
          mengganti QRIS yang dilihat pelanggan.
        </p>
        <div className="grid items-start gap-5 sm:grid-cols-2">
          {IMAGE_FIELDS.map((f) => (
            <CloudinaryUpload
              key={f.key}
              label={f.label}
              hint={f.hint}
              frame={f.frame}
              value={images[f.key]}
              onChange={(next) => {
                setImages((img) => ({ ...img, [f.key]: next }));
                setNotice(null);
              }}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-1">
          <h2 className="text-[15px] font-semibold text-navy">Teks &amp; kontak</h2>
        </div>
        <p className="mb-5 text-sm text-ink">
          Berlaku untuk footer, halaman legal, dan metadata situs.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SITE_FIELDS.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : undefined}>
              <label className={labelCls} htmlFor={`site-${f.key}`}>
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`site-${f.key}`}
                  rows={3}
                  className={`${inputCls} resize-y`}
                  value={site[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              ) : (
                <>
                  <input
                    id={`site-${f.key}`}
                    className={inputCls}
                    value={site[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                  {f.key === "whatsapp" && (
                    <p className="mt-1.5 text-xs leading-relaxed text-ink">
                      Tautan WhatsApp dibuat otomatis dan dipakai di seluruh
                      halaman:{" "}
                      <span className="font-mono break-all text-navy">
                        {waLinkFrom(site.whatsapp, site.whatsappUrl)}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
