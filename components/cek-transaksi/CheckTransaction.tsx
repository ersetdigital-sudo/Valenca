"use client";

import { useState, useTransition } from "react";
import Container from "@/components/Container";
import {
  checkOrderAction,
  type CheckOrderErrorCode,
  type CheckOrderResult,
} from "@/app/bayar/actions";
import { downloadReceipt } from "./receipt";
import { formatWaktu, rupiah } from "./format";
import { STATUS_META } from "./status";

const EMPTY_ERROR = {
  title: "Nomor transaksi belum diisi",
  message:
    "Masukkan nomor transaksi Anda terlebih dahulu, lalu tekan tombol cek status.",
};

const ERROR_COPY: Record<
  CheckOrderErrorCode,
  { title: string; message: string }
> = {
  format: {
    title: "Nomor transaksi tidak ditemukan",
    message:
      "Periksa kembali nomor transaksi yang Anda masukkan dan pastikan formatnya sudah benar.",
  },
  not_found: {
    title: "Nomor transaksi tidak ditemukan",
    message:
      "Periksa kembali nomor transaksi yang Anda masukkan dan pastikan formatnya sudah benar.",
  },
  server: {
    title: "Gagal memeriksa transaksi",
    message:
      "Layanan sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.",
  },
};

const CHECKLIST = [
  "Status pembayaran dan proses transaksi terkini",
  "Produk, item, dan nomor tujuan yang Anda pesan",
  "Rincian harga, biaya admin, dan total bayar",
  "Waktu transaksi lengkap dengan zona waktu WIB",
  "Struk digital yang bisa dilihat dan dicetak",
];

const TRUST = [
  {
    title: "Status Real-Time",
    desc: "Status pesanan diperbarui langsung setiap kali ada perubahan pembayaran.",
    icon: (
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Data Aman",
    desc: "Nomor tujuan ditampilkan tersamar dan hanya dipakai untuk keperluan transaksi.",
    icon: (
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
        <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3z" />
        <path d="M9.5 12l1.8 1.8 3.4-3.6" />
      </svg>
    ),
  },
  {
    title: "Bantuan Customer Care",
    desc: "Ada kendala atau pertanyaan? Tim kami siap membantu Anda.",
    icon: (
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
        <path d="M4 12a8 8 0 0116 0v5a2 2 0 01-2 2h-2" />
        <rect x="2.5" y="11" width="4" height="6" rx="1.5" />
        <rect x="17.5" y="11" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
];

type Result = Extract<CheckOrderResult, { ok: true }> | null;

export default function CheckTransaction() {
  const [kode, setKode] = useState("");
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [result, setResult] = useState<Result>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [receiptErr, setReceiptErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setResult(null);
    setShowDetail(false);
    setReceiptErr(null);
    if (!kode.trim()) {
      setError(EMPTY_ERROR);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await checkOrderAction(kode);
      if (res.ok) setResult(res);
      else setError(ERROR_COPY[res.code]);
    });
  }

  const order = result?.order;
  const status = order ? STATUS_META[order.status] : null;

  return (
    <section className="relative z-10 py-14 sm:py-20">
      <Container>
        <div className="max-w-[780px]">
          <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-navy">
            <span aria-hidden className="h-[3px] w-8 bg-orange" />
            Cek Transaksi
          </p>
          <h1 className="mt-4 font-display text-[clamp(30px,5vw,46px)] leading-[1.1] text-navy">
            Lacak Status Transaksi Anda
          </h1>
          <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-ink">
            Masukkan nomor transaksi untuk melihat status pembayaran, proses
            transaksi, dan detail layanan Anda secara lengkap.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="lg:pt-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-navy">
              Cek status transaksi
            </p>
            <h2 className="mt-3 font-display text-[clamp(24px,3.4vw,34px)] leading-[1.15] text-navy">
              Lacak setiap transaksi dengan mudah.
            </h2>
            <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-ink">
              Pantau status pembayaran, proses layanan, hingga transaksi selesai
              dalam satu halaman.
            </p>

            <div className="mt-7 h-px w-full bg-line" />

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              Yang dapat Anda lihat
            </p>
            <ul className="mt-4 space-y-3.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-ink">
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 size-4 shrink-0 text-navy"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-navy/15 bg-white shadow-card">
            <div className="border-b border-line px-6 pb-5 pt-6 sm:px-7">
              <h2 className="font-display text-xl leading-none text-navy">
                Lacak Transaksi
              </h2>
              <p className="mt-2 text-sm text-ink">
                Masukkan nomor transaksi Anda
              </p>
            </div>

            <form onSubmit={submit} className="px-6 pb-6 pt-6 sm:px-7">
              <label
                htmlFor="kode-transaksi"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
              >
                Nomor Transaksi
              </label>
              <input
                id="kode-transaksi"
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                placeholder="Contoh: VLC-96952416"
                autoComplete="off"
                spellCheck={false}
                disabled={pending}
                aria-invalid={error ? true : undefined}
                aria-describedby="kode-transaksi-hint"
                className="w-full rounded-[10px] border border-navy/15 bg-white px-4 py-3 font-semibold tracking-[0.05em] text-navy outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-muted focus:border-navy focus:shadow-[0_0_0_3px_rgba(20,33,61,.15)] disabled:opacity-60"
              />
              <p
                id="kode-transaksi-hint"
                className="mt-2 text-[13px] leading-relaxed text-ink"
              >
                Nomor transaksi dapat ditemukan pada halaman pembayaran atau
                bukti transaksi Anda.
              </p>

              <button
                type="submit"
                disabled={pending}
                className="mt-5 w-full rounded-[10px] bg-navy px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-70 sm:w-auto"
              >
                {pending ? "Memeriksa…" : "Cek Status Transaksi →"}
              </button>

              <div aria-live="polite">
                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                    <p className="text-sm font-semibold text-red-700">
                      {error.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-red-700/90">
                      {error.message}
                    </p>
                  </div>
                )}

                {!error && !order && !pending && (
                  <p className="mt-5 text-[13px] leading-relaxed text-ink">
                    Hasil transaksi Anda akan tampil di sini setelah nomor
                    transaksi diperiksa.
                  </p>
                )}

                {order && status && (
                  <div className="animate-result-in mt-6 rounded-xl border border-navy/15 bg-bg px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                          Transaksi Ditemukan
                        </p>
                        <p className="mt-1.5 font-display text-[22px] leading-none text-navy tabular-nums">
                          {order.kode}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${status.badge}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <dl className="divide-y divide-line text-sm">
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-ink">Produk</dt>
                        <dd className="text-right font-semibold text-navy">
                          {order.productName} · {order.itemLabel}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-ink">{order.targetLabel}</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {order.targetMasked}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-ink">Metode Pembayaran</dt>
                        <dd className="text-right font-semibold text-navy">
                          QRIS
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-ink">Waktu Transaksi</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {formatWaktu(order.createdAt)}
                        </dd>
                      </div>

                      {showDetail && (
                        <>
                          <div className="flex items-baseline justify-between gap-4 py-3">
                            <dt className="text-ink">Harga</dt>
                            <dd className="text-right font-semibold tabular-nums text-navy">
                              {rupiah(order.price)}
                            </dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-4 py-3">
                            <dt className="text-ink">Biaya admin</dt>
                            <dd className="text-right font-semibold tabular-nums text-navy">
                              {order.adminFee > 0
                                ? rupiah(order.adminFee)
                                : "Gratis"}
                            </dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-4 py-3">
                            <dt className="text-ink">Nomor transaksi</dt>
                            <dd className="text-right font-semibold tabular-nums text-navy">
                              {order.kode}
                            </dd>
                          </div>
                          <div className="py-3">
                            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                              Keterangan status
                            </dt>
                            <dd className="mt-1.5 text-[13px] leading-relaxed text-ink">
                              {status.desc}
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>

                    <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-navy pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                        Total Bayar
                      </span>
                      <span className="font-display text-xl text-navy tabular-nums">
                        {rupiah(order.total)}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDetail((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-[10px] border border-navy/25 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                      >
                        {showDetail
                          ? "Sembunyikan Detail"
                          : "Lihat Detail Transaksi →"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptErr(null);
                          try {
                            downloadReceipt(order);
                          } catch {
                            setReceiptErr(
                              "Struk gagal dibuat. Silakan coba lagi.",
                            );
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                      >
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="M12 4v10" />
                          <path d="M8 10.5l4 4 4-4" />
                          <path d="M5 19h14" />
                        </svg>
                        Unduh Struk
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-navy underline underline-offset-4 transition hover:text-navy/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                      >
                        Cetak
                      </button>
                    </div>

                    {receiptErr && (
                      <p className="mt-3 text-[13px] font-medium text-red-700">
                        {receiptErr}
                      </p>
                    )}

                    <div id="struk-cetak" className="hidden print:block">
                      <p className="font-display text-lg text-navy">Valenca</p>
                      <p className="text-[12px] uppercase tracking-[0.14em] text-ink">
                        Struk Transaksi
                      </p>
                      <hr className="my-3 border-line" />
                      <dl className="text-[13px] text-navy">
                        {[
                          ["Nomor transaksi", order.kode],
                          ["Status", status.label],
                          ["Produk", `${order.productName} · ${order.itemLabel}`],
                          [order.targetLabel, order.targetMasked],
                          ["Metode pembayaran", "QRIS"],
                          ["Waktu transaksi", formatWaktu(order.createdAt)],
                          ["Harga", rupiah(order.price)],
                          [
                            "Biaya admin",
                            order.adminFee > 0 ? rupiah(order.adminFee) : "Gratis",
                          ],
                          ["Total bayar", rupiah(order.total)],
                        ].map(([k, v]) => (
                          <div
                            key={k}
                            className="flex justify-between gap-4 border-b border-line py-1.5"
                          >
                            <dt className="text-ink">{k}</dt>
                            <dd className="text-right font-semibold">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </form>

            <div className="border-t border-line px-6 py-5 sm:px-7">
              <ul className="space-y-4">
                {TRUST.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] border border-navy/10 bg-tint text-navy/60">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ink">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
