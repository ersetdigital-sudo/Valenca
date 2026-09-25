import Container from "@/components/Container";
import SectionHead from "@/components/home/SectionHead";
import Reveal from "@/components/Reveal";
import { StarIcon } from "@/components/icons";
import { testimonials } from "@/data/home";

export default function Testimonials() {
  return (
    <section className="relative z-10 bg-white pb-20 pt-[60px]">
      <Container>
        <SectionHead
          center
          title="Apa Kata Mereka?"
          desc="Ribuan orang sudah pakai Valenca untuk bayar tagihan sehari-hari."
        />
        <div className="grid gap-[22px] min-[901px]:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="rounded-card border-2 border-line bg-white px-[22px] py-[26px] transition hover:border-navy">
                <div className="mb-3 flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} className="size-[18px] fill-warn" />
                  ))}
                </div>
                <p className="text-sm leading-[1.65] text-ink">{t.quote}</p>
                <footer className="mt-4 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full border-2 border-navy bg-orange font-display text-[15px] text-white">
                    {t.initial}
                  </div>
                  <div>
                    <b className="block text-[13px] font-bold">{t.name}</b>
                    <span className="text-[11px] text-muted">{t.city}</span>
                  </div>
                </footer>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
