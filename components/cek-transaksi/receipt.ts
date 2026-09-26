import { jsPDF } from "jspdf";
import { formatWaktu, rupiah } from "./format";
import { STATUS_META } from "./status";
import type { CheckOrderResult } from "@/app/bayar/actions";
import type { OrderStatus } from "@/types";

export type ReceiptOrder = Extract<CheckOrderResult, { ok: true }>["order"];

const PAGE_W = 80;
const MARGIN = 6;
const CONTENT_W = PAGE_W - MARGIN * 2;
const RIGHT = PAGE_W - MARGIN;
const VALUE_W = 41;
const MIN_PAGE_H = 132;
const TOP_PAD = 8;
const BOTTOM_PAD = 8;
const LH = 3.6;

const NAVY: [number, number, number] = [20, 33, 61];
const GRAY: [number, number, number] = [107, 119, 147];
const INK: [number, number, number] = [60, 74, 102];
const RULE: [number, number, number] = [210, 218, 231];
const ORANGE: [number, number, number] = [255, 107, 53];

const ACCENT: Record<OrderStatus, [number, number, number]> = {
  pending: [217, 119, 6],
  paid: [3, 105, 161],
  processing: [194, 65, 12],
  completed: [5, 150, 105],
  failed: [185, 28, 28],
  cancelled: [71, 85, 105],
};

type Block = { h: number; draw: (doc: jsPDF, y: number) => void };

function ascii(text: string): string {
  const map: Record<string, string> = {
    "•": "·",
    "–": "-",
    "—": "-",
    "→": "-",
    "’": "'",
    "“": '"',
    "”": '"',
    "…": "...",
  };
  return text
    .replace(/[•–—→’“”…]/g, (c) => map[c] ?? c)
    .replace(/[^\x00-\xFF]/g, "?");
}

function productFieldLabel(category: string): string {
  const k = category.toLowerCase();
  if (k.includes("token") || k.includes("pln")) return "Token Listrik";
  if (k.includes("pulsa")) return "Nominal Pulsa";
  if (k.includes("data") || k.includes("internet")) return "Paket Data";
  if (k.includes("pdam")) return "Tagihan PDAM";
  if (k.includes("bpjs")) return "Iuran BPJS";
  if (k.includes("ewallet") || k.includes("e-wallet") || k.includes("wallet"))
    return "Nominal Top Up";
  if (k.includes("game") || k.includes("voucher")) return "Voucher";
  return "Produk";
}

function detailRows(order: ReceiptOrder): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const category = order.productName.trim();
  const item = order.itemLabel.trim();
  if (category && category.toLowerCase() !== item.toLowerCase()) {
    rows.push({ label: "Kategori", value: category });
  }
  if (item) rows.push({ label: productFieldLabel(category), value: item });
  if (order.targetLabel.trim() && order.targetMasked.trim()) {
    rows.push({ label: order.targetLabel.trim(), value: order.targetMasked });
  }
  rows.push({ label: "Metode Pembayaran", value: "QRIS" });
  rows.push({ label: "Harga", value: rupiah(order.price) });
  rows.push({
    label: "Biaya Admin",
    value: order.adminFee > 0 ? rupiah(order.adminFee) : "Gratis",
  });
  return rows;
}

function divider(): Block {
  return {
    h: 3.4,
    draw: (d, y) => {
      d.setDrawColor(...RULE);
      d.setLineWidth(0.2);
      d.line(MARGIN, y + 1.4, RIGHT, y + 1.4);
    },
  };
}

function masthead(): Block {
  return {
    h: 27,
    draw: (d, y) => {
      const size = 12;
      const x = (PAGE_W - size) / 2;
      const s = size / 64;
      d.setFillColor(...NAVY);
      d.roundedRect(x, y, size, size, 2.6, 2.6, "F");
      d.setFillColor(255, 255, 255);
      d.lines(
        [
          [11.5, 0],
          [9.5, 22],
          [0, 13],
          [-5.5, 0],
        ],
        x + 11 * s,
        y + 15 * s,
        [s, s],
        "F",
        true,
      );
      d.setFillColor(...ORANGE);
      d.lines(
        [
          [9.5, -22],
          [11.5, 0],
          [-15.5, 35],
          [-5.5, 0],
        ],
        x + 32 * s,
        y + 37 * s,
        [s, s],
        "F",
        true,
      );
      d.setFont("helvetica", "bold");
      d.setFontSize(13);
      d.setTextColor(...NAVY);
      d.text("VALENCA", PAGE_W / 2, y + size + 5.5, {
        align: "center",
        charSpace: 1.4,
      });
      d.setFont("helvetica", "normal");
      d.setFontSize(7.5);
      d.setTextColor(...GRAY);
      d.text("Bukti Transaksi Digital", PAGE_W / 2, y + size + 10, {
        align: "center",
      });
    },
  };
}

function sectionTitle(title: string): Block {
  return {
    h: 9,
    draw: (d, y) => {
      d.setFont("helvetica", "bold");
      d.setFontSize(7.5);
      d.setTextColor(...NAVY);
      d.text(ascii(title), MARGIN, y + 5, { charSpace: 0.55 });
    },
  };
}

function headline(text: string): Block {
  return {
    h: 8.5,
    draw: (d, y) => {
      d.setFont("helvetica", "bold");
      d.setFontSize(11.5);
      d.setTextColor(...NAVY);
      d.text(ascii(text), PAGE_W / 2, y + 5.5, {
        align: "center",
        charSpace: 0.4,
      });
    },
  };
}

function pairBlock(
  measure: jsPDF,
  label: string,
  value: string,
  opts: { labelSize?: number; valueSize?: number; valueColor?: [number, number, number] } = {},
): Block {
  const labelSize = opts.labelSize ?? 8;
  const valueSize = opts.valueSize ?? 8.6;
  const valueColor = opts.valueColor ?? NAVY;
  const text = ascii(value);
  const candidates = [valueSize, valueSize - 0.6, 7.6];
  let chosen = candidates[candidates.length - 1];
  measure.setFont("helvetica", "bold");
  for (const size of candidates) {
    measure.setFontSize(size);
    if (measure.getTextWidth(text) <= VALUE_W) {
      chosen = size;
      break;
    }
  }
  measure.setFontSize(chosen);
  const lines: string[] = measure.splitTextToSize(text, VALUE_W);
  const top = 2;
  const h = top + Math.max(lines.length, 1) * LH + 1.6;
  return {
    h,
    draw: (d, y) => {
      const base = y + top;
      d.setFont("helvetica", "normal");
      d.setFontSize(labelSize);
      d.setTextColor(...GRAY);
      d.text(ascii(label), MARGIN, base);
      d.setFont("helvetica", "bold");
      d.setFontSize(chosen);
      d.setTextColor(...valueColor);
      const ls: string[] = d.splitTextToSize(text, VALUE_W);
      ls.forEach((ln, i) => d.text(ln, RIGHT, base + i * LH, { align: "right" }));
    },
  };
}

function statusBlock(order: ReceiptOrder): Block {
  const meta = STATUS_META[order.status];
  const accent = ACCENT[order.status];
  return {
    h: 17.5,
    draw: (d, y) => {
      const k = 2.6;
      d.setDrawColor(...accent);
      d.setLineWidth(0.55);
      d.setLineCap("round");
      d.line(MARGIN, y + 1.6, MARGIN + k * 0.42, y + 3.4);
      d.line(MARGIN + k * 0.42, y + 3.4, MARGIN + k, y + 0.4);
      d.setLineCap("butt");
      d.setFont("helvetica", "bold");
      d.setFontSize(9.5);
      d.setTextColor(...accent);
      d.text(meta.label, MARGIN + 5.4, y + 3.6);
      d.setFont("helvetica", "normal");
      d.setFontSize(7.5);
      d.setTextColor(...INK);
      const lines: string[] = d.splitTextToSize(ascii(meta.desc), CONTENT_W);
      lines.forEach((ln, i) => d.text(ln, MARGIN, y + 9 + i * 3.4));
    },
  };
}

function footerBlock(): Block {
  const host =
    typeof window !== "undefined" && window.location.host
      ? window.location.host
      : "valenca.com";
  return {
    h: 15,
    draw: (d, y) => {
      d.setFont("helvetica", "normal");
      d.setFontSize(7.5);
      d.setTextColor(...NAVY);
      d.text("Terima kasih telah menggunakan Valenca", PAGE_W / 2, y + 5, {
        align: "center",
      });
      d.setFontSize(7);
      d.setTextColor(...GRAY);
      d.text(host, PAGE_W / 2, y + 9.5, { align: "center" });
    },
  };
}

function buildBlocks(order: ReceiptOrder, measure: jsPDF): Block[] {
  const meta = STATUS_META[order.status];
  const blocks: Block[] = [
    masthead(),
    divider(),
    headline(meta.headline),
    divider(),
    sectionTitle("DETAIL TRANSAKSI"),
    pairBlock(measure, "Nomor Transaksi", order.kode, {
      labelSize: 8,
      valueSize: 10,
    }),
    pairBlock(measure, "Tanggal & Waktu", formatWaktu(order.createdAt)),
    divider(),
    sectionTitle("RINCIAN PESANAN"),
    ...detailRows(order).map((r) => pairBlock(measure, r.label, r.value)),
    divider(),
    pairBlock(measure, "Total Pembayaran", rupiah(order.total), {
      labelSize: 8.8,
      valueSize: 13,
    }),
    divider(),
    sectionTitle("STATUS"),
    statusBlock(order),
    divider(),
    footerBlock(),
  ];
  return blocks;
}

export function buildReceipt(order: ReceiptOrder): jsPDF {
  const measure = new jsPDF({ unit: "mm", format: [PAGE_W, 200] });
  const blocks = buildBlocks(order, measure);
  const content = blocks.reduce((sum, b) => sum + b.h, 0);
  const pageH = Math.max(content + TOP_PAD + BOTTOM_PAD, MIN_PAGE_H);
  const doc = new jsPDF({
    unit: "mm",
    format: [PAGE_W, pageH],
    orientation: "portrait",
    compress: true,
  });
  let y = TOP_PAD;
  for (const block of blocks) {
    block.draw(doc, y);
    y += block.h;
  }
  return doc;
}

export function downloadReceipt(order: ReceiptOrder): void {
  const doc = buildReceipt(order);
  doc.save(`Struk-Valenca-${order.kode}.pdf`);
}
