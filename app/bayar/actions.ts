"use server";

import { getOrderByKode, insertOrder } from "@/lib/data";
import type { NewOrder } from "@/lib/data";
import type { OrderStatus } from "@/types";

function generateKode(): string {
  return "VLC-" + Date.now().toString().slice(-8);
}

export type CreateOrderResult = { ok: true; kode: string } | { ok: false; error: string };

export async function createOrderAction(input: {
  productId: string;
  productName: string;
  itemLabel: string;
  targetLabel: string;
  targetValue: string;
  price: number;
  adminFee: number;
  total: number;
}): Promise<CreateOrderResult> {
  if (!input?.productId?.trim() || !input?.itemLabel?.trim()) {
    return { ok: false, error: "Data pesanan tidak lengkap." };
  }
  if (!input.targetValue?.trim()) {
    return { ok: false, error: "Nomor tujuan wajib diisi." };
  }
  if (
    !Number.isFinite(input.price) ||
    input.price < 0 ||
    !Number.isFinite(input.total) ||
    input.total <= 0
  ) {
    return { ok: false, error: "Nominal pesanan tidak valid." };
  }

  const order: NewOrder = {
    kode: generateKode(),
    productId: input.productId.trim(),
    productName: input.productName.trim(),
    itemLabel: input.itemLabel.trim(),
    targetLabel: input.targetLabel.trim(),
    targetValue: input.targetValue.trim(),
    price: Math.trunc(input.price),
    adminFee: Math.trunc(input.adminFee) || 0,
    total: Math.trunc(input.total),
  };

  try {
    await insertOrder(order);
    return { ok: true, kode: order.kode };
  } catch (e) {
    console.error("[order] insert gagal:", e);
    return {
      ok: false,
      error: "Gagal mencatat pesanan. Silakan coba lagi.",
    };
  }
}

export type CheckOrderResult =
  | {
      ok: true;
      order: {
        kode: string;
        productName: string;
        itemLabel: string;
        targetLabel: string;
        targetMasked: string;
        price: number;
        adminFee: number;
        total: number;
        status: OrderStatus;
        createdAt: string;
      };
    }
  | { ok: false; error: string };

function maskTarget(value: string): string {
  const v = value.trim();
  if (v.length <= 6) return "•".repeat(v.length);
  return `${v.slice(0, 4)}${"•".repeat(Math.min(v.length - 6, 8))}${v.slice(-2)}`;
}

export async function checkOrderAction(kodeInput: string): Promise<CheckOrderResult> {
  const kode = (kodeInput ?? "").trim().toUpperCase();
  if (!/^VLC-\d{8}$/.test(kode)) {
    return {
      ok: false,
      error: "Format kode tidak valid. Contoh: VLC-96952416.",
    };
  }

  try {
    const order = await getOrderByKode(kode);
    if (!order) {
      return {
        ok: false,
        error: "Pesanan tidak ditemukan. Periksa kembali kode transaksimu.",
      };
    }
    return {
      ok: true,
      order: {
        kode: order.kode,
        productName: order.productName,
        itemLabel: order.itemLabel,
        targetLabel: order.targetLabel,
        targetMasked: maskTarget(order.targetValue),
        price: order.price,
        adminFee: order.adminFee,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    };
  } catch (e) {
    console.error("[order] check gagal:", e);
    return {
      ok: false,
      error: "Gagal memeriksa pesanan. Silakan coba lagi.",
    };
  }
}
