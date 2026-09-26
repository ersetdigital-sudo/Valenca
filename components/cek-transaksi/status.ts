import type { OrderStatus } from "@/types";

export type PublicStatus = {
  label: string;
  badge: string;
  desc: string;
  headline: string;
};

export const STATUS_META: Record<OrderStatus, PublicStatus> = {
  pending: {
    label: "Menunggu Pembayaran",
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    desc: "Pesanan sudah dibuat dan menunggu pembayaran. Selesaikan pembayaran agar pesanan dapat kami proses.",
    headline: "MENUNGGU PEMBAYARAN",
  },
  paid: {
    label: "Pembayaran Berhasil",
    badge: "border-sky-300 bg-sky-50 text-sky-700",
    desc: "Pembayaran sudah kami terima dan pesanan Anda masuk antrean proses.",
    headline: "PEMBAYARAN BERHASIL",
  },
  processing: {
    label: "Sedang Diproses",
    badge: "border-orange-300 bg-orange-50 text-orange-700",
    desc: "Transaksi sedang diproses menuju nomor tujuan. Mohon tunggu beberapa saat.",
    headline: "SEDANG DIPROSES",
  },
  completed: {
    label: "Berhasil",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    desc: "Transaksi selesai. Pesanan sudah terkirim ke nomor tujuan Anda.",
    headline: "TRANSAKSI BERHASIL",
  },
  failed: {
    label: "Gagal",
    badge: "border-red-300 bg-red-50 text-red-700",
    desc: "Transaksi gagal diproses. Hubungi customer care kami untuk penanganan lebih lanjut.",
    headline: "TRANSAKSI GAGAL",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
    desc: "Transaksi dibatalkan dan tidak akan diproses lebih lanjut.",
    headline: "TRANSAKSI DIBATALKAN",
  },
};
