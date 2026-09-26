import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import Button from "@/components/Button";
import { getSite } from "@/lib/data";
import type { LegalDoc } from "@/types";

export default async function LegalDocument({
  doc,
  extraLink,
}: {
  doc: LegalDoc;
  extraLink: { href: string; label: string };
}) {
  const site = await getSite();
  return (
    <>
      <Header variant="legal" extraLink={extraLink} />

      <section className="bg-navy pb-12 pt-14 text-white">
        <div className="mx-auto w-full max-w-[900px] px-5">
          <span className="mb-4 inline-block rounded-full bg-orange px-[14px] py-[6px] text-[11px] font-bold uppercase tracking-[0.16em]">
            Dokumen Legal
          </span>
          <h1 className="font-display text-[clamp(30px,5.5vw,48px)] leading-[1.12]">
            {doc.title}
          </h1>
          <p className="mt-3 max-w-[60ch] text-[15px] text-white/75">
            {doc.intro} Terakhir diperbarui:{" "}
            <strong className="text-white">{site.legalUpdated}</strong>.
          </p>
        </div>
      </section>

      <main className="pb-20 pt-[56px]">
        <div className="mx-auto w-full max-w-[900px] px-5">
          <nav className="mb-10 rounded-card border-2 border-navy bg-white px-6 py-[22px] shadow-hard">
            <h2 className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">
              Daftar Isi
            </h2>
            <ol className="grid list-decimal gap-x-6 gap-y-[6px] pl-5 min-[621px]:grid-cols-2">
              {doc.sections.map((s) => (
                <li key={s.id} className="text-sm text-ink">
                  <a href={`#${s.id}`} className="hover:text-orange hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-[38px] scroll-mt-[90px]">
              <h2 className="mb-3 flex items-baseline gap-3 font-display text-xl leading-[1.3]">
                <em className="text-[16px] not-italic text-orange">{s.num}</em>
                {s.title}
              </h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="mb-3 text-ink">
                  <RichText text={p} />
                </p>
              ))}
              {s.items && (
                <ul className="mb-3 flex list-disc flex-col gap-2 pl-5">
                  {s.items.map((it, i) => (
                    <li key={i} className="text-sm text-ink">
                      <RichText text={it} />
                    </li>
                  ))}
                </ul>
              )}
              {s.note && (
                <div className="my-[18px] rounded-btn border-l-4 border-orange bg-tint px-5 py-4 text-sm text-ink">
                  <RichText text={s.note} />
                </div>
              )}
            </section>
          ))}

          <div className="mt-[46px] rounded-card border-2 border-navy bg-white p-7 shadow-hard">
            <h3 className="mb-2 font-display text-xl">{doc.cta.title}</h3>
            <p className="mb-[18px] text-sm text-ink">
              <RichText text={doc.cta.desc} />
            </p>
            <Button variant="solid" href={doc.cta.href}>
              {doc.cta.label}
            </Button>
          </div>
        </div>
      </main>

      <Footer variant="legal" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${doc.title} | ${site.name}`,
          description: doc.description,
          url: `${site.url}/${doc.title === "Syarat & Ketentuan" ? "syarat-ketentuan" : "kebijakan-privasi"}`,
        }}
      />
    </>
  );
}
