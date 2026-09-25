import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentWizard from "@/components/payment/PaymentWizard";
import JsonLd from "@/components/JsonLd";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return {
    title: `Bayar ${product.nama}`,
    description: `Isi ulang dan bayar ${product.nama} di Valenca (${product.tag}). Proses cepat via QRIS, biaya admin transparan, tanpa perlu akun.`,
    alternates: { canonical: `/bayar/${product.id}` },
  };
}

export default async function BayarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Layanan ${product.nama} Valenca`,
    serviceType: product.nama,
    description: `Isi ulang dan bayar ${product.nama} (${product.tag}) via QRIS tanpa akun.`,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "ID",
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: String(Math.min(...product.items.map((i) => i.price))),
    },
  };

  return (
    <>
      <Header variant="home" />
      <PaymentWizard product={product} />
      <Footer variant="home" />
      <JsonLd data={jsonLd} />
    </>
  );
}
