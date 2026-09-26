"use client";

import { useState, useTransition } from "react";
import Container from "@/components/Container";
import {
  checkOrderAction,
  type CheckOrderResult,
} from "@/app/bayar/actions";

const STATUS_META: Record<
  string,
  { label: string; badge: string }
> = {
  pending: {
    label: "Menunggu verifikasi",
    badge: "border-amber-300 bg-amber-50 text-amber-700",
  },
  paid: {
    label: "Berhasil",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  failed: {
    label: "Gagal",
    badge: "border-red-300 bg-red-50 text-red-700",
  },
};

function rupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Result = Extract<CheckOrderResult, { ok: true }> | null;

export default function CheckTransaction() {
  const [kode, setKode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setResult(null);
    setError(null);
    startTransition(async () => {
      const res = await checkOrderAction(kode);
      if (res.ok) setResult(res);
      else setError(res.error);
    });
  }

  function reset() {
    setKode("");
    setError(null);
    setResult(null);
  }

  const order = result?.order;
  const status = order ? STATUS_META[order.status] : null;

  return (
    <section className="relative z-10 py-16">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <h1 className="font-display text-[clamp(30px,5vw,48px)] leading-[1.12]">
              Sudah Bayar? Cek Statusnya di Sini.
            </h1>
            <p className="mt-[10px] max-w-[46ch] text-base text-ink">
              Masukkan kode transaksi yang kamu dapat setelah scan QRIS. Status
              diperbarui oleh tim kami begitu pembayaran terverifikasi.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-ink">
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[7px] size-2 shrink-0 rounded-full bg-orange"
                />
                Kode transaksi berformat{" "}
                <span className="font-bold text-navy">VLC-00000000</span>,
                tampil di halaman pembayaran.
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[7px] size-2 shrink-0 rounded-full bg-orange"
                />
                Status <span className="font-bold text-navy">Berhasil</span>{" "}
                berarti pulsa/token sudah dikirim ke nomor tujuan.
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[7px] size-2 shrink-0 rounded-full bg-orange"
                />
                Ada masalah? Hubungi WhatsApp kami — siap 24 jam.
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-card border-2 border-navy bg-white shadow-hard">
            <div className="flex items-center justify-between gap-3 bg-navy px-6 py-4 text-white">
              <h2 className="font-display text-lg tracking-[-0.01em]">
                Lacak Pesanan
              </h2>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-light">
                QRIS · Valenca
              </span>
            </div>

            <form onSubmit={submit} className="px-6 pb-6 pt-6">
              <label
                htmlFor="kode-transaksi"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-ink"
              >
                Kode transaksi
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="kode-transaksi"
                  value={kode}
                  onChange={(e) => setKode(e.target.value.toUpperCase())}
                  placeholder="VLC-96952416"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={pending}
                  className="w-full min-w-0 flex-1 rounded-btn border-2 border-line bg-bg px-4 py-[14px] font-semibold tracking-[0.06em] text-navy outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-ink/70 focus:border-navy focus:shadow-[0_0_0_3px_rgba(20,33,61,.15)] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="shrink-0 rounded-btn border-2 border-navy bg-navy px-7 py-[14px] text-sm font-bold text-white shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 active:translate-y-0 active:shadow-none disabled:translate-y-0 disabled:opacity-70 disabled:hover:shadow-hard"
                >
                  {pending ? "Memeriksa…" : "Cek Status →"}
                </button>
              </div>

              <div aria-live="polite">
                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-btn border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                  >
                    {error}
                  </p>
                )}

                {!error && !order && !pending && (
                  <p className="mt-4 text-[13px] leading-relaxed text-ink">
                    Belum ada yang dicek. Hasil pesanan — lengkap dengan status
                    pembayaran — akan tampil di sini.
                  </p>
                )}

                {order && status && (
                  <div className="mt-5 rounded-xl border-2 border-dashed border-navy/40 bg-bg px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-line pb-3">
                      <span className="font-display text-lg text-navy tabular-nums">
                        {order.kode}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <dl className="mt-1 divide-y divide-line/70 text-sm">
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-ink">Layanan</dt>
                        <dd className="text-right font-semibold text-navy">
                          {order.productName} · {order.itemLabel}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-ink">{order.targetLabel}</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {order.targetMasked}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-ink">Dibuat</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {formatDate(order.createdAt)}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-ink">Harga</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {rupiah(order.price)}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="text-ink">Biaya admin</dt>
                        <dd className="text-right font-semibold tabular-nums text-navy">
                          {order.adminFee > 0 ? rupiah(order.adminFee) : "Gratis"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-navy pt-3">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                        Total bayar
                      </span>
                      <span className="font-display text-xl text-navy tabular-nums">
                        {rupiah(order.total)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="mt-4 text-sm font-bold text-orange underline underline-offset-4 transition hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                    >
                      Cek transaksi lain
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
