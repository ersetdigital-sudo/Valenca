import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";
import ProductManager from "@/components/admin/ProductManager";

export const metadata: Metadata = {
  title: "Produk & Harga | Admin Valenca",
  robots: { index: false, follow: false },
};

export default async function ProdukPage() {
  await requireAdmin();
  const products = await getProducts();
  return <ProductManager products={products} />;
}
