"use client";

import { useMemo, useState } from "react";
import { deleteOrderAction, setOrderStatusAction } from "@/app/admin/actions";
import { rupiah } from "@/lib/format";
import type { AdminResult, Order, OrderStatus } from "@/types";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

const inputCls =
  "w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-[#667290] focus:border-orange focus:ring-2 focus:ring-orange/25";

const STATUS_META: Record<
  OrderStatus,
  { label: string; short: string; badge: string }
> = {
  pending: {
    label: "Menunggu Pembayaran",
    short: "Menunggu",
    badge: "border-amber-300 bg-amber-50 text-amber-700",
  },
  paid: {
    label: "Pembayaran Berhasil",
    short: "Dibayar",
    badge: "border-sky-300 bg-sky-50 text-sky-700",
  },
  processing: {
    label: "Sedang Diproses",
    short: "Diproses",
    badge: "border-orange-300 bg-orange-50 text-orange-700",
  },
  completed: {
    label: "Berhasil",
    short: "Selesai",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  failed: {
    label: "Gagal",
    short: "Gagal",
    badge: "border-red-300 bg-red-50 text-red-700",
  },
  cancelled: {
    label: "Dibatalkan",
    short: "Dibatalkan",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
  },
};

type Filter = "all" | OrderStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: STATUS_META.pending.short },
  { key: "paid", label: STATUS_META.paid.short },
  { key: "processing", label: STATUS_META.processing.short },
  { key: "completed", label: STATUS_META.completed.short },
  { key: "failed", label: STATUS_META.failed.short },
  { key: "cancelled", label: STATUS_META.cancelled.short },
];

type Notice = { kind: "ok" | "err"; text: string } | null;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderManager({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const stats = useMemo(() => {
    const s = { pending: 0, inProgress: 0, completed: 0, revenue: 0 };
    for (const o of orders) {
      if (o.status === "pending") s.pending += 1;
      else if (o.status === "paid" || o.status === "processing")
        s.inProgress += 1;
      else if (o.status === "completed") s.completed += 1;
      if (o.status === "paid" || o.status === "processing" || o.status === "completed")
        s.revenue += o.total;
    }
    return s;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.kode.toLowerCase().includes(q) ||
        o.targetValue.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.itemLabel.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  async function run(result: AdminResult): Promise<boolean> {
    if (!result.ok) {
      setNotice({ kind: "err", text: result.error });
      return false;
    }
    return true;
  }

  async function changeStatus(kode: string, status: OrderStatus) {
    setPending(true);
    setNotice(null);
    try {
      const result = await setOrderStatusAction(kode, status);
      if (!(await run(result))) return;
      setOrders((list) =>
        list.map((o) => (o.kode === kode ? { ...o, status } : o)),
      );
      setNotice({
        kind: "ok",
        text: `Pesanan ${kode} → ${STATUS_META[status].label}.`,
      });
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "Gagal mengubah status.",
      });
    } finally {
      setPending(false);
    }
  }

  async function remove(o: Order) {
    if (
      !window.confirm(
        `Hapus pesanan ${o.kode}? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    setPending(true);
    setNotice(null);
    try {
      const result = await deleteOrderAction(o.kode);
      if (!(await run(result))) return;
      setOrders((list) => list.filter((x) => x.kode !== o.kode));
      setNotice({ kind: "ok", text: `Pesanan ${o.kode} dihapus.` });
    } catch (e) {
      setNotice({
        kind: "err",
        text: e instanceof Error ? e.message : "Gagal menghapus pesanan.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-navy">
          Kelola Pesanan
        </h1>
        <p className="mt-1 text-sm text-ink">
          Pesanan masuk dari halaman bayar — ubah status setelah pembayaran
          terverifikasi.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] text-ink">Menunggu verifikasi</p>
          <p className="mt-1 font-display text-[26px] text-amber-700">
            {stats.pending}
          </p>
        </li>
        <li className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] text-ink">Dalam proses</p>
          <p className="mt-1 font-display text-[26px] text-sky-700">
            {stats.inProgress}
          </p>
        </li>
        <li className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] text-ink">Selesai</p>
          <p className="mt-1 font-display text-[26px] text-emerald-700">
            {stats.completed}
          </p>
        </li>
        <li className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] text-ink">Omzet (terbayar + selesai)</p>
          <p className="mt-1 font-display text-[26px] text-navy">
            {rupiah(stats.revenue)}
          </p>
        </li>
      </ul>

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

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex rounded-[10px] border border-line bg-white p-1"
          role="tablist"
          aria-label="Filter status pesanan"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-[13px] transition ${
                filter === f.key
                  ? "bg-tint font-medium text-navy"
                  : "text-ink hover:text-navy"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="min-w-[220px] flex-1">
          <input
            className={inputCls}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode, nomor, produk…"
            aria-label="Cari pesanan"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {visible.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink">
            {orders.length === 0
              ? "Belum ada pesanan masuk."
              : "Tidak ada pesanan yang cocok dengan filter."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((o) => (
              <li key={o.kode} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="rounded bg-tint px-1.5 py-0.5 font-mono text-[12px] font-semibold text-navy">
                        {o.kode}
                      </code>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_META[o.status].badge}`}
                      >
                        {STATUS_META[o.status].label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-navy">
                      {o.productName} · {o.itemLabel}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink">
                      {o.targetLabel}:{" "}
                      <span className="font-medium text-navy">
                        {o.targetValue}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDate(o.createdAt)} · harga {rupiah(o.price)} + admin{" "}
                      {o.adminFee ? rupiah(o.adminFee) : "gratis"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <b className="font-display text-[20px] text-navy">
                      {rupiah(o.total)}
                    </b>
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`st-${o.kode}`}>
                        Status pesanan {o.kode}
                      </label>
                      <select
                        id={`st-${o.kode}`}
                        className="rounded-[10px] border border-line bg-white px-2.5 py-2 text-[13px] text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/25"
                        value={o.status}
                        disabled={pending}
                        onChange={(e) =>
                          void changeStatus(
                            o.kode,
                            e.target.value as OrderStatus,
                          )
                        }
                      >
                        <option value="pending">{STATUS_META.pending.short}</option>
                        <option value="paid">{STATUS_META.paid.short}</option>
                        <option value="processing">
                          {STATUS_META.processing.short}
                        </option>
                        <option value="completed">
                          {STATUS_META.completed.short}
                        </option>
                        <option value="failed">{STATUS_META.failed.short}</option>
                        <option value="cancelled">
                          {STATUS_META.cancelled.short}
                        </option>
                      </select>
                      <button
                        type="button"
                        onClick={() => void remove(o)}
                        disabled={pending}
                        className="rounded-[10px] border border-line bg-white px-3 py-2 text-[13px] font-medium text-[#b3261e] transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={secondaryBtn}
          onClick={() => {
            setFilter("all");
            setQuery("");
          }}
        >
          Reset filter
        </button>
        <span className="text-xs text-ink">
          Menampilkan {visible.length} dari {orders.length} pesanan.
        </span>
      </div>
    </div>
  );
}
