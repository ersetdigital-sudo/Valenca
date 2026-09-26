"use client";

import { useState } from "react";
import { deleteProductAction, saveProductAction } from "@/app/admin/actions";
import { Icon, ICON_NAMES } from "@/components/icons";
import { rupiah } from "@/lib/format";
import type { AdminResult, Product, ProductItem } from "@/types";

const inputCls =
  "w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-[#667290] focus:border-orange focus:ring-2 focus:ring-orange/25 disabled:bg-tint disabled:text-muted";
const labelCls = "mb-1.5 block text-[13px] font-medium text-ink";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyDraft(): Product {
  return {
    id: "",
    nama: "",
    tag: "",
    icon: "pulsa",
    inputLabel: "Nomor Handphone",
    placeholder: "",
    hint: "",
    targetLabel: "Nomor HP",
    min: 9,
    admin: 0,
    items: [{ label: "", sub: "", price: 0 }],
  };
}

function clientValidate(p: Product): string | null {
  if (!p.nama.trim()) return "Nama produk wajib diisi.";
  if (!p.id.trim())
    return "Nama produk harus mengandung huruf atau angka (jadi alamat halaman).";
  if (p.items.length === 0) return "Minimal satu item harga.";
  for (const it of p.items) {
    if (!it.label.trim()) return "Setiap item wajib punya nama.";
    if (!Number.isFinite(it.price) || it.price <= 0)
      return `Harga "${it.label}" belum benar.`;
  }
  return null;
}

type Notice = { kind: "ok" | "err"; text: string } | null;

export default function ProductManager({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  function patch<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function patchItem(index: number, patchPart: Partial<ProductItem>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            items: d.items.map((it, i) => (i === index ? { ...it, ...patchPart } : it)),
          }
        : d,
    );
  }

  function startNew() {
    setNotice(null);
    setIsNew(true);
    setDraft(emptyDraft());
  }

  function startEdit(p: Product) {
    setNotice(null);
    setIsNew(false);
    setDraft({ ...p, items: p.items.map((it) => ({ ...it })) });
  }

  async function run(result: AdminResult) {
    if (!result.ok) {
      setNotice({ kind: "err", text: result.error });
      return false;
    }
    return true;
  }

  async function save() {
    if (!draft) return;
    const payload: Product = isNew ? { ...draft, id: slugify(draft.nama) } : draft;
    const invalid = clientValidate(payload);
    if (invalid) {
      setNotice({ kind: "err", text: invalid });
      return;
    }
    setPending(true);
    setNotice(null);
    try {
      const result = await saveProductAction(payload);
      if (!(await run(result))) return;
      const saved: Product = payload;
      setProducts((list) =>
        isNew
          ? [...list.filter((p) => p.id !== saved.id), saved]
          : list.map((p) => (p.id === saved.id ? saved : p)),
      );
      setDraft(null);
      setNotice({
        kind: "ok",
        text: `Produk "${saved.nama}" tersimpan. Halaman situs sudah diperbarui.`,
      });
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "Gagal menyimpan produk.",
      });
    } finally {
      setPending(false);
    }
  }

  async function remove(p: Product) {
    if (!window.confirm(`Hapus produk "${p.nama}"? Tindakan ini tidak bisa dibatalkan.`))
      return;
    setPending(true);
    setNotice(null);
    try {
      const result = await deleteProductAction(p.id);
      if (!(await run(result))) return;
      setProducts((list) => list.filter((x) => x.id !== p.id));
      if (draft?.id === p.id) setDraft(null);
      setNotice({ kind: "ok", text: `Produk "${p.nama}" dihapus.` });
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "Gagal menghapus produk.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-navy">
            Produk &amp; Harga
          </h1>
          <p className="mt-1 text-sm text-ink">
            {products.length} produk aktif — tiap produk jadi satu kategori di
            beranda dan punya halaman sendiri (/bayar/…).
          </p>
        </div>
        <button type="button" onClick={startNew} className={primaryBtn}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden
            className="size-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah produk / kategori
        </button>
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

      {draft && (
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-navy">
              {isNew ? "Produk baru" : `Edit: ${draft.nama || draft.id}`}
            </h2>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="text-[13px] font-medium text-ink underline underline-offset-4 transition hover:text-navy"
            >
              Batal
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="p-nama">
                Nama produk / kategori
              </label>
              <input
                id="p-nama"
                className={inputCls}
                value={draft.nama}
                onChange={(e) => {
                  const value = e.target.value;
                  setDraft((d) =>
                    d
                      ? { ...d, nama: value, id: isNew ? slugify(value) : d.id }
                      : d,
                  );
                }}
                placeholder="Paket Data"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="p-tag">
                Tag pendek
              </label>
              <input
                id="p-tag"
                className={inputCls}
                value={draft.tag}
                onChange={(e) => patch("tag", e.target.value)}
                placeholder="Semua Operator"
              />
              <p className="mt-1.5 text-xs text-ink">
                Teks kecil di bawah nama pada kartu beranda &amp; halaman bayar,
                juga masuk deskripsi SEO — contoh: “Telkomsel, XL, Indosat, Tri”
              </p>
            </div>
            <div>
              <label className={labelCls} htmlFor="p-admin">
                Biaya admin (Rp)
              </label>
              <input
                id="p-admin"
                type="number"
                min={0}
                step={500}
                className={inputCls}
                value={draft.admin}
                onChange={(e) => patch("admin", Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="p-icon">
                Ikon
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="p-icon"
                  className={`${inputCls} sm:max-w-[280px]`}
                  value={draft.icon}
                  onChange={(e) => patch("icon", e.target.value as Product["icon"])}
                >
                  {ICON_NAMES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-tint text-navy">
                  <Icon name={draft.icon} className="size-5" />
                </span>
              </div>
            </div>
          </div>

          <details className="mt-4 rounded-xl border border-line bg-tint/40 open:bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-medium text-ink transition hover:text-navy [&::-webkit-details-marker]:hidden">
              <span>Pengaturan input pelanggan (opsional)</span>
              <span className="text-xs font-normal text-ink">
                Label kolom, placeholder, hint, panjang nomor
              </span>
            </summary>
            <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="p-inputlabel">
                  Label input pelanggan
                </label>
                <input
                  id="p-inputlabel"
                  className={inputCls}
                  value={draft.inputLabel}
                  onChange={(e) => patch("inputLabel", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="p-target">
                  Label ringkasan transaksi
                </label>
                <input
                  id="p-target"
                  className={inputCls}
                  value={draft.targetLabel}
                  onChange={(e) => patch("targetLabel", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="p-ph">
                  Placeholder
                </label>
                <input
                  id="p-ph"
                  className={inputCls}
                  value={draft.placeholder}
                  onChange={(e) => patch("placeholder", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="p-hint">
                  Hint di bawah input
                </label>
                <input
                  id="p-hint"
                  className={inputCls}
                  value={draft.hint}
                  onChange={(e) => patch("hint", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="p-min">
                  Panjang input minimal
                </label>
                <input
                  id="p-min"
                  type="number"
                  min={1}
                  className={inputCls}
                  value={draft.min}
                  onChange={(e) => patch("min", Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
            </div>
          </details>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-ink">Item &amp; harga</span>
              <button
                type="button"
                onClick={() => patch("items", [...draft.items, { label: "", sub: "", price: 0 }])}
                className={secondaryBtn}
              >
                + Tambah item
              </button>
            </div>
            <div className="space-y-3">
              {draft.items.map((it, i) => (
                <div
                  key={i}
                  className="grid gap-2 rounded-xl border border-line bg-tint/50 p-3 sm:grid-cols-[1fr_1fr_160px_auto] sm:gap-3"
                >
                  <div>
                    <label className={labelCls} htmlFor={`item-label-${i}`}>
                      Nama item
                    </label>
                    <input
                      id={`item-label-${i}`}
                      className={inputCls}
                      value={it.label}
                      onChange={(e) => patchItem(i, { label: e.target.value })}
                      placeholder="1 GB / 3 Hari"
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`item-sub-${i}`}>
                      Keterangan
                    </label>
                    <input
                      id={`item-sub-${i}`}
                      className={inputCls}
                      value={it.sub}
                      onChange={(e) => patchItem(i, { sub: e.target.value })}
                      placeholder="Kuota 24 jam"
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`item-price-${i}`}>
                      Harga (Rp)
                    </label>
                    <input
                      id={`item-price-${i}`}
                      type="number"
                      min={0}
                      step={500}
                      className={inputCls}
                      value={it.price}
                      onChange={(e) =>
                        patchItem(i, { price: Math.max(0, Number(e.target.value) || 0) })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        patch(
                          "items",
                          draft.items.filter((_, idx) => idx !== i),
                        )
                      }
                      disabled={draft.items.length <= 1}
                      className="h-[42px] rounded-[10px] px-3 text-[13px] font-medium text-[#b3261e] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Hapus item ${it.label || i + 1}`}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void save()}
              disabled={pending}
              className={primaryBtn}
            >
              {pending ? "Menyimpan…" : "Simpan produk"}
            </button>
            <span className="text-xs text-ink">
              Tersimpan = langsung aktif di situs.
            </span>
          </div>
        </section>
      )}

      <ul className="grid gap-4 min-[901px]:grid-cols-2">
        {products.map((p) => (
          <li key={p.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-tint text-navy">
                <Icon name={p.icon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h3 className="truncate text-[15px] font-semibold text-navy">{p.nama}</h3>
                  <code className="rounded bg-tint px-1.5 py-0.5 font-mono text-[11px] text-ink">
                    /bayar/{p.id}
                  </code>
                </div>
                <p className="mt-0.5 text-xs text-ink">
                  {p.items.length} item · admin {rupiah(p.admin)} · {p.tag || "—"}
                </p>
                <p className="mt-2 text-xs text-ink">
                  Termurah:{" "}
                  <span className="font-semibold text-navy">
                    {rupiah(
                      p.items.length ? Math.min(...p.items.map((i) => i.price)) : 0,
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(p)}
                className={`${secondaryBtn} flex-1`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void remove(p)}
                disabled={pending}
                className="flex-1 rounded-[10px] border border-line bg-white px-3 py-2 text-[13px] font-medium text-[#b3261e] transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-ink">
          Belum ada produk. Klik “Produk baru” untuk menambahkan.
        </p>
      )}
    </div>
  );
}
