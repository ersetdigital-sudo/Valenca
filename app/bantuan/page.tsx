import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import HelpCenter from "@/components/bantuan/HelpCenter";
import { helpArticles } from "@/data/bantuan";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Pusat bantuan Valenca — temukan jawaban untuk transaksi, pulsa, token PLN, refund, dan layanan lainnya. Customer Care siap membantu 24 jam.",
  alternates: { canonical: "/bantuan" },
};

export default async function BantuanPage() {
  const site = await getSite();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: helpArticles.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header variant="home" />
      <main>
        <HelpCenter
          whatsapp={site.whatsapp}
          whatsappUrl={site.whatsappUrl}
          email={site.email}
          jamLayanan={site.jamLayanan}
        />
      </main>
      <Footer variant="home" />
      <JsonLd data={jsonLd} />
    </>
  );
}
