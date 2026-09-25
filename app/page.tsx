import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import {
  WhySection,
  StepsSection,
  PromoBanner,
} from "@/components/home/Sections";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/home";
import { site } from "@/data/site";

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      description: site.description,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "Indonesian",
        telephone: `+62-${site.whatsapp.replace(/^0/, "").replace(/-/g, "")}`,
        email: site.email,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <Header variant="home" />
      <main>
        <Hero />
        <TrustBar />
        <CategoryGrid />
        <WhySection />
        <StepsSection />
        <PromoBanner />
        <Testimonials />
        <FaqSection items={faqs} />
      </main>
      <Footer variant="home" />
      <JsonLd data={jsonLd} />
    </>
  );
}
