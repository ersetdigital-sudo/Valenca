import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentWizard from "@/components/payment/PaymentWizard";
import JsonLd from "@/components/JsonLd";
import { cld } from "@/lib/cloudinary";
import { getImages, getProduct, getProducts, getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
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
  const [product, site, images] = await Promise.all([
    getProduct(id),
    getSite(),
    getImages(),
  ]);
  if (!product) notFound();

  const prices = product.items.map((i) => i.price);
  const qrisUrl = cld(images.qris_url, { w: 440, fill: false });

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
      price: String(prices.length ? Math.min(...prices) : product.admin),
    },
  };

  return (
    <>
      <Header variant="home" />
      <PaymentWizard
        product={product}
        qrisUrl={qrisUrl}
        whatsapp={site.whatsapp}
      />
      <Footer variant="home" />
      <JsonLd data={jsonLd} />
    </>
  );
}
