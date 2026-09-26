import type { Metadata } from "next";
import { getOrders } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";
import OrderManager from "@/components/admin/OrderManager";

export const metadata: Metadata = {
  title: "Kelola Pesanan | Admin Valenca",
  robots: { index: false, follow: false },
};

export default async function PesananPage() {
  await requireAdmin();
  const orders = await getOrders();
  return <OrderManager initial={orders} />;
}
