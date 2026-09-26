"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/Container";
import SectionHead from "@/components/home/SectionHead";
import Button from "@/components/Button";
import {
  helpArticles,
  helpCategories,
  type HelpCategoryId,
  type HelpCategoryIcon,
} from "@/data/bantuan";

function catTitle(id: HelpCategoryId): string {
  return helpCategories.find((c) => c.id === id)?.title ?? "";
}

const CATEGORY_ICONS: Record<HelpCategoryIcon, React.ReactNode> = {
  receipt: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M6 21V3h12v18l-3-2-3 2-3-2-3 2Z" />
      <path d="M9.5 8.5h5" />
      <path d="M9.5 12.5h5" />
    </svg>
  ),
  phone: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  ),
  zap: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),
  file: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M14 2H6.5A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8z" />
      <path d="M14 2v6h6" />
      <path d="M8.5 13.5h7" />
      <path d="M8.5 17h5" />
    </svg>
  ),
  refund: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  shield: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M12 3l7.5 3v5.5c0 4.5-3.1 8.4-7.5 9.5-4.4-1.1-7.5-5-7.5-9.5V6L12 3z" />
    </svg>
  ),
};

type Props = {
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  jamLayanan: string;
};

export default function HelpCenter({
  whatsapp,
  whatsappUrl,
  email,
  jamLayanan,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<HelpCategoryId | null>(null);
  const [openQ, setOpenQ] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const matchedCats = useMemo(
    () =>
      helpCategories.filter(
        (c) =>
          !searching ||
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q),
      ),
    [q, searching],
  );

  const matchedFaqs = useMemo(
    () =>
      helpArticles.filter((f) => {
        if (activeCat && f.cat !== activeCat) return false;
        if (!searching) return true;
        return (
          f.q.toLowerCase().includes(q) ||
          f.a.toLowerCase().includes(q) ||
          f.keywords.some((k) => k.includes(q)) ||
          catTitle(f.cat).toLowerCase().includes(q)
        );
      }),
    [q, searching, activeCat],
  );

  const nothingFound =
    searching && matchedCats.length === 0 && matchedFaqs.length === 0;

  function waHref(message: string) {
    const sep = whatsappUrl.includes("?") ? "&" : "?";
    return `${whatsappUrl}${sep}text=${encodeURIComponent(message)}`;
  }

  function pickCategory(id: HelpCategoryId) {
    const selecting = activeCat !== id;
    setActiveCat(selecting ? id : null);
    if (selecting) {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document
        .getElementById("faq")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <>
      <section className="relative z-10 pt-14 pb-12 sm:pt-20 sm:pb-14">
        <Container>
          <div className="max-w-[760px]">
            <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-navy">
              <span aria-hidden className="h-[3px] w-8 bg-orange" />
              Pusat Bantuan Valenca
            </p>
            <h1 className="mt-4 font-display text-[clamp(30px,5vw,46px)] leading-[1.1] text-navy">
              Butuh Bantuan? Kami Siap Membantu.
            </h1>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-ink">
              Temukan jawaban cepat untuk pertanyaan seputar transaksi,
              pembayaran, dan layanan Valenca — atau hubungi tim kami langsung.
            </p>

            <div className="relative mt-7 max-w-[640px]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink"
              >
                <circle cx="11.5" cy="11.5" r="7.5" />
                <path d="M21 21l-5.2-5.2" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari bantuan, misalnya: token PLN, pulsa, refund..."
                aria-label="Cari bantuan"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-card border border-navy/15 bg-white py-4 pl-12 pr-12 text-[15px] font-medium text-navy shadow-card outline-none transition placeholder:font-normal placeholder:text-ink focus:border-navy focus:shadow-[0_0_0_3px_rgba(20,33,61,.15)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink transition hover:bg-tint hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="size-4"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {!nothingFound && matchedCats.length > 0 && (
        <section className="relative z-10 pb-8 sm:pb-10">
          <Container>
            {searching ? (
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                Kategori · {matchedCats.length} hasil
              </p>
            ) : (
              <SectionHead
                center
                title="Topik Bantuan"
                desc="Pilih kategori sesuai kendala yang Anda alami."
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchedCats.map((c) => {
                const active = activeCat === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickCategory(c.id)}
                    aria-pressed={active}
                    className={`rounded-card border p-5 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 ${
                      active
                        ? "border-navy bg-navy text-white shadow-card"
                        : "border-navy/15 bg-white shadow-card hover:-translate-y-0.5 hover:border-navy/45"
                    }`}
                  >
                    <span
                      className={`grid size-10 place-items-center rounded-[10px] ${
                        active ? "bg-white/10 text-white" : "bg-tint text-navy"
                      }`}
                    >
                      {CATEGORY_ICONS[c.icon]}
                    </span>
                    <span
                      className={`mt-4 block text-[15px] font-bold ${
                        active ? "text-white" : "text-navy"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span
                      className={`mt-1 block text-[13px] leading-relaxed ${
                        active ? "text-white/80" : "text-ink"
                      }`}
                    >
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {!nothingFound && (
        <section
          id="faq"
          className="relative z-10 scroll-mt-24 pb-10 sm:pb-12"
        >
          <Container>
            {searching ? (
              <div className="mb-9 text-center">
                <h2 className="font-display text-[clamp(28px,4.5vw,42px)] leading-[1.15]">
                  Hasil Pencarian
                </h2>
                <p
                  aria-live="polite"
                  className="mx-auto mt-[10px] max-w-[54ch] text-base text-ink"
                >
                  {matchedFaqs.length} pertanyaan untuk
                  {" “"}
                  {query.trim()}
                  {"”"}.
                </p>
              </div>
            ) : (
              <SectionHead
                center
                title="Pertanyaan yang Sering Ditanyakan"
                desc="Temukan jawaban cepat untuk kendala yang paling sering dialami pengguna."
              />
            )}

            {activeCat && (
              <div className="-mt-6 mb-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveCat(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-navy/25 bg-white px-4 py-1.5 text-[13px] font-semibold text-navy transition hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  Kategori: {catTitle(activeCat)}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="size-3.5"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            )}

            {matchedFaqs.length > 0 ? (
              <div className="overflow-hidden rounded-card border border-navy/15 bg-white">
                {matchedFaqs.map((f) => (
                  <div key={f.q} className="border-b border-line last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenQ(openQ === f.q ? null : f.q)}
                      aria-expanded={openQ === f.q}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-bold transition hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange sm:px-6"
                    >
                      <span>{f.q}</span>
                      <i
                        className={`font-display text-xl not-italic text-navy transition-transform duration-200 ${
                          openQ === f.q ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </i>
                    </button>
                    <AnimatePresence initial={false}>
                      {openQ === f.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[72ch] px-5 pb-5 text-sm leading-relaxed text-ink sm:px-6">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-navy/15 bg-white px-6 py-10 text-center shadow-card">
                <p className="font-display text-lg text-navy">
                  Belum ada pertanyaan untuk tampilan ini.
                </p>
                <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-ink">
                  Coba kata kunci lain, pilih kategori lain, atau hubungi
                  Customer Care kami.
                </p>
              </div>
            )}
          </Container>
        </section>
      )}

      {nothingFound && (
        <section className="relative z-10 py-14 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[600px] rounded-card border border-navy/15 bg-white px-6 py-12 text-center shadow-card">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-tint text-navy">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="size-6"
                >
                  <circle cx="11.5" cy="11.5" r="7.5" />
                  <path d="M21 21l-5.2-5.2" />
                </svg>
              </span>
              <h2 className="mt-5 font-display text-[clamp(22px,3vw,28px)] leading-tight text-navy">
                Tidak menemukan jawaban yang Anda cari?
              </h2>
              <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink">
                Coba gunakan kata kunci lain, atau hubungi Customer Care kami —
                siap membantu {jamLayanan.toLowerCase()}.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  variant="solid"
                  href={waHref(
                    "Halo Customer Care Valenca, saya tidak menemukan jawaban yang saya cari di pusat bantuan.",
                  )}
                >
                  Ajukan Pengaduan →
                </Button>
                <Button variant="outline" onClick={() => setQuery("")}>
                  Lihat Semua Pertanyaan
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="relative z-10 pb-8 sm:pb-10">
        <Container>
          <div className="rounded-card border border-navy/20 bg-navy px-6 py-10 shadow-card sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-6 max-[700px]:flex-col max-[700px]:text-center">
              <div>
                <h3 className="font-display text-[clamp(22px,4vw,32px)] leading-[1.2] text-white">
                  Masih Mengalami Kendala?
                </h3>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-white/85">
                  Ceritakan kendala Anda — tim Customer Care kami siap
                  membantu, online {jamLayanan.toLowerCase()}.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 max-[700px]:w-full min-[701px]:items-end">
                <Button
                  variant="white"
                  href={waHref(
                    "Halo Customer Care Valenca, saya ingin mengajukan pengaduan.",
                  )}
                >
                  Ajukan Pengaduan →
                </Button>
                <a
                  href={waHref("Halo Customer Care Valenca, saya ingin menghubungi tim Anda.")}
                  className="text-sm font-semibold text-white/85 underline underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  Hubungi Customer Care
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative z-10 pt-8 pb-16 sm:pt-10 sm:pb-20">
        <Container>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
            Hubungi Kami
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-card border border-navy/15 bg-white p-5 shadow-card">
              <span className="grid size-10 place-items-center rounded-[10px] bg-tint text-navy">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2" />
                  <rect x="2.5" y="11" width="4" height="6" rx="1.5" />
                  <rect x="17.5" y="11" width="4" height="6" rx="1.5" />
                </svg>
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                Customer Care
              </p>
              <p className="mt-1.5 font-display text-lg text-navy">
                {jamLayanan}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">
                Tim kami siap membantu setiap kendala transaksi Anda.
              </p>
            </div>

            <div className="rounded-card border border-navy/15 bg-white p-5 shadow-card">
              <span className="grid size-10 place-items-center rounded-[10px] bg-tint text-navy">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-5 4V5.5Z" />
                </svg>
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                WhatsApp
              </p>
              <a
                href={waHref(
                  "Halo Customer Care Valenca, saya butuh bantuan terkait layanan Valenca.",
                )}
                className="mt-1.5 block font-display text-lg text-navy underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                {whatsapp}
              </a>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">
                Chat langsung dengan tim Customer Care kami.
              </p>
            </div>

            <div className="rounded-card border border-navy/15 bg-white p-5 shadow-card">
              <span className="grid size-10 place-items-center rounded-[10px] bg-tint text-navy">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3.5 6.5 12 13l8.5-6.5" />
                </svg>
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                Email
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-1.5 block font-display text-lg text-navy underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                {email}
              </a>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">
                Untuk pertanyaan umum, masukan, atau kerja sama.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
